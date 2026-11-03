// 空明码并击口径探针：看一次「和弦」到底产生几个码元。
// 编译: cc -o probe_km probe_km.c $(pkg-config --cflags --libs rime)
#include <stdio.h>
#include <string.h>
#include <rime_api.h>

static void dump(RimeSessionId sid, const char *label) {
    RIME_STRUCT(RimeContext, ctx);
    if (!rime_get_api()->get_context(sid, &ctx)) { printf("  %s: <no ctx>\n", label); return; }
    printf("  %-10s preedit=[%s] cand=[", label,
           ctx.composition.preedit ? ctx.composition.preedit : "");
    if (ctx.menu.num_candidates > 0) {
        int n = ctx.menu.num_candidates < 4 ? ctx.menu.num_candidates : 4;
        for (int i = 0; i < n; i++) printf("%s%s", ctx.menu.candidates[i].text, i + 1 < n ? " " : "");
    }
    printf("]\n");
    rime_get_api()->free_context(&ctx);
}

static void try_seq(RimeSessionId sid, const char *keys) {
    printf("seq \"%s\":\n", keys);
    for (const char *p = keys; *p; p++) {
        if (*p == ' ') { rime_get_api()->process_key(sid, 0xff20, 0); continue; }
        rime_get_api()->process_key(sid, (int)*p, 0);
    }
    dump(sid, "after");
    // 清空
    rime_get_api()->process_key(sid, 0xff1b, 0);  // Escape
}

int main(int argc, char **argv) {
    RimeApi *rime = rime_get_api();
    RIME_STRUCT(RimeTraits, traits);
    traits.shared_data_dir = "/usr/share/rime-data";
    traits.user_data_dir = "/home/jackwy/tmp/km-probe";
    traits.log_dir = "/home/jackwy/tmp/km-probe";
    traits.distribution_name = "Rime";
    traits.distribution_code_name = "km-probe";
    traits.distribution_version = "0.1";
    traits.app_name = "rime.kmprobe";

    rime->setup(&traits);
    rime->initialize(&traits);
    if (rime->start_maintenance(True)) rime->join_maintenance_thread();

    RimeSessionId sid = rime->create_session();
    if (!sid) { printf("no session\n"); return 1; }
    if (!rime->select_schema(sid, "kongmingma")) { printf("select_schema FAILED\n"); return 1; }
    printf("schema=kongmingma session ok\n\n");

    const char *seqs[] = {"a", "g", "y", "s", "z", "w", "ay", "as", "sy", "g=", "s=", "="};
    for (unsigned i = 0; i < sizeof(seqs) / sizeof(seqs[0]); i++) try_seq(sid, seqs[i]);

    rime->destroy_session(sid);
    rime->finalize();
    return 0;
}
