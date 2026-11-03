// 同上，但开启 log_dir，用于确认 librime-lua 插件是否加载
#include <stdio.h>
#include <string.h>
#include <rime_api.h>

int main(int argc, char *argv[]) {
    if (argc < 3) return 1;
    RimeApi *rime = rime_get_api();
    RIME_STRUCT(RimeTraits, traits);
    traits.shared_data_dir = "/usr/share/rime-data";
    traits.user_data_dir = "/home/jackwy/tmp/yoyo-probe";
    traits.log_dir = "/home/jackwy/tmp/yoyo-probe";
    traits.distribution_name = "Rime";
    traits.distribution_code_name = "yoyo-probe";
    traits.distribution_version = "0.1";
    traits.app_name = "rime.yoyoprobe2";
    traits.min_log_level = 0;

    rime->setup(&traits);
    printf("plugins loaded check: %s\n",
           rime->find_module ? (rime->find_module("lua") ? "lua FOUND" : "lua MISSING")
                             : "no find_module api");

    rime->initialize(&traits);
    RimeSessionId sid = rime->create_session();
    if (!sid) { fprintf(stderr, "no session\n"); return 1; }
    if (!rime->select_schema(sid, argv[1])) { fprintf(stderr, "no schema\n"); return 1; }
    for (size_t i = 0; i < strlen(argv[2]); ++i)
        rime->process_key(sid, argv[2][i], 0);
    RIME_STRUCT(RimeCommit, c);
    if (rime->get_commit(sid, &c) && c.text) { printf("COMMIT: %s\n", c.text); rime->free_commit(&c); }
    RIME_STRUCT(RimeContext, x);
    if (rime->get_context(sid, &x)) {
        printf("preedit=[%s] cands=%d\n", x.composition.preedit ? x.composition.preedit : "",
               x.menu.num_candidates);
        rime->free_context(&x);
    }
    rime->destroy_session(sid);
    rime->finalize();
    return 0;
}
