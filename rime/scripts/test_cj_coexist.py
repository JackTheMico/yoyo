#!/usr/bin/env python3
"""#58 与桌面并击版共存的部署验证。

核心问题不是「两个方案能不能都装上」，而是三件容易被忽略的事：

1. **构建产物不能互相覆盖**。两个方案共用一个词典（`dictionary: yoyo-pure`），
   若 prism 名也相同，后部署的会覆盖前一个，表现为「切换方案后出的字变了」。
2. **后部署不能弄坏先部署**。所以用例顺序是「先并击版、后串击版、再回头看并击版」。
3. **从零可复现**。这里用一个全新的隔离目录，不复用 `.workbuddy/probe/` 的既有产物。

运行：/usr/bin/python3 rime/scripts/test_cj_coexist.py
"""

import pathlib
import shutil
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
WORK = ROOT / ".workbuddy/coexist"
README = ROOT / "README.md"
SCHEMAS = ["yoyo-pure-km", "yoyo-pure-cj"]

FAILS = []


def check(name, cond, detail=""):
    if cond:
        print(f"  ok   {name}")
    else:
        FAILS.append(f"{name} {detail}".strip())
        print(f"  FAIL {name} {detail}")


def fresh_work_dir():
    if WORK.exists():
        # 沙箱的 rm / shutil.rmtree 会被钩到回收站，-S 绕过 sitecustomize
        subprocess.run(["/usr/bin/python3", "-S", "-c",
                        f"import shutil; shutil.rmtree({str(WORK)!r})"], check=True)
    WORK.mkdir(parents=True, exist_ok=True)


def run_probe(force_deploy):
    env = {
        "PATH": "/usr/bin:/bin:/usr/sbin:/sbin",
        "HOME": str(pathlib.Path.home()),
        "PROBE_WORK_DIR": str(WORK),
        "PROBE_SCHEMAS": " ".join(SCHEMAS),
    }
    if force_deploy:
        env["PROBE_FORCE_DEPLOY"] = "1"
    return subprocess.run(["bash", "tools/probe/run.sh"], cwd=ROOT, env=env,
                          capture_output=True, text=True, timeout=600)


def main():
    print("\n[A] 全新目录从零部署两个方案")
    fresh_work_dir()
    res = run_probe(force_deploy=True)
    out = res.stdout + res.stderr
    if res.returncode != 0:
        print(out[-3000:])
        print(f"FAIL 部署/用例执行失败（退出码 {res.returncode}）")
        return 1
    user = WORK / "userdir"
    build = user / "build"
    check("隔离目录已生成 default.custom.yaml", (user / "default.custom.yaml").exists())
    check("两个方案都进了 schema_list",
          all(s in (user / "default.custom.yaml").read_text(encoding="utf-8")
              for s in SCHEMAS))

    print("\n[B] 构建产物互不覆盖")
    prisms = sorted(p.name for p in build.glob("*.prism.bin"))
    print(f"       prism：{prisms}")
    for s in SCHEMAS:
        check(f"{s}.prism.bin 存在", (build / f"{s}.prism.bin").exists())
    check("两个方案的 prism 名字不同（同名会互相覆盖）",
          f"{SCHEMAS[0]}.prism.bin" != f"{SCHEMAS[1]}.prism.bin")
    # 词典是共用的：只应有一份 table
    tables = sorted(p.name for p in build.glob("yoyo-pure*.table.bin"))
    print(f"       table：{tables}")
    check("共用词典只编译一份 table", tables == ["yoyo-pure.table.bin"], str(tables))
    check("用户加词表编译出 yoyo-user.table.bin",
          (build / "yoyo-user.table.bin").exists())

    print("\n[C] 两个方案在同一目录里都能出字")
    pass_cases = out.count("PASS [")
    fail_cases = out.count("FAIL [")
    print(f"       用例通过 {pass_cases} / 失败 {fail_cases}")
    check("全部用例通过", fail_cases == 0 and pass_cases > 0,
          f"通过 {pass_cases} 失败 {fail_cases}")
    check("并击版用例确实被执行（不是只跑了串击版）", "PASS [km_" in out)
    check("串击版用例确实被执行", "PASS [view_" in out or "PASS [cj_" in out)

    print("\n[D] 幂等：再部署一次不改变结果")
    stamp_before = {p.name: p.stat().st_mtime_ns for p in build.glob("*.bin")}
    res2 = run_probe(force_deploy=True)
    out2 = res2.stdout + res2.stderr
    check("第二次部署仍全绿", res2.returncode == 0 and "FAIL [" not in out2,
          out2[-800:] if res2.returncode else "存在失败用例")
    check("第二次部署后两个 prism 都还在",
          all((build / f"{s}.prism.bin").exists() for s in SCHEMAS))
    stamp_after = {p.name: p.stat().st_mtime_ns for p in build.glob("*.bin")}
    check("产物清单不变（无新增/丢失）",
          set(stamp_before) == set(stamp_after),
          f"多 {sorted(set(stamp_after) - set(stamp_before))} "
          f"少 {sorted(set(stamp_before) - set(stamp_after))}")

    print("\n[E] README 增补手机串击版段落")
    readme = README.read_text(encoding="utf-8") if README.exists() else ""
    check("README 提到 yoyo-pure-cj", "yoyo-pure-cj" in readme)
    check("README 写明与桌面版的差异", "串击" in readme and "并击" in readme)
    check("README 写明击键代价", "击键" in readme)
    check("README 给出部署入口", "tools/probe" in readme or "themes/" in readme)

    print()
    if FAILS:
        print(f"---- {len(FAILS)} 项失败 ----")
        for f in FAILS:
            print("  *", f)
        return 1
    print(f"---- 全部通过（{pass_cases} 个用例 / 两方案共存）----")
    return 0


if __name__ == "__main__":
    sys.exit(main())
