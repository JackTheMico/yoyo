// 麓鸣黑盒探针 —— 在隔离的 rime 用户目录里跑「按键序列 → 上屏/预编辑」断言
//
// 设计要点：
//   1. 只观测外部行为（get_commit / get_context），不碰引擎内部状态。
//   2. 用例文件是纯文本 DSL，C 侧解析，无需 Python/Lua 参与断言。
//   3. 按键支持「只按下」「抬起」「Shift 修饰」三种注入方式 —— 并击方案需要抬起事件
//      才会结算和弦（chord_composer.cc: FinishChordConditionIsMet）。
//
// 用法：
//   probe --deploy                 部署（编译 schema/prism/table）后退出
//   probe <case 文件> [...]        跑用例，任一断言失败则退出码 1
//
// 用例 DSL：
//   case   <名字>                  开始一个用例（可多用例同文件）
//   schema <schema_id>             本用例使用的方案
//   option <名字> <on|off>         设置引擎选项（不占按键序号，可出现在任意位置）
//   step   <键>  <期望上屏>  <期望预编辑>
//
//   键：单字符 'a' 'A' ';' ；具名 space bs esc enter tab del
//       'S+x'   = Shift+x 修饰注入（x 为小写码元）
//       '-' 前缀 = 抬起事件（'-d'、'-S+v'）
//   期望：双引号字符串；"" = 必须为空；- = 不检查

#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <rime_api.h>

#define MAX_STEPS 128
#define TEXT_CAP 512

// 抬起位（kReleaseMask）不在 rime_api.h 里公开。实测 librime 1.17 ∈ {1<<30}：
// 1<<8 / 1<<9 等低位均无效（被当作「又按了一次」），1<<30 才能让 chord_composer 结算。
#define MOD_SHIFT (1 << 0)
static int g_release_mask = 1 << 30;

typedef struct {
  char key[64];
  int keycode;
  int mask;
  char commit[TEXT_CAP];
  char preedit[TEXT_CAP];
  int check_commit;
  int check_preedit;
  int is_option;              // 1 = 这是一个「设置选项」步骤，不是按键
  char option_name[64];
  int option_value;           // 0/1
} Step;

typedef struct {
  char name[256];
  char schema[256];
  Step steps[MAX_STEPS];
  int n_steps;
} Case;

static RimeApi *rime = NULL;
static const char *g_user_dir = NULL;
static const char *g_shared_dir = NULL;
static int g_pass_cases = 0;
static int g_fail_cases = 0;
static int g_pass_steps = 0;
static int g_fail_steps = 0;

static void init_traits(RimeTraits *traits) {
  memset(traits, 0, sizeof(*traits));
  traits->data_size = sizeof(*traits);
  traits->shared_data_dir = g_shared_dir;
  traits->user_data_dir = g_user_dir;
  traits->distribution_name = "Rime";
  traits->distribution_code_name = "yoyo-probe";
  traits->distribution_version = "1.0";
  traits->app_name = "rime.yoyoprobe";
  traits->min_log_level = 2;  // WARNING：避免 INFO 日志刷屏
}

static int parse_key_token(const char *tok, int *keycode, int *mask) {
  int m = 0;
  const char *s = tok;
  if (*s == '-') {  // 前缀 '-' = 抬起事件
    m |= g_release_mask;
    ++s;
  }
  for (;;) {
    if (s[0] == 'S' && s[1] == '+') {
      m |= MOD_SHIFT;
      s += 2;
    } else {
      break;
    }
  }
  if (*s == '\0') {
    return 0;
  }
  static const struct {
    const char *name;
    int code;
  } kNamed[] = {
      {"space", 0x20},  {"bs", 0xff08},   {"esc", 0xff1b},
      {"enter", 0xff0d}, {"tab", 0xff09}, {"del", 0xffff},
  };
  for (size_t i = 0; i < sizeof(kNamed) / sizeof(kNamed[0]); ++i) {
    if (strcmp(s, kNamed[i].name) == 0) {
      *keycode = kNamed[i].code;
      *mask = m;
      return 1;
    }
  }
  if (s[1] != '\0') {
    return 0;
  }
  *keycode = (unsigned char)s[0];
  *mask = m;
  return 1;
}

// 从行内取下一个 token：双引号包裹可含空格；返回 0 表示行尾
static int next_token(const char **p, char *out, size_t cap) {
  const char *s = *p;
  while (*s == ' ' || *s == '\t' || *s == '\r' || *s == '\n') {
    ++s;
  }
  if (*s == '\0') {
    *p = s;
    return 0;
  }
  size_t n = 0;
  if (*s == '"') {
    ++s;
    while (*s != '\0' && *s != '"') {
      if (n + 1 < cap) {
        out[n++] = *s;
      }
      ++s;
    }
    if (*s == '"') {
      ++s;
    }
  } else {
    while (*s != '\0' && *s != ' ' && *s != '\t' && *s != '\r' && *s != '\n') {
      if (n + 1 < cap) {
        out[n++] = *s;
      }
      ++s;
    }
  }
  out[n] = '\0';
  *p = s;
  return 1;
}

