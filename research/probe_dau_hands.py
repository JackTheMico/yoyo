import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "rime" / "scripts"))

from chord_utils import (  # noqa: E402
    KM_SCHEMA, LEFT_KEYS, RIGHT_KEYS, YOYO_YAML,
    build_pipelines, enumerate_dau, load_yaml,
)

yoyo = load_yaml(YOYO_YAML)
km = load_yaml(KM_SCHEMA)
alphabet, _ = build_pipelines(yoyo, km)["A 后置"]
f = yoyo["空明拳"]["__append"]

L = enumerate_dau(f, alphabet, LEFT_KEYS)
R = enumerate_dau(f, alphabet, RIGHT_KEYS)
print("左手码元数:", len(L), " 右手码元数:", len(R))
print("两手码元集合相同:", set(L) == set(R))
print("并集大小:", len(set(L) | set(R)))
print("左手样本:", dict(list(L.items())[:8]))
print("右手样本:", dict(list(R.items())[:8]))
for d in "lbJx.'":
    print(f"  码元 {d!r}: 左手={L.get(d)} 右手={R.get(d)}")
