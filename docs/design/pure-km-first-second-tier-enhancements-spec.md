# Spec: yoyo-pure-km 第一梯队与第二梯队体验增强规范 (Practice Tool, BackSpace & Punctuation Chords)

> **状态**：已批准 (Approved)  
> **关联 Issue**：[#41](https://github.com/JackTheMico/yoyo/issues/41)  
> **关联模块**：`practice_tool/generate_km_char_word_data.py`、`yoyo-pure-km.schema.yaml`、`yoyo.yaml`、`rime/lua/yoyo/km_punct.lua`

---

## Problem Statement

Users of the pure shape chord scheme (`yoyo-pure-km`, 麓鸣·纯形·空明) currently face three concrete friction points in daily typing and practice:

1. **Practice Tool Out-of-Sync Data Source**: The web-based practice tool data generator (`generate_km_char_word_data.py`) still hardcodes reading the legacy dictionary (`yoyo-bm.dict.yaml`), causing the generated practice dataset (`km_char_word_data_module.js`) to misalign with the new pure shape unified dictionary (`yoyo-pure.dict.yaml`).
2. **BackSpace Chording Friction & Preedit Pollution**: When a chording error or timing jitter occurs during composing, pressing BackSpace only deletes a single character rather than clearing the full stroke/chord. This leaves half-formed fragments in the preedit buffer, which breaks the length-based invariants of the deterministic popping state machine (`pure_popping.lua`) and forces the user to hit BackSpace multiple times before re-striking.
3. **Missing Direct Punctuation Chording**: While Chinese characters and 4-code words enjoy a seamless 0-space chording flow, typing common Chinese punctuation marks (，。！？、；：“”《》（）) still relies on 3-code strings or switching modes, interrupting continuous blind typing and hand flow.

---

## Solution

Deliver a coordinated enhancement across the toolchain, schema key-binding layer, and chording engine:

1. **Data Pipeline Modernization**: Refactor `generate_km_char_word_data.py` to parse the pure shape dictionary (`yoyo-pure.dict.yaml`), correctly handling single-hand 1-jian codes, 2-code chords, 3-code zero-collision characters (decoupling left/right structural hands for the 3rd stroke), and 4-code words.
2. **Deterministic BackSpace Reset**: Configure composing-state BackSpace and Return events to trigger `Escape` in `yoyo-pure-km.schema.yaml`, enabling single-stroke complete buffer evacuation upon chording mis-hits.
3. **100% 2-Key Direct-Commit Punctuation Chords**: Integrate 16 non-conflicting single-hand 2-key chord combinations (with automatic left/right hand mirroring) in the chording engine and Lua interceptor to enable 0-latency, 0-space direct commit of frequent Chinese punctuation marks without awkward 3-finger contortions and without polluting 1-jian single-hand letter assignments.

---

## User Stories

1. As a learner using the practice webpage, I want the practice dataset to be generated directly from `yoyo-pure.dict.yaml`, so that every single character, 1-jian code, and 4-code phrase matches the pure shape unified scheme.
2. As a learner practicing 3-code single characters, I want the practice tool steps to accurately display the structural hand division (left vs right hand) for the 3rd code, so that I can practice the 6638 zero-collision single-character muscle memory correctly.
3. As a blind-typing chorder, I want pressing BackSpace while composing to immediately clear the entire preedit buffer with a single keystroke, so that I can instantly re-strike the intended chord without lingering partial codes.
4. As a chorder who accidentally pressed the wrong chord, I want pressing Return to immediately cancel the composition without committing raw broken letters, so that my target text remains clean.
5. As a typist, I want to chord `fg` (or right-hand mirror `hj`) to directly commit a Chinese comma `，` without entering the composition buffer or pressing Space.
6. As a typist, I want to chord `ad` (or right-hand mirror `;k`) to directly commit a Chinese period `。` instantly onto the screen.
7. As a typist, I want to chord `ag` (or right-hand mirror `;h`) to directly commit a Chinese enumeration comma `、` instantly.
8. As a typist, I want to chord `xb` (or right-hand mirror `n.`) to directly commit a Chinese semicolon `；` instantly.
9. As a typist, I want to chord `eq` (or right-hand mirror `ip`) to directly commit a Chinese colon `：` instantly.
10. As a typist, I want to chord `bz` (or right-hand mirror `n/`) to directly commit a Chinese question mark `？` instantly.
11. As a typist, I want to chord `cz` (or right-hand mirror `,/`) to directly commit a Chinese exclamation mark `！` instantly.
12. As a typist, I want to chord `vb` (or right-hand mirror `nm`) to directly commit a Chinese ellipsis `……` instantly.
13. As a typist, I want to chord `rt` (or right-hand mirror `uy`) to directly commit a Chinese dash `——` instantly.
14. As a typist, I want to chord `cb` (or right-hand mirror `n,`) to directly commit a Chinese middle dot `·` instantly.
15. As a typist, I want to chord dedicated 2-key quotation toggle combinations (`db` / `kn` for `“”`, `ac` / `;,` for `‘’`, `ax` / `;.\` for `《》`, `fv` / `jm` for `（）`, `ab` / `;n` for `【】`, `dc` / `k,` for `「」`) to alternatingly commit opening and closing marks without any 3-key finger fatigue.
16. As a writer, I want punctuation chording to be completely non-conflicting with single-hand 1-jian characters (such as `_d`, `_.`, `_?`) and two-hand words (such as `f+j` for `一开始`), so that typing regular words and typing punctuation never trigger false positives.
17. As a pure shape user, I want the punctuation chording mechanism to not interfere with the 0-space FSM popping state machine (`pure_popping.lua`), ensuring 3-code single characters and 4-code words continue to pop smoothly.

---

## Implementation Decisions

- **Practice Generator Refactor**:
  - The script will read `yoyo-pure.dict.yaml` instead of `yoyo-bm.dict.yaml`.
  - The regex and parser will support:
    - 1-jian codes (`_[a-zA-Z;:,.?/<>]` left hand, `+[a-zA-Z;:,.?/<>]` right hand).
    - 2-code characters/words (`[a-zA-Z;:,.?/<>]` of length 2).
    - 3-code single characters (length 3, with 3rd character's structural hand determined by QWERTY keyboard layout halves).
    - 4-code phrases (length 4, broken into 2 consecutive two-hand chords).
- **Key-Binder BackSpace / Return Routing**:
  - In `yoyo-pure-km.schema.yaml`, add bindings to intercept `BackSpace` and `Return` when `composing`, redirecting them to `Escape`.
- **100% 2-Key Punctuation Chord Integration**:
  - Chording combinations mapped to special tokens (e.g. `~comma`, `~period`, `~dquote` etc.) in the chording algebra layer:
    - `fg` / `hj` $\to$ `~comma`（`，`）
    - `ad` / `;k` $\to$ `~period`（`。`）
    - `ag` / `;h` $\to$ `~enum_comma`（`、`）
    - `xb` / `n.` $\to$ `~semicolon`（`；`）
    - `eq` / `ip` $\to$ `~colon`（`：`）
    - `bz` / `n/` $\to$ `~question`（`？`）
    - `cz` / `,/` $\to$ `~exclamation`（`！`）
    - `vb` / `nm` $\to$ `~ellipsis`（`……`）
    - `rt` / `uy` $\to$ `~dash`（`——`）
    - `cb` / `n,` $\to$ `~middledot`（`·`）
    - `db` / `kn` $\to$ `~dquote`（`“”` toggle）
    - `ac` / `;,` $\to$ `~squote`（`‘’` toggle）
    - `ax` / `;.\` $\to$ `~book_quote`（`《》` toggle）
    - `fv` / `jm` $\to$ `~paren`（`（）` toggle）
    - `ab` / `;n` $\to$ `~bracket`（`【】` toggle）
    - `dc` / `k,` $\to$ `~corner_bracket`（`「」` toggle）
  - Lua interception placed immediately after `chord_composer` and before `speller` / `pure_popping`:
    - Intercepts punctuation tokens.
    - Immediately calls `env.engine:commit_text(...)`, clears the context, and returns `kAccepted`.
  - Quotation toggle state maintained within the Lua processor runtime (alternating between opening and closing marks on successive invocations).

---

## Testing Decisions

- **Testing External Behavior**:
  - Verify that running the data generator script generates a valid `km_char_word_data_module.js` that matches pure shape encoding rules and contains no syntax errors.
  - Verify through automated key sequence simulation that:
    - Composing buffer + BackSpace -> Buffer is completely empty (`commit` is empty, preedit length is 0).
    - 2-key punctuation chord (e.g. `bc` or `n,`) -> Commits `，` directly with preedit remaining empty.
    - 2-key quote toggle chord (e.g. `bd` or `nj`) -> First chord commits `“`, second chord commits `”`.
    - Character chording right after punctuation chording functions identically to normal typing.
    - 1-jian characters (like `_.` -> 到, `_?` -> 被) and 2-code words (like `f+j` -> 一开始) continue to work with zero regression.
- **Prior Art**:
  - `rime/scripts/test_pure_integration.py`
  - `rime/scripts/test_pure_popping.py`
  - Issue #25 & #26 punctuation design specs.

---

## Out of Scope

- Modifying the 6638 single character roots or 3-code zero-collision dictionary definitions.
- Adding large 300k vocabulary expansion (reserved for P2 milestone).
- Full English punctuation chording when typing in English mode.
- Mobile/Trime specific punctuation layout customizations.

---

## Further Notes

- All changes maintain 100% backward compatibility with `yoyo-pure.dict.yaml`.
- Punctuation toggle state resets on Rime deployment/reload to ensure deterministic initial state.