static int expect_value(const char *tok, char *out, size_t cap) {
  if (strcmp(tok, "-") == 0) {
    out[0] = '\0';
    return 0;  // 不检查
  }
  snprintf(out, cap, "%s", tok);
  return 1;
}

static void flush_case(const Case *c, const char *path) {
  if (c->n_steps == 0 && c->name[0] == '\0') {
    return;
  }
  RimeSessionId sid = rime->create_session();
  if (!sid) {
    printf("FAIL [%s] 无法创建会话\n", c->name);
    ++g_fail_cases;
    return;
  }
  if (!rime->select_schema(sid, c->schema)) {
    printf("FAIL [%s] 无法选择方案 '%s'（是否未部署？）\n", c->name, c->schema);
    ++g_fail_cases;
    rime->destroy_session(sid);
    return;
  }
  int case_fail = 0;
  int key_no = 0;
  for (int i = 0; i < c->n_steps; ++i) {
    const Step *st = &c->steps[i];
    if (st->is_option) {
      // 选项步骤不计入断言，也不占按键序号
      rime->set_option(sid, st->option_name, st->option_value ? True : False);
      continue;
    }
    ++key_no;
    rime->process_key(sid, st->keycode, st->mask);

    char got_commit[TEXT_CAP] = "";
    RIME_STRUCT(RimeCommit, cm);
    if (rime->get_commit(sid, &cm)) {
      if (cm.text) {
        snprintf(got_commit, sizeof(got_commit), "%s", cm.text);
      }
      rime->free_commit(&cm);
    }
    char got_preedit[TEXT_CAP] = "";
    RIME_STRUCT(RimeContext, ctx);
    if (rime->get_context(sid, &ctx)) {
      if (ctx.composition.preedit) {
        snprintf(got_preedit, sizeof(got_preedit), "%s", ctx.composition.preedit);
      }
      rime->free_context(&ctx);
    }

    int commit_ok = !st->check_commit || strcmp(got_commit, st->commit) == 0;
    int preedit_ok = !st->check_preedit || strcmp(got_preedit, st->preedit) == 0;
    if (commit_ok && preedit_ok) {
      ++g_pass_steps;
      continue;
    }
    ++g_fail_steps;
    case_fail = 1;
    if (!commit_ok) {
      printf("FAIL [%s] 第 %d 键 '%s'：期望上屏 \"%s\"，实际 \"%s\"；当时预编辑 \"%s\"\n",
             c->name, key_no, st->key, st->commit, got_commit, got_preedit);
    } else {
      printf("FAIL [%s] 第 %d 键 '%s'：期望预编辑 \"%s\"，实际 \"%s\"；当时上屏 \"%s\"\n",
             c->name, key_no, st->key, st->preedit, got_preedit, got_commit);
    }
  }
  rime->destroy_session(sid);
  if (case_fail) {
    ++g_fail_cases;
  } else {
    ++g_pass_cases;
    printf("PASS [%s] (%s, %d 键)\n", c->name, path, key_no);
  }
}

