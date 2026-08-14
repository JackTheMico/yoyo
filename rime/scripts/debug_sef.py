#!/usr/bin/env python3
"""Debug: simulate Rime xform rules on key sequence 'sef' for yoyo-bm and yoyo-wx."""
import yaml, sys

def load_rules(schema_path):
    with open(schema_path, encoding='utf-8') as f:
        data = yaml.safe_load(f)
    # Collect all xform rules from speller/algebra
    rules = []
    speller = data.get('speller', {})
    algebra = speller.get('algebra', [])
    for r in algebra:
        if isinstance(r, str) and r.startswith('xform|'):
            body = r[len('xform|'):]
            parts = body.rsplit('|', 1)
            if len(parts) == 2:
                old, new = parts
                rules.append((old, new))
    return rules

def simulate(seq, rules):
    s = seq
    print(f"  input: {repr(seq)}")
    for i, (old, new) in enumerate(rules):
        if old in s:
            s2 = s.replace(old, new, 1)
            print(f"  rule[{i:3d}] xform|{old}|{new}| => {repr(s2)}")
            s = s2
    print(f"  final:  {repr(s)}")
    return s

# yoyo-bm schema
print("=== yoyo-bm 六脉神剑 ===")
rules = load_rules('rime/yoyo-bm.schema.yaml')
for seq in ['sef', 'efs', 'e+s+f', 's+e+f']:
    print(f"\n--- seq={seq} ---")
    simulate(seq, rules)

print("\n=== yoyo-wx 六脉神剑 ===")
rules_wx = load_rules('rime/yoyo-wx.schema.yaml')
for seq in ['sef', 'efs']:
    print(f"\n--- seq={seq} ---")
    simulate(seq, rules_wx)

print("\n=== yoyo-bm-km 空明拳 ===")
rules_km = load_rules('rime/yoyo-bm-km.schema.yaml')
for seq in ['sef', 'efs']:
    print(f"\n--- seq={seq} ---")
    simulate(seq, rules_km)
