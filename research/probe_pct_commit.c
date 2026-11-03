// 通用探针：在隔离 rime 用户目录里 select_schema 后逐字符 process_key
// 用法: ./probe <schema_id> <key_sequence>
// 目的：验证「单字也能挂 % 空格并击码」——注入字面量 "%Et"，看是否一击上屏为「少」
#include <stdio.h>
#include <string.h>
#include <rime_api.h>

int main(int argc, char *argv[]) {
    if (argc < 3) {
        printf("Usage: %s <schema_id> <key_sequence>\n", argv[0]);
        return 1;
    }
    const char *schema_id = argv[1];
    const char *keys = argv[2];

    RimeApi *rime = rime_get_api();
    if (!rime) { fprintf(stderr, "no api\n"); return 1; }

    RIME_STRUCT(RimeTraits, traits);
    traits.shared_data_dir = "/usr/share/rime-data";
    traits.user_data_dir = "/home/jackwy/tmp/yoyo-probe";
    traits.distribution_name = "Rime";
    traits.distribution_code_name = "yoyo-probe";
    traits.distribution_version = "0.1";
    traits.app_name = "rime.yoyoprobe";

    rime->setup(&traits);
    rime->initialize(&traits);

    RimeSessionId session_id = rime->create_session();
    if (!session_id) { fprintf(stderr, "no session\n"); return 1; }
    if (!rime->select_schema(session_id, schema_id)) {
        fprintf(stderr, "cannot select schema %s\n", schema_id);
        rime->destroy_session(session_id);
        return 1;
    }

    for (size_t i = 0; i < strlen(keys); ++i) {
        int ok = rime->process_key(session_id, keys[i], 0);
        RIME_STRUCT(RimeCommit, c0);
        if (rime->get_commit(session_id, &c0)) {
            printf("[key %zu '%c'] COMMIT: %s\n", i, keys[i],
                   c0.text ? c0.text : "(null)");
            rime->free_commit(&c0);
        }
        RIME_STRUCT(RimeContext, cx);
        if (rime->get_context(session_id, &cx)) {
            printf("[key %zu '%c'] preedit=[%s] cands(%d):", i, keys[i],
                   cx.composition.preedit ? cx.composition.preedit : "",
                   cx.menu.num_candidates);
            for (int k = 0; k < cx.menu.num_candidates && k < 6; ++k)
                printf(" %s", cx.menu.candidates[k].text ? cx.menu.candidates[k].text : "");
            printf("\n");
            rime->free_context(&cx);
        }
        (void)ok;
    }

    RIME_STRUCT(RimeCommit, commit);
    if (rime->get_commit(session_id, &commit)) {
        if (commit.text) printf("FINAL COMMIT: %s\n", commit.text);
        rime->free_commit(&commit);
    }

    rime->destroy_session(session_id);
    rime->finalize();
    return 0;
}
