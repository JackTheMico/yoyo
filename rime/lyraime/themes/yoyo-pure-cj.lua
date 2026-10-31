-- 麓鸣·纯形·串击 —— LyraIME 键盘主题
--
-- 装机路径：<LyraIME 用户数据目录>/themes/yoyo-pure-cj.lua
--   默认 <用户数据目录> = /sdcard/Documents/LyraIME（AppPrefs.kt:486），
--   themes/ 是 userThemesDir（DataManager.kt:63），跨方案包共用。
--   LyraIME 从该目录扫描 *.lua，文件名去掉 .lua 即主题 id。
--   整个方案只新增这一个文件，不改客户端源码。
--
-- 键位唯一真源是 rime/lua/yoyo/data/cj_keymap.lua（由 gen_cj_keymap.py 生成）。
-- 本文件与它的对齐由 rime/scripts/test_cj_theme.py 逐键自动比对，错一位即测试失败
-- ——因为键盘配置与 schema 字母表是两份独立数据，错一位会静默打出另一个字。
--
-- 三档落位（60 码元 = 26 + 10 + 8 + 16）：
--   字母键点击   26 个小写码元
--   数字键点击   10 个大写码元（T R S Y X Z F U H C）——长按仍出数字
--   符号键点击   8 个符号码元（, . / : ; < > ?）
--   字母键上滑   16 个大写码元（A B D E G I J K L M N O P Q V W）
--
-- 为什么大写码元走 preset key 的 `text` 而不是 Shift+字母：
--   librime 的 KeyEvent 只看 keycode，不看 Shift 位；Shift+k 送进去仍是小写 k，
--   会落到另一个合法码位打出别的字（错得静默）。实测见
--   docs/design/2026-10-26-cj-keyboard-delivery.md。

-- ── 快捷字条 ────────────────────────────────────────────────────────────────
-- 串击版取消了编码层一简，最高频字改由这一行补偿：点一下直出，不经过状态机。
-- 字表来自 rime/lua/yoyo/data/cj_quickbar.lua（由 gen_cj_quickbar.py 生成）。
local quickbar_keys = {
  key { click = "cjq01", label = "的" },
  key { click = "cjq02", label = "是" },
  key { click = "cjq03", label = "了" },
  key { click = "cjq04", label = "在" },
  key { click = "cjq05", label = "和" },
  key { click = "cjq06", label = "我" },
  key { click = "cjq07", label = "有" },
  key { click = "cjq08", label = "不" },
  key { click = "cjq09", label = "一" },
  key { click = "cjq10", label = "就" },
  key { click = "cjq11", label = "中" },
  key { click = "cjq12", label = "人" }
}

-- ── 数字行：承载 10 个大写码元，长按出数字 ──────────────────────────────────
-- 键位与码元的对应来自映射数据的 digit 层，不是随手排的：
-- 频次最高的非小写码元占用最容易够到的键位。
local digit_row = {
  key { click = "cj_H", label = "H", label_symbol = "1", long_click = "1" },
  key { click = "cj_F", label = "F", label_symbol = "2", long_click = "2" },
  key { click = "cj_X", label = "X", label_symbol = "3", long_click = "3" },
  key { click = "cj_S", label = "S", label_symbol = "4", long_click = "4" },
  key { click = "cj_T", label = "T", label_symbol = "5", long_click = "5" },
  key { click = "cj_R", label = "R", label_symbol = "6", long_click = "6" },
  key { click = "cj_Y", label = "Y", label_symbol = "7", long_click = "7" },
  key { click = "cj_Z", label = "Z", label_symbol = "8", long_click = "8" },
  key { click = "cj_U", label = "U", label_symbol = "9", long_click = "9" },
  key { click = "cj_C", label = "C", label_symbol = "0", long_click = "0" }
}

-- ── 字母区：小写码元点击，大写码元上滑 / 长按 ──────────────────────────────
-- 大写码元（16 个）同时挂 swipe_up 与 long_click：
--   开了「滑动距离」的人用上滑；没开（或不想滑）的人长按也能出大写码元。
--   LyraIME 滑动手势默认关闭（AppPrefs swipeTravel=0），long_click 不依赖该开关，
--   是更稳的兜底。没有大写码元的 10 个字母（c f h r s t u x y z）两者都不设。
local letter_rows = {
  row {
    keys = {
      key { click = "q", label = "q", label_symbol = "Q", swipe_up = "cj_Q", long_click = "cj_Q" },
      key { click = "w", label = "w", label_symbol = "W", swipe_up = "cj_W", long_click = "cj_W" },
      key { click = "e", label = "e", label_symbol = "E", swipe_up = "cj_E", long_click = "cj_E" },
      key { click = "r", label = "r" },
      key { click = "t", label = "t" },
      key { click = "y", label = "y" },
      key { click = "u", label = "u" },
      key { click = "i", label = "i", label_symbol = "I", swipe_up = "cj_I", long_click = "cj_I" },
      key { click = "o", label = "o", label_symbol = "O", swipe_up = "cj_O", long_click = "cj_O" },
      key { click = "p", label = "p", label_symbol = "P", swipe_up = "cj_P", long_click = "cj_P" }
    }
  },
  row {
    keys = {
      key { width = 0.04, click = "", spacer = true },
      key { click = "a", label = "a", label_symbol = "A", swipe_up = "cj_A", long_click = "cj_A" },
      key { click = "s", label = "s" },
      key { click = "d", label = "d", label_symbol = "D", swipe_up = "cj_D", long_click = "cj_D" },
      key { click = "f", label = "f" },
      key { click = "g", label = "g", label_symbol = "G", swipe_up = "cj_G", long_click = "cj_G" },
      key { click = "h", label = "h" },
      key { click = "j", label = "j", label_symbol = "J", swipe_up = "cj_J", long_click = "cj_J" },
      key { click = "k", label = "k", label_symbol = "K", swipe_up = "cj_K", long_click = "cj_K" },
      key { click = "l", label = "l", label_symbol = "L", swipe_up = "cj_L", long_click = "cj_L" },
      key { width = 0.04, click = "", spacer = true }
    }
  },
  row {
    keys = {
      key { click = "z", label = "z" },
      key { click = "x", label = "x" },
      key { click = "c", label = "c" },
      key { click = "v", label = "v", label_symbol = "V", swipe_up = "cj_V", long_click = "cj_V" },
      key { click = "b", label = "b", label_symbol = "B", swipe_up = "cj_B", long_click = "cj_B" },
      key { click = "n", label = "n", label_symbol = "N", swipe_up = "cj_N", long_click = "cj_N" },
      key { click = "m", label = "m", label_symbol = "M", swipe_up = "cj_M", long_click = "cj_M" },
      key { click = "BackSpace", label = "⌫", width = 0.14 }
    }
  }
}

