// 反查候选注释宽度探针：实测 comment 的字符数与显示宽度
// 用法: ./probe_comment <user_dir> <schema_id> <keys> [option_to_enable]
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <rime_api.h>

typedef struct {
    int chars;      // 码点数
    int narrow;     // ambiguous 按 1 列算
    int wide;       // ambiguous 按 2 列算（CJK 字体常见）
    int ambiguous;  // ambiguous 字符个数
} Meas;

static int utf8_decode(const unsigned char *s, unsigned *cp) {
    if (s[0] < 0x80) { *cp = s[0]; return 1; }
    if ((s[0] & 0xE0) == 0xC0) { *cp = ((s[0] & 0x1F) << 6) | (s[1] & 0x3F); return 2; }
    if ((s[0] & 0xF0) == 0xE0) { *cp = ((s[0] & 0x0F) << 12) | ((s[1] & 0x3F) << 6) | (s[2] & 0x3F); return 3; }
    if ((s[0] & 0xF8) == 0xF0) { *cp = ((s[0] & 0x07) << 18) | ((s[1] & 0x3F) << 12) | ((s[2] & 0x3F) << 6) | (s[3] & 0x3F); return 4; }
    *cp = s[0]; return 1;
}

static int is_wide(unsigned cp) {
    return (cp >= 0x1100 && cp <= 0x115F) || (cp >= 0x2E80 && cp <= 0xA4CF) ||
           (cp >= 0xAC00 && cp <= 0xD7A3) || (cp >= 0xF900 && cp <= 0xFAFF) ||
           (cp >= 0xFE30 && cp <= 0xFE6F) || (cp >= 0xFF00 && cp <= 0xFF60) ||
           (cp >= 0xFFE0 && cp <= 0xFFE6) || (cp >= 0x20000 && cp <= 0x3FFFD);
}

static int is_ambiguous(unsigned cp) {
    return cp == 0x00B7 ||                       // · 中间点
           (cp >= 0x2460 && cp <= 0x24FF) ||     // ① ⒈ 等圈数字
           (cp >= 0x2010 && cp <= 0x2027) ||     // 引号破折号等标点
           (cp >= 0x2030 && cp <= 0x205E);
}

static Meas measure(const char *s) {
    Meas m = {0, 0, 0, 0};
    if (!s) return m;
    const unsigned char *p = (const unsigned char *)s;
    while (*p) {
        unsigned cp;
        int n = utf8_decode(p, &cp);
        p += n;
        m.chars++;
        if (is_wide(cp)) { m.narrow += 2; m.wide += 2; }
        else if (is_ambiguous(cp)) { m.narrow += 1; m.wide += 2; m.ambiguous++; }
        else { m.narrow += 1; m.wide += 1; }
    }
    return m;
}

int main(int argc, char *argv[]) {
    if (argc < 4) {
        printf("Usage: %s <user_dir> <schema_id> <keys> [enable_option|disable:opt]\n", argv[0]);
        return 1;
    }
    const char *user_dir = argv[1];
    const char *schema_id = argv[2];
    const char *keys = argv[3];

    RimeApi *rime = rime_get_api();
    if (!rime) { fprintf(stderr, "no api\n"); return 1; }

    RIME_STRUCT(RimeTraits, traits);
    traits.shared_data_dir = "/usr/share/rime-data";
    traits.user_data_dir = user_dir;
    traits.distribution_name = "Rime";
    traits.distribution_code_name = "yoyo-probe";
    traits.distribution_version = "0.1";
    traits.app_name = "rime.yoyoprobe";

    rime->setup(&traits);
    rime->initialize(&traits);

    RimeSessionId sid = rime->create_session();
    if (!sid) { fprintf(stderr, "no session\n"); return 1; }
    if (!rime->select_schema(sid, schema_id)) {
        fprintf(stderr, "cannot select schema %s\n", schema_id);
        return 1;
    }

    if (argc >= 5) {
        if (strncmp(argv[4], "disable:", 8) == 0) {
            rime->set_option(sid, argv[4] + 8, False);
        } else {
            rime->set_option(sid, argv[4], True);
        }
    }

    for (size_t i = 0; i < strlen(keys); ++i) {
        rime->process_key(sid, keys[i], 0);
    }

    RIME_STRUCT(RimeContext, ctx);
    if (rime->get_context(sid, &ctx)) {
        if (ctx.composition.preedit) printf("PREEDIT: %s\n", ctx.composition.preedit);
        printf("CANDIDATES: %d  (page_size=%d)\n", ctx.menu.num_candidates, ctx.menu.page_size);

        int max_line_narrow = 0, max_line_wide = 0;
        for (int i = 0; i < ctx.menu.num_candidates && i < ctx.menu.page_size; ++i) {
            const char *text = ctx.menu.candidates[i].text ? ctx.menu.candidates[i].text : "";
            const char *cmt = ctx.menu.candidates[i].comment ? ctx.menu.candidates[i].comment : "";
            Meas mt = measure(text), mc = measure(cmt);
            // 一行 = 标签(按 2 列) + 空格 + text + 空格 + comment
            int line_narrow = 2 + 1 + mt.narrow + (mc.chars ? 1 + mc.narrow : 0);
            int line_wide = 2 + 1 + mt.wide + (mc.chars ? 1 + mc.wide : 0);
            if (i == 0 || line_narrow > max_line_narrow) max_line_narrow = line_narrow;
            if (i == 0 || line_wide > max_line_wide) max_line_wide = line_wide;
            printf("  [%d] %-4s | cmt=%-18s | cmt %2d字 %2d列(窄 %2d) | 行 %2d/%2d列\n",
                   i, text, cmt, mc.chars, mc.wide, mc.narrow, line_narrow, line_wide);
        }
        printf("PAGE_MAX_WIDTH: narrow=%d wide=%d\n", max_line_narrow, max_line_wide);
        rime->free_context(&ctx);
    }

    rime->destroy_session(sid);
    rime->finalize();
    return 0;
}
