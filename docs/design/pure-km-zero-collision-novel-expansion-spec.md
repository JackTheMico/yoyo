# Spec: yoyo-pure-km 小说与文学写作语料零重码扩充规范 (Zero-Collision Novel Corpus Expansion)

> **状态**：待实施 (Ready for Implementation)  
> **关联 Issue**：[#42](https://github.com/JackTheMico/yoyo/issues/42)  
> **实施切片 Tickets**：
> - 🎫 **Ticket 1 ([#43](https://github.com/JackTheMico/yoyo/issues/43))**：`feat(纯形): 构建小说写作语料抽取与空码位优选流水线` `(Frontier · 可立即开始)`
> - 🎫 **Ticket 2 ([#44](https://github.com/JackTheMico/yoyo/issues/44))**：`feat(纯形): 规范词库合并与 pure_dict_map 状态机映射同步` `(Blocked by #43)`
> - 🎫 **Ticket 3 ([#45](https://github.com/JackTheMico/yoyo/issues/45))**：`test(纯形): 词库零重码不变量校验与小说连打端到端仿真测试` `(Blocked by #44)`
> - 🎫 **Ticket 4 ([#46](https://github.com/JackTheMico/yoyo/issues/46))**：`docs(纯形): 词库规模与维护指南更新及 Fcitx5 部署验证` `(Blocked by #45)`  
> **关联模块**：`rime/yoyo-pure.dict.yaml`、`rime/scripts/generate_pure_dict_map.py`、`rime/lua/yoyo/data/pure_dict_map.lua`、`rime/scripts/verify_pure_dict.py`

---

## Problem Statement

Authors and typists using `yoyo-pure-km` (麓鸣·纯形·空明) for creative writing, web novels (玄幻/仙侠/武侠/古风), and literary creation frequently encounter missing multi-character phrases, character descriptions (神态/外貌/发型/容颜), scene expressions, and idioms. 

In traditional input method expansions, adding tens of thousands of new words causes severe code collisions, polluting existing high-frequency words, increasing page-flipping frequency, and destroying the zero-space blind-typing flow of deterministic popping state machines. 

Users need a vast, high-quality novel vocabulary expansion that strictly respects the zero-collision promise of `yoyo-pure-km`—expanding 50,000+ literary words while adding **0.00% collision penalty** to the existing 6,638 zero-collision single characters and 69,415 core words.

---

## Solution

Build a **Slot-First Zero-Collision Novel Expansion Pipeline** to safely ingest 51,898 high-frequency literary and novel words:

1. **Multi-Dimensional Novel Corpus Ingestion**: Ingest and cleanse 66,427 validated literary, idiom, descriptive, and webnovel terms across 12 distinct categories from open-source lexicons (skrik2/lexicon, pwxcoo/chinese-xinhua, funNLP, THUOCL).
2. **Deterministic 4-Code Derivation**: Compute pure shape 4-code keys ($AbAcBbBc$ for 2-char, $AbBbCbCc$ for 3-char, $AbBbCbZb$ for 4+-char) using the 6,640 base character roots.
3. **Unoccupied Slot Allocation (纯空码位注入)**: Filter exclusively for 4-code keys that do not exist in `yoyo-pure.dict.yaml`. Arbitrate intra-corpus slot sharing by literary frequency, outputting exactly 51,898 unique 1-word-per-slot novel entries.
4. **FSM State Machine Synchronization**: Synchronize `pure_dict_map.lua` so the deterministic popping state machine (`pure_popping.lua`) immediately recognizes all 51,898 new words as valid 4-code targets for 0-space automatic popping and direct commit.
5. **Zero-Regression Verification**: Enforce regression tests ensuring zero collisions added to existing words, 100% pure dictionary format, and smooth end-to-end typing flow.

---

## User Stories

1. As a web novel writer, I want to type common Xianxia/Wuxia terms (such as `斗尊`, `修神`, `斗圣`, `剑圣`, `度劫`, `炼体`) with 4-code chords, so that I can write fantasy battles without falling back to slow single-character typing.
2. As a novelist, I want to type vivid facial and emotional descriptions (such as `面如冠玉`, `白净柔嫩`, `容颜枯槁`, `红白相间`) in a single 4-code chord, so that character descriptions flow seamlessly.
3. As a novelist, I want to type dynamic action sequences (such as `白鹤晾翅`, `戟指怒目`, `抚掌大笑`, `蹈厉之志`, `飞檐走壁`) without hitting Space, so that my typing rhythm matches intense fight scenes.
4. As a literary writer, I want to type appearance and apparel phrases (such as `点染曲眉`, `名嫒美姝`, `月眉星眼`, `修眉联娟`, `洁白素衣清幽淡雅`) directly onto the screen, so that prose creation is effortless.
5. As a writer, I want to type narrative transition 3-character phrases (such as `散乱在`, `该累了`, `轻一点`, `随便点`, `不在场`, `小矮人`) in 4-code chords, so that storytelling transitions are rapid.
6. As a prose author, I want to type ancient and aesthetic vocabulary (such as `层阿`, `恻怛`, `策名`, `碧城`, `偿愿`, `差肩`) with guaranteed top-candidate commit, so that classical poetry and prose typing remains undisturbed.
7. As a blind-typing chorder, I want every newly added novel word to occupy a completely empty 4-code key, so that typing any existing character or word never triggers a surprise collision or candidate displacement.
8. As a blind-typing chorder, I want the collision rate increase of this 51,898-word expansion to be exactly 0.00%, so that the input method remains 100% deterministic.
9. As a typist, I want 3-character novel words (encoded as $AbBbCbCc$) to never conflict with single-character 3-code roots, so that single-character zero-collision invariants are never violated.
10. As a writer typing a 4-character idiom (such as `风驰电掣`, `突如其来`, `出其不意`), I want the word to automatically pop and commit with the subsequent keystroke without requiring Space or Enter.
11. As a developer maintaining `yoyo-pure.dict.yaml`, I want an automated generation script (`scripts/expand_novel_dict.py`) that filters and validates novel entries against existing keys, so that future lexicon expansions can be re-run deterministically.
12. As a test engineer, I want `verify_pure_dict.py` to assert that zero illegal markers (!@()[]=) exist in the dictionary and that all 6,400 single characters remain 100% zero-collision after the expansion.
13. As a test engineer, I want `test_pure_integration.py` and `test_pure_popping_realistic.py` to pass with 0 errors across simulated novel typing sentences.
14. As a Fcitx5 user, I want `./rime/scripts/deploy_to_fcitx5.sh` to compile and deploy the enlarged pure shape dictionary seamlessly without memory or startup latency issues.
15. As a user preferring clean vocabulary, I want conflicting novel words (which would cause 2-candidate collisions with existing words) to be isolated into an optional secondary/extended dictionary rather than polluting the core dictionary.

---

## Implementation Decisions

- **Corpus Curation & Preprocessing**:
  - Source data extracted from 12 clean categories: 神态动作 (504), 外貌容貌 (692), 面庞表情 (252), 容颜身段 (388), 发型仪态 (134), 性格心理 (63), 写作三字词 (5,004), 写作通用 (1,294), 古风文雅 (909), 网文修真 (49), 古典文学 (27,936), 成语大典 (30,345).
  - Strip non-Chinese characters, restrict lengths to $2 \le L \le 10$.
- **Deterministic 4-Code Derivation**:
  - For $L=2$: $A_b A_c B_b B_c$ (Word 1 code 1-2 + Word 2 code 1-2).
  - For $L=3$: $A_b B_b C_b C_c$ (Word 1 code 1 + Word 2 code 1 + Word 3 code 1-2).
  - For $L \ge 4$: $A_b B_b C_b Z_b$ (Word 1 code 1 + Word 2 code 1 + Word 3 code 1 + Last Word code 1).
- **Slot-First Zero-Collision Allocation Policy**:
  - Compare generated 4-codes against the set of 68,317 distinct 4-codes currently in `yoyo-pure.dict.yaml`.
  - Only allocate words whose 4-code key is strictly **absent** from the existing dictionary ($C \notin \text{ExistingKeys}$).
  - When multiple new novel words share the same empty slot, select the word with the highest literary frequency / genre relevance (1 word per slot).
  - Result: Ingest exactly **51,898 pure zero-collision words**.
- **Data & State Machine Synchronization**:
  - Append selected words to `rime/yoyo-pure.dict.yaml` with normalized weights ($0$).
  - Execute `python3 rime/scripts/generate_pure_dict_map.py` to regenerate `pure_dict_map.lua` (`words_4code` set and `dict_map` table).
  - The Lua FSM (`pure_popping.lua`) automatically gains awareness of all 51,898 new 4-code sequences.

---

## Testing Decisions

- **Testing External Behavior**:
  - **Dictionary Invariant Verification (`verify_pure_dict.py`)**:
    - Verify YAML header and pure encoding format (no forbidden syntax markers).
    - Verify 1-jian entry count (240).
    - Verify 3-code single character 100% zero-collision invariant (6,400 characters).
    - Verify 4-code word count reaches $> 120,000$ entries with 0 collision increase for existing words.
  - **Deterministic State Machine Simulation (`test_pure_popping_realistic.py`)**:
    - Simulate novel sentences containing novel words, 3-code characters, 1-jian words, and 4-code core phrases.
    - Verify buffer evacuation, automatic non-word splitting, and 0-space popping correctness.
  - **End-to-End Integration Verification (`test_pure_integration.py`)**:
    - Verify whole-chord key sequences through simulated Rime pipeline.
- **Prior Art**:
  - `rime/scripts/verify_pure_dict.py`
  - `rime/scripts/test_pure_popping_realistic.py`
  - `rime/scripts/test_pure_integration.py`

---

## Out of Scope

- Modifying the 6,638 single character roots or their 3-code zero-collision assignments.
- Adding novel words that create 2-candidate collisions into the primary zero-space popping layer.
- Pinyin phonetic dictionary or tone table adjustments.
- Trime / mobile Android skin redesigns.

---

## Further Notes

- The 1,641 colliding novel words (sharing codes with existing core words) are preserved in a supplementary candidate file (`data/novel_colliding_candidates.json`) for future secondary chord apostrophe (`'`) assignment.
- All additions maintain 100% backward compatibility with `yoyo-pure` and `yoyo-pure-km`.