-- ── 符号行：8 个符号码元 ────────────────────────────────────────────────────
-- 这些不是普通标点：它们是编码的一部分，送进的是 Rime 的 speller。
local symbol_row = {
  key { click = ",", label = "," },
  key { click = ".", label = "." },
  key { click = "/", label = "/" },
  key { click = ":", label = ":" },
  key { click = ";", label = ";" },
  key { click = "<", label = "<" },
  key { click = ">", label = ">" },
  key { click = "?", label = "?" }
}

local bottom_row = {
  key { click = "Mode_switch", label = "中/En", width = 0.14 },
  key { click = "space", label = "空格", width = 0.52 },
  -- 次选直出：串击状态机在 ' 上拦截，直出当前 2 码位的另一类（主单↔主词）
  key { click = "'", label = "'", width = 0.10 },
  key { click = "Return", label = "↵", width = 0.14 }
}

local cj_keyboard = {
  name = "麓鸣·纯形·串击",
  author = "yoyo",
  ascii_mode = false,
  lock = true,
  keyboard_height = 300,
  -- 快捷字条（一简替代）放在靠近空格键的底部，而非最顶行：
  -- 手机软键盘底部锚定，最顶一行最容易被屏幕高度裁切或候选条压住，
  -- 移到此处可保证一简替代行始终可见。
  rows = {
    row { keys = digit_row },
    letter_rows[1],
    letter_rows[2],
    letter_rows[3],
    row { keys = symbol_row },
    row { keys = quickbar_keys },
    row { keys = bottom_row }
  }
}

-- 大写码元（26 个）与快捷字条（12 个）的预设按键。
-- 大写码元用 text：走 onText → simulateKeySequence，实测等价于字面量 keycode。
-- 快捷字条用 commit：直接上屏，不经过 Rime——字条本来就是对编码层的补偿。
local preset_keys = {}
for _, c in ipairs({ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
                     "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" }) do
  preset_keys["cj_" .. c] = pk("cj_" .. c, { text = c, label = c })
end
for i, ch in ipairs({ "的", "是", "了", "在", "和", "我", "有", "不", "一", "就", "中", "人" }) do
  local id = string.format("cjq%02d", i)
  preset_keys[id] = pk(id, { commit = ch, label = ch })
end

return theme {
  name = "麓鸣·纯形·串击",
  version = "0.1.0",
  author = "yoyo",

  style = style {
    fonts = {
      font_list = { "symbol.ttf", "label.ttf", "latin.ttf", "comment.ttf", "han.ttf", "hanb.ttf" },
      key_size = 20,
      key_long_size = 12,
      label_size = 20,
      symbol_size = 9,
      hint_size = 10,
      candidate_size = 22,
      candidate_label_size = 14
    },
    keyboard_height = 300,
    keyboard_height_land = 200,
    horizontal_gap = 2,
    vertical_gap = 2,
    round_corner = 6,
    candidate_view_height = 28,
    comment_height = 12,
    comment_position = "RIGHT",
    candidate_label = false
  },

  preset_color_schemes = {
    scheme("yoyo_dark", {
      text_color = "0xC8C8D0",
      back_color = "0x1E1E28",
      border_color = "0x2A2A36",
      candidate_text_color = "0xD8D8E0",
      comment_text_color = "0x8A8A96",
      hilited_text_color = "0xE8E8F0",
      hilited_candidate_text_color = "0xFFD479",
      hilited_candidate_back_color = "0x33333F",
      key_text_color = "0xD8D8E0",
      key_back_color = "0x2A2A36",
      key_symbol_color = "0x8A8A96",
      keyboard_back_color = "0x1E1E28",
      preview_text_color = "0xD8D8E0",
      preview_back_color = "0x33333F",
      light_scheme = "yoyo_light",
      dark_scheme = "yoyo_dark"
    }),
    scheme("yoyo_light", {
      text_color = "0x33303A",
      back_color = "0xEEEEF2",
      border_color = "0xD8D8E0",
      candidate_text_color = "0x33303A",
      comment_text_color = "0x7A7684",
      hilited_text_color = "0x1A1820",
      hilited_candidate_text_color = "0xB2531A",
      hilited_candidate_back_color = "0xDCDCE4",
      key_text_color = "0x33303A",
      key_back_color = "0xFAFAFC",
      key_symbol_color = "0x7A7684",
      keyboard_back_color = "0xEEEEF2",
      preview_text_color = "0x33303A",
      preview_back_color = "0xDCDCE4",
      light_scheme = "yoyo_light",
      dark_scheme = "yoyo_dark"
    })
  },

  preset_keys = preset_keys,

  preset_keyboards = {
    default = cj_keyboard
  }
}