static int load_cases(const char *path) {
  FILE *f = fopen(path, "r");
  if (!f) {
    fprintf(stderr, "probe: 打不开用例文件 %s\n", path);
    return 1;
  }
  Case cur;
  memset(&cur, 0, sizeof(cur));
  char line[1024];
  int lineno = 0;
  int errors = 0;
  while (fgets(line, sizeof(line), f)) {
    ++lineno;
    char *hash = strchr(line, '#');
    if (hash) {
      *hash = '\0';
    }
    const char *p = line;
    char tok[256];
    if (!next_token(&p, tok, sizeof(tok))) {
      continue;
    }
    if (strcmp(tok, "case") == 0) {
      flush_case(&cur, path);
      memset(&cur, 0, sizeof(cur));
      if (!next_token(&p, tok, sizeof(tok))) {
        fprintf(stderr, "probe: %s:%d case 缺少名字\n", path, lineno);
        ++errors;
        continue;
      }
      snprintf(cur.name, sizeof(cur.name), "%s", tok);
    } else if (strcmp(tok, "schema") == 0) {
      if (!next_token(&p, tok, sizeof(tok))) {
        fprintf(stderr, "probe: %s:%d schema 缺少值\n", path, lineno);
        ++errors;
        continue;
      }
      snprintf(cur.schema, sizeof(cur.schema), "%s", tok);
    } else if (strcmp(tok, "option") == 0) {
      char nm[64], val[16];
      if (!next_token(&p, nm, sizeof(nm)) || !next_token(&p, val, sizeof(val))) {
        fprintf(stderr, "probe: %s:%d option 需要 <名字> <on|off>\n", path, lineno);
        ++errors;
        continue;
      }
      if (cur.n_steps >= MAX_STEPS) {
        fprintf(stderr, "probe: %s:%d 单用例超过 %d 步\n", path, lineno, MAX_STEPS);
        ++errors;
        continue;
      }
      Step *st = &cur.steps[cur.n_steps];
      memset(st, 0, sizeof(*st));
      st->is_option = 1;
      snprintf(st->option_name, sizeof(st->option_name), "%s", nm);
      st->option_value = (strcmp(val, "on") == 0 || strcmp(val, "true") == 0);
      if (strcmp(val, "on") != 0 && strcmp(val, "off") != 0 &&
          strcmp(val, "true") != 0 && strcmp(val, "false") != 0) {
        fprintf(stderr, "probe: %s:%d option 值只能是 on/off，收到 '%s'\n", path, lineno, val);
        ++errors;
        continue;
      }
      ++cur.n_steps;
    } else if (strcmp(tok, "step") == 0) {
      char k[64], ec[TEXT_CAP], ep[TEXT_CAP];
      if (!next_token(&p, k, sizeof(k))) {
        fprintf(stderr, "probe: %s:%d step 缺少键\n", path, lineno);
        ++errors;
        continue;
      }
      if (!next_token(&p, ec, sizeof(ec))) {
        snprintf(ec, sizeof(ec), "-");
      }
      if (!next_token(&p, ep, sizeof(ep))) {
        snprintf(ep, sizeof(ep), "-");
      }
      if (cur.n_steps >= MAX_STEPS) {
        fprintf(stderr, "probe: %s:%d 单用例超过 %d 步\n", path, lineno, MAX_STEPS);
        ++errors;
        continue;
      }
      Step *st = &cur.steps[cur.n_steps];
      memset(st, 0, sizeof(*st));
      snprintf(st->key, sizeof(st->key), "%s", k);
      if (!parse_key_token(k, &st->keycode, &st->mask)) {
        fprintf(stderr, "probe: %s:%d 无法解析键 '%s'\n", path, lineno, k);
        ++errors;
        continue;
      }
      st->check_commit = expect_value(ec, st->commit, sizeof(st->commit));
      st->check_preedit = expect_value(ep, st->preedit, sizeof(st->preedit));
      ++cur.n_steps;
    } else {
      fprintf(stderr, "probe: %s:%d 未知指令 '%s'\n", path, lineno, tok);
      ++errors;
    }
  }
  flush_case(&cur, path);
  fclose(f);
  return errors;
}

// 观察模式：只打印、不断言，用于在写用例前摸清引擎实际行为
static int trace_mode(int argc, char **argv) {
  if (argc < 4) {
    fprintf(stderr, "用法: probe --trace <schema_id> <键> [键 ...]\n");
    return 2;
  }
  RimeSessionId sid = rime->create_session();
  if (!sid) {
    fprintf(stderr, "probe: 无法创建会话\n");
    return 2;
  }
  if (!rime->select_schema(sid, argv[2])) {
    fprintf(stderr, "probe: 无法选择方案 '%s'\n", argv[2]);
    return 2;
  }
  for (int i = 3; i < argc; ++i) {
    int keycode = 0, mask = 0;
    if (!parse_key_token(argv[i], &keycode, &mask)) {
      fprintf(stderr, "probe: 无法解析键 '%s'\n", argv[i]);
      continue;
    }
    rime->process_key(sid, keycode, mask);
    char got_commit[TEXT_CAP] = "";
    RIME_STRUCT(RimeCommit, cm);
    if (rime->get_commit(sid, &cm)) {
      if (cm.text) {
        snprintf(got_commit, sizeof(got_commit), "%s", cm.text);
      }
      rime->free_commit(&cm);
    }
    char got_preedit[TEXT_CAP] = "";
    int ncand = 0;
    char cand0[TEXT_CAP] = "";
    RIME_STRUCT(RimeContext, ctx);
    if (rime->get_context(sid, &ctx)) {
      if (ctx.composition.preedit) {
        snprintf(got_preedit, sizeof(got_preedit), "%s", ctx.composition.preedit);
      }
      ncand = ctx.menu.num_candidates;
      if (ncand > 0 && ctx.menu.candidates[0].text) {
        snprintf(cand0, sizeof(cand0), "%s", ctx.menu.candidates[0].text);
      }
      rime->free_context(&ctx);
    }
    printf("%2d %-8s commit=\"%s\" input=\"%s\" preedit=\"%s\" cands=%d top=%s\n", i - 2,
           argv[i], got_commit, rime->get_input(sid) ? rime->get_input(sid) : "",
           got_preedit, ncand, cand0);
  }
  rime->destroy_session(sid);
  return 0;
}

