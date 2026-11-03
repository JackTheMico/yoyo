// 探针 v3：手动 dlopen librime-lua 插件并调用 rime_register_module，
// 让 lua_processor@*yoyo.* 在独立进程里也能生效。
#include <dlfcn.h>
#include <stdio.h>
#include <string.h>
#include <rime_api.h>

typedef void (*register_fn)(void);

static int load_lua_plugin(void) {
    void *h = dlopen("/usr/lib/rime-plugins/librime-lua.so", RTLD_NOW | RTLD_GLOBAL);
    if (!h) { fprintf(stderr, "dlopen failed: %s\n", dlerror()); return 0; }
    /* 导出符号是 C++ 修饰的 rime_require_module_lua() */
    register_fn fn = (register_fn)dlsym(h, "_Z23rime_require_module_luav");
    if (!fn) fn = (register_fn)dlsym(h, "rime_require_module_lua");
    if (!fn) { fprintf(stderr, "dlsym rime_require_module_lua failed\n"); return 0; }
    fn();
    return 1;
}

int main(int argc, char *argv[]) {
    if (argc < 3) {
        printf("Usage: %s <schema_id> <key_sequence>\n", argv[0]);
        return 1;
    }
    RimeApi *rime = rime_get_api();
    RIME_STRUCT(RimeTraits, traits);
    traits.shared_data_dir = "/usr/share/rime-data";
    traits.user_data_dir = "/home/jackwy/tmp/yoyo-probe";
    traits.log_dir = "/home/jackwy/tmp/yoyo-probe";
    traits.distribution_name = "Rime";
    traits.distribution_code_name = "yoyo-probe";
    traits.distribution_version = "0.1";
    traits.app_name = "rime.yoyoprobe3";

    rime->setup(&traits);
    printf("lua plugin dlopen: %s\n", load_lua_plugin() ? "ok" : "FAILED");
    printf("lua module registered: %s\n",
           rime->find_module("lua") ? "yes" : "no");

    rime->initialize(&traits);
    RimeSessionId sid = rime->create_session();
    if (!sid) { fprintf(stderr, "no session\n"); return 1; }
    if (!rime->select_schema(sid, argv[1])) { fprintf(stderr, "no schema\n"); return 1; }

    for (size_t i = 0; i < strlen(argv[2]); ++i) {
        rime->process_key(sid, argv[2][i], 0);
        RIME_STRUCT(RimeCommit, c0);
        if (rime->get_commit(sid, &c0)) {
            printf("  [key %zu '%c'] COMMIT: %s\n", i, argv[2][i],
                   c0.text ? c0.text : "(null)");
            rime->free_commit(&c0);
        }
        RIME_STRUCT(RimeContext, cx);
        if (rime->get_context(sid, &cx)) {
            printf("  [key %zu '%c'] preedit=[%s] cands=%d\n", i, argv[2][i],
                   cx.composition.preedit ? cx.composition.preedit : "",
                   cx.menu.num_candidates);
            rime->free_context(&cx);
        }
    }

    RIME_STRUCT(RimeCommit, commit);
    if (rime->get_commit(sid, &commit)) {
        if (commit.text) printf("FINAL COMMIT: %s\n", commit.text);
        rime->free_commit(&commit);
    }
    rime->destroy_session(sid);
    rime->finalize();
    return 0;
}