// 模拟模式：走 simulate_key_sequence —— 与 Trime/LyraIME 的「文本动作」完全同一条通路
// （CommonKeyboardActionListener.onText -> simulateKeySequence -> 原生 simulate_key_sequence）。
// 用于回答「键盘层怎么把一个大写码元送达 speller」。
static int sim_mode(int argc, char **argv) {
  if (argc < 4) {
    fprintf(stderr, "用法: probe --sim <schema_id> <文本> [文本 ...]\n");
    return 2;
  }
  RimeSessionId sid = rime->create_session();
  if (!sid) {
    fprintf(stderr, "probe: 无法创建会话\n");
    return 2;
  }
  if (!rime->select_schema(sid, argv[2])) {
    fprintf(stderr, "probe: 无法选择方案 '%s'\n", argv[2]);
    return 2;
  }
  for (int i = 3; i < argc; ++i) {
    rime->simulate_key_sequence(sid, argv[i]);
    char got_commit[TEXT_CAP] = "";
    RIME_STRUCT(RimeCommit, cm);
    if (rime->get_commit(sid, &cm)) {
      if (cm.text) {
        snprintf(got_commit, sizeof(got_commit), "%s", cm.text);
      }
      rime->free_commit(&cm);
    }
    char got_preedit[TEXT_CAP] = "";
    RIME_STRUCT(RimeContext, ctx);
    if (rime->get_context(sid, &ctx)) {
      if (ctx.composition.preedit) {
        snprintf(got_preedit, sizeof(got_preedit), "%s", ctx.composition.preedit);
      }
      rime->free_context(&ctx);
    }
    printf("%2d sim(\"%s\") commit=\"%s\" input=\"%s\" preedit=\"%s\"\n", i - 2, argv[i],
           got_commit, rime->get_input(sid) ? rime->get_input(sid) : "", got_preedit);
  }
  rime->destroy_session(sid);
  return 0;
}

int main(int argc, char **argv) {
  if (argc < 2) {
    fprintf(stderr,
            "用法: %s --deploy | <case 文件> [...]\n"
            "环境变量: PROBE_USER_DIR（隔离用户目录，必须）\n"
            "          PROBE_SHARED_DIR（默认 /usr/share/rime-data）\n",
            argv[0]);
    return 2;
  }
  g_user_dir = getenv("PROBE_USER_DIR");
  if (!g_user_dir || !*g_user_dir) {
    fprintf(stderr, "probe: 必须设置 PROBE_USER_DIR（隔离的 rime 用户目录）\n");
    return 2;
  }
  g_shared_dir = getenv("PROBE_SHARED_DIR");
  if (!g_shared_dir || !*g_shared_dir) {
    g_shared_dir = "/usr/share/rime-data";
  }
  {
    const char *rm = getenv("PROBE_RELEASE_MASK");
    if (rm && *rm) {
      g_release_mask = atoi(rm);
    }
  }

  rime = rime_get_api();
  if (!rime) {
    fprintf(stderr, "probe: 无 librime（缺 librime.so）\n");
    return 2;
  }

  RimeTraits traits;
  init_traits(&traits);

  if (strcmp(argv[1], "--deploy") == 0) {
    rime->setup(&traits);
    rime->deployer_initialize(&traits);
    rime->deploy();
    rime->join_maintenance_thread();
    rime->finalize();
    printf("deploy ok: %s\n", g_user_dir);
    return 0;
  }

  rime->setup(&traits);
  rime->initialize(&traits);
  rime->join_maintenance_thread();

  int errors = 0;
  if (strcmp(argv[1], "--trace") == 0) {
    int rc = trace_mode(argc, argv);
    rime->finalize();
    return rc;
  }
  if (strcmp(argv[1], "--sim") == 0) {
    int rc = sim_mode(argc, argv);
    rime->finalize();
    return rc;
  }
  for (int i = 1; i < argc; ++i) {
    errors += load_cases(argv[i]);
  }

  rime->finalize();

  printf("---- 用例 %d 通过 / %d 失败，按键 %d 通过 / %d 失败 ----\n", g_pass_cases,
         g_fail_cases, g_pass_steps, g_fail_steps);
  if (errors) {
    fprintf(stderr, "probe: 用例文件有 %d 处语法错误\n", errors);
  }
  return (g_fail_cases == 0 && errors == 0) ? 0 : 1;
}
