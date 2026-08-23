// 空明拳（yoyo-km）常用单字 / 常用词组 / 一简字词练习数据 —— 由 generate_km_char_word_data.py 生成，请勿手改。
// 数据来源：rime/yoyo-bm.dict.yaml（麓鸣·北冥·空明）。
// steps 表示一次输入需要进行的并击步骤（不含 space，由前端按体系决定）：
//   hand=both 双手并击；hand=left/right 单手并击；hand=either 单手左右皆可。
//
// 常用单字 / 常用词组各分三段（按词频降序）：
//   KM_CHARS[0] = 前 500，KM_CHARS[1] = 中 500，KM_CHARS[2] = 后 500
//   KM_WORDS[0] = 前 500，KM_WORDS[1] = 中 500，KM_WORDS[2] = 后 500
// 每个字/词若有一简码则优先用一简码（steps 只有一步，hand=left/right）。
// 全部一简字词：240 个（单字 120 + 词组 120）

// 常用单字（1500 个，分 3 段）
const KM_CHARS = [
  [
    {
      "char": "的",
      "code": "_d",
      "steps": [
        {
          "target": [
            "d"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "是",
      "code": "_w",
      "steps": [
        {
          "target": [
            "w"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "了",
      "code": "_s",
      "steps": [
        {
          "target": [
            "s"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "在",
      "code": "_e",
      "steps": [
        {
          "target": [
            "e"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "和",
      "code": "_x",
      "steps": [
        {
          "target": [
            "x"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "我",
      "code": "_t",
      "steps": [
        {
          "target": [
            "t"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "有",
      "code": "+e",
      "steps": [
        {
          "target": [
            "e"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "不",
      "code": "_c",
      "steps": [
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "一",
      "code": "_f",
      "steps": [
        {
          "target": [
            "f"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "就",
      "code": "+s",
      "steps": [
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "中",
      "code": "_b",
      "steps": [
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "人",
      "code": "_r",
      "steps": [
        {
          "target": [
            "r"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "也",
      "code": "_z",
      "steps": [
        {
          "target": [
            "z"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "很",
      "code": "_g",
      "steps": [
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "你",
      "code": "_a",
      "steps": [
        {
          "target": [
            "a"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "都",
      "code": "_q",
      "steps": [
        {
          "target": [
            "q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "上",
      "code": "+x",
      "steps": [
        {
          "target": [
            "x"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "会",
      "code": "+r",
      "steps": [
        {
          "target": [
            "r"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "为",
      "code": "_O",
      "steps": [
        {
          "target": [
            "O"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "这",
      "code": "_v",
      "steps": [
        {
          "target": [
            "v"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "好",
      "code": "_Z",
      "steps": [
        {
          "target": [
            "Z"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "到",
      "code": "_.",
      "steps": [
        {
          "target": [
            "."
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "对",
      "code": "+v",
      "steps": [
        {
          "target": [
            "v"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "大",
      "code": "_T",
      "steps": [
        {
          "target": [
            "T"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "他",
      "code": "+a",
      "steps": [
        {
          "target": [
            "a"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "等",
      "code": "[cV]=z",
      "steps": [
        {
          "target": [
            "c",
            "V"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "要",
      "code": "+t",
      "steps": [
        {
          "target": [
            "t"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "多",
      "code": "_S",
      "steps": [
        {
          "target": [
            "S"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "还",
      "code": "+c",
      "steps": [
        {
          "target": [
            "c"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "年",
      "code": "_K",
      "steps": [
        {
          "target": [
            "K"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "说",
      "code": "_u",
      "steps": [
        {
          "target": [
            "u"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "去",
      "code": "_V",
      "steps": [
        {
          "target": [
            "V"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "来",
      "code": "+z",
      "steps": [
        {
          "target": [
            "z"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "与",
      "code": "+f",
      "steps": [
        {
          "target": [
            "f"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "能",
      "code": "_B",
      "steps": [
        {
          "target": [
            "B"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "后",
      "code": "_y",
      "steps": [
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "被",
      "code": "_?",
      "steps": [
        {
          "target": [
            "?"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "时",
      "code": "[wz]-c",
      "steps": [
        {
          "target": [
            "w",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "以",
      "code": "_h",
      "steps": [
        {
          "target": [
            "h"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "更",
      "code": "+g",
      "steps": [
        {
          "target": [
            "g"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "将",
      "code": "+?",
      "steps": [
        {
          "target": [
            "?"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "但",
      "code": "[aw]-f",
      "steps": [
        {
          "target": [
            "a",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "小",
      "code": "_E",
      "steps": [
        {
          "target": [
            "E"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "而",
      "code": "+B",
      "steps": [
        {
          "target": [
            "B"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "看",
      "code": "_i",
      "steps": [
        {
          "target": [
            "i"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "个",
      "code": "[rc]=s",
      "steps": [
        {
          "target": [
            "r",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "用",
      "code": "+q",
      "steps": [
        {
          "target": [
            "q"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "过",
      "code": "[zp]-c",
      "steps": [
        {
          "target": [
            "z",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "最",
      "code": "[wF]=v",
      "steps": [
        {
          "target": [
            "w",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "v"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "吃",
      "code": "+b",
      "steps": [
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "让",
      "code": "+u",
      "steps": [
        {
          "target": [
            "u"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "并",
      "code": "_X",
      "steps": [
        {
          "target": [
            "X"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "日",
      "code": "+w",
      "steps": [
        {
          "target": [
            "w"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "可",
      "code": "[xk]",
      "steps": [
        {
          "target": [
            "x",
            "k"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "下",
      "code": "[fx]=b",
      "steps": [
        {
          "target": [
            "f",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "做",
      "code": "[a/]-a",
      "steps": [
        {
          "target": [
            "a",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "地",
      "code": "+V",
      "steps": [
        {
          "target": [
            "V"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "于",
      "code": "[fe]=s",
      "steps": [
        {
          "target": [
            "f",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "从",
      "code": "_m",
      "steps": [
        {
          "target": [
            "m"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "没",
      "code": "_n",
      "steps": [
        {
          "target": [
            "n"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "新",
      "code": "_C",
      "steps": [
        {
          "target": [
            "C"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "里",
      "code": "_P",
      "steps": [
        {
          "target": [
            "P"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "给",
      "code": "_R",
      "steps": [
        {
          "target": [
            "R"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "着",
      "code": "_Q",
      "steps": [
        {
          "target": [
            "Q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "高",
      "code": "[sg]",
      "steps": [
        {
          "target": [
            "s",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "家",
      "code": "_j",
      "steps": [
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "想",
      "code": "_o",
      "steps": [
        {
          "target": [
            "o"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "点",
      "code": "_U",
      "steps": [
        {
          "target": [
            "U"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "出",
      "code": "_Y",
      "steps": [
        {
          "target": [
            "Y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "或",
      "code": "+U",
      "steps": [
        {
          "target": [
            "U"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "她",
      "code": "+Z",
      "steps": [
        {
          "target": [
            "Z"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "之",
      "code": "_L",
      "steps": [
        {
          "target": [
            "L"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "太",
      "code": "+T",
      "steps": [
        {
          "target": [
            "T"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "本",
      "code": "+n",
      "steps": [
        {
          "target": [
            "n"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "得",
      "code": "[gw]-z",
      "steps": [
        {
          "target": [
            "g",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "其",
      "code": "[dq]",
      "steps": [
        {
          "target": [
            "d",
            "q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "把",
      "code": "+i",
      "steps": [
        {
          "target": [
            "i"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "第",
      "code": "[cP]=f",
      "steps": [
        {
          "target": [
            "c",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "又",
      "code": "[vy]",
      "steps": [
        {
          "target": [
            "v",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "比",
      "code": "+h",
      "steps": [
        {
          "target": [
            "h"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "再",
      "code": "_,",
      "steps": [
        {
          "target": [
            ","
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "前",
      "code": "+X",
      "steps": [
        {
          "target": [
            "X"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "买",
      "code": "_A",
      "steps": [
        {
          "target": [
            "A"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "那",
      "code": "+A",
      "steps": [
        {
          "target": [
            "A"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "如",
      "code": "[Zb]-k",
      "steps": [
        {
          "target": [
            "Z",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "该",
      "code": "[uL]-h",
      "steps": [
        {
          "target": [
            "u",
            "L"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "啊",
      "code": "[bY]-x",
      "steps": [
        {
          "target": [
            "b",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "吧",
      "code": "[bT]-b",
      "steps": [
        {
          "target": [
            "b",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "书",
      "code": "[AA]=O",
      "steps": [
        {
          "target": [
            "A",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "O"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "成",
      "code": "_;",
      "steps": [
        {
          "target": [
            ";"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "所",
      "code": "+Q",
      "steps": [
        {
          "target": [
            "Q"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "元",
      "code": "+E",
      "steps": [
        {
          "target": [
            "E"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "们",
      "code": "[aI]-m",
      "steps": [
        {
          "target": [
            "a",
            "I"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "才",
      "code": "[et]=p",
      "steps": [
        {
          "target": [
            "e",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "及",
      "code": "[sj]",
      "steps": [
        {
          "target": [
            "s",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "内",
      "code": "[Bn]",
      "steps": [
        {
          "target": [
            "B",
            "n"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "请",
      "code": "[u>]-H",
      "steps": [
        {
          "target": [
            "u",
            ">"
          ],
          "hand": "both"
        },
        {
          "target": [
            "H"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "者",
      "code": "[qz]",
      "steps": [
        {
          "target": [
            "q",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "只",
      "code": "[bX]=b",
      "steps": [
        {
          "target": [
            "b",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "月",
      "code": "_H",
      "steps": [
        {
          "target": [
            "H"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "长",
      "code": "[uc]",
      "steps": [
        {
          "target": [
            "u",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "三",
      "code": "+d",
      "steps": [
        {
          "target": [
            "d"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "性",
      "code": "_:",
      "steps": [
        {
          "target": [
            ":"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "它",
      "code": "+j",
      "steps": [
        {
          "target": [
            "j"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "吗",
      "code": "[b/]-m",
      "steps": [
        {
          "target": [
            "b",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "开",
      "code": "[fp]=c",
      "steps": [
        {
          "target": [
            "f",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "由",
      "code": "[By]",
      "steps": [
        {
          "target": [
            "B",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "国",
      "code": "[U,]=O",
      "steps": [
        {
          "target": [
            "U",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "O"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "发",
      "code": "+Y",
      "steps": [
        {
          "target": [
            "Y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "学",
      "code": "_M",
      "steps": [
        {
          "target": [
            "M"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "车",
      "code": "+M",
      "steps": [
        {
          "target": [
            "M"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "行",
      "code": "[gx]",
      "steps": [
        {
          "target": [
            "g",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "分",
      "code": "[af]",
      "steps": [
        {
          "target": [
            "a",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "市",
      "code": "[ZQ]=j",
      "steps": [
        {
          "target": [
            "Z",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "生",
      "code": "_G",
      "steps": [
        {
          "target": [
            "G"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "呢",
      "code": "[by]-h",
      "steps": [
        {
          "target": [
            "b",
            "y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "当",
      "code": "[EC]=j",
      "steps": [
        {
          "target": [
            "E",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "店",
      "code": "_J",
      "steps": [
        {
          "target": [
            "J"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "已",
      "code": "[Pi]",
      "steps": [
        {
          "target": [
            "P",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "至",
      "code": "+.",
      "steps": [
        {
          "target": [
            "."
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "自",
      "code": "[gi]",
      "steps": [
        {
          "target": [
            "g",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "您",
      "code": "[aL]=:",
      "steps": [
        {
          "target": [
            "a",
            "L"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "加",
      "code": "_<",
      "steps": [
        {
          "target": [
            "<"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "区",
      "code": "_W",
      "steps": [
        {
          "target": [
            "W"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "水",
      "code": "[ns]",
      "steps": [
        {
          "target": [
            "n",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "全",
      "code": "[r,]=w",
      "steps": [
        {
          "target": [
            "r",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "爱",
      "code": "[Ai]",
      "steps": [
        {
          "target": [
            "A",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "天",
      "code": "[fT]=d",
      "steps": [
        {
          "target": [
            "f",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "张",
      "code": "+P",
      "steps": [
        {
          "target": [
            "P"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "美",
      "code": "[QT]=d",
      "steps": [
        {
          "target": [
            "Q",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "向",
      "code": "[qb]=k",
      "steps": [
        {
          "target": [
            "q",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "名",
      "code": "+S",
      "steps": [
        {
          "target": [
            "S"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "打",
      "code": "[iG]-d",
      "steps": [
        {
          "target": [
            "i",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "起",
      "code": "[dP]-j",
      "steps": [
        {
          "target": [
            "d",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "跟",
      "code": "[s;]-g",
      "steps": [
        {
          "target": [
            "s",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "金",
      "code": "[zj]",
      "steps": [
        {
          "target": [
            "z",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "部",
      "code": "+C",
      "steps": [
        {
          "target": [
            "C"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "无",
      "code": "[zu]",
      "steps": [
        {
          "target": [
            "z",
            "u"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "万",
      "code": "[fu]=d",
      "steps": [
        {
          "target": [
            "f",
            "u"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "带",
      "code": "[hC]=Q",
      "steps": [
        {
          "target": [
            "h",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Q"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "路",
      "code": "[sY]-g",
      "steps": [
        {
          "target": [
            "s",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "因",
      "code": "[UT]=d",
      "steps": [
        {
          "target": [
            "U",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "王",
      "code": "+,",
      "steps": [
        {
          "target": [
            ","
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "事",
      "code": "[fb]=l",
      "steps": [
        {
          "target": [
            "f",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "二",
      "code": "[Ee]",
      "steps": [
        {
          "target": [
            "E",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "子",
      "code": "_F",
      "steps": [
        {
          "target": [
            "F"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "像",
      "code": "[a,]-x",
      "steps": [
        {
          "target": [
            "a",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "x"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "面",
      "code": "[cm]",
      "steps": [
        {
          "target": [
            "c",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "化",
      "code": "[ah]-b",
      "steps": [
        {
          "target": [
            "a",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "位",
      "code": "[aC]-l",
      "steps": [
        {
          "target": [
            "a",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "先",
      "code": "[mJ]=e",
      "steps": [
        {
          "target": [
            "m",
            "J"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "此",
      "code": "_I",
      "steps": [
        {
          "target": [
            "I"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "每",
      "code": "+K",
      "steps": [
        {
          "target": [
            "K"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "图",
      "code": "[U/]=S",
      "steps": [
        {
          "target": [
            "U",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "方",
      "code": "+<",
      "steps": [
        {
          "target": [
            "<"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "经",
      "code": "[Rv]-S",
      "steps": [
        {
          "target": [
            "R",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "走",
      "code": "[dz]",
      "steps": [
        {
          "target": [
            "d",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "同",
      "code": "[Ft]",
      "steps": [
        {
          "target": [
            "F",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "却",
      "code": "[VB]-Y",
      "steps": [
        {
          "target": [
            "V",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "老",
      "code": "[qh]=b",
      "steps": [
        {
          "target": [
            "q",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "业",
      "code": "[/y]",
      "steps": [
        {
          "target": [
            "/",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "进",
      "code": "[hp]-c",
      "steps": [
        {
          "target": [
            "h",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "挺",
      "code": "[iN]-g",
      "steps": [
        {
          "target": [
            "i",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "放",
      "code": "[<a]-p",
      "steps": [
        {
          "target": [
            "<",
            "a"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "则",
      "code": "+G",
      "steps": [
        {
          "target": [
            "G"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "菜",
      "code": "_p",
      "steps": [
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "网",
      "code": "+F",
      "steps": [
        {
          "target": [
            "F"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "两",
      "code": "[Yl]",
      "steps": [
        {
          "target": [
            "Y",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "少",
      "code": "[Et]=p",
      "steps": [
        {
          "target": [
            "E",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "公",
      "code": "[XB]=s",
      "steps": [
        {
          "target": [
            "X",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "法",
      "code": "[nV]-B",
      "steps": [
        {
          "target": [
            "n",
            "V"
          ],
          "hand": "both"
        },
        {
          "target": [
            "B"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "总",
      "code": "[Xb]=:",
      "steps": [
        {
          "target": [
            "X",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "作",
      "code": "[aH]-a",
      "steps": [
        {
          "target": [
            "a",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "类",
      "code": "[rT]=d",
      "steps": [
        {
          "target": [
            "r",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "心",
      "code": "+:",
      "steps": [
        {
          "target": [
            ":"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "场",
      "code": "[VA]-I",
      "steps": [
        {
          "target": [
            "V",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "真",
      "code": "[eT]=X",
      "steps": [
        {
          "target": [
            "e",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "X"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "县",
      "code": "[qB]=s",
      "steps": [
        {
          "target": [
            "q",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "使",
      "code": "[ag]-b",
      "steps": [
        {
          "target": [
            "a",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "问",
      "code": "+I",
      "steps": [
        {
          "target": [
            "I"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "号",
      "code": "[bf]=A",
      "steps": [
        {
          "target": [
            "b",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "A"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "线",
      "code": "+R",
      "steps": [
        {
          "target": [
            "R"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "科",
      "code": "[xD]-d",
      "steps": [
        {
          "target": [
            "x",
            "D"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "现",
      "code": "[,e]-j",
      "steps": [
        {
          "target": [
            ",",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "应",
      "code": "[Jn]=f",
      "steps": [
        {
          "target": [
            "J",
            "n"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "道",
      "code": "[Xg]-p",
      "steps": [
        {
          "target": [
            "X",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "期",
      "code": "[dH]-y",
      "steps": [
        {
          "target": [
            "d",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "文",
      "code": "[vw]",
      "steps": [
        {
          "target": [
            "v",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "站",
      "code": "[CU]-z",
      "steps": [
        {
          "target": [
            "C",
            "U"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "入",
      "code": "[Vu]",
      "steps": [
        {
          "target": [
            "V",
            "u"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "次",
      "code": "[Ec]",
      "steps": [
        {
          "target": [
            "E",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "找",
      "code": "[iU]-g",
      "steps": [
        {
          "target": [
            "i",
            "U"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "主",
      "code": "[O,]=w",
      "steps": [
        {
          "target": [
            "O",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "度",
      "code": "+J",
      "steps": [
        {
          "target": [
            "J"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "斯",
      "code": "[d/]-j",
      "steps": [
        {
          "target": [
            "d",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "快",
      "code": "[:W]-r",
      "steps": [
        {
          "target": [
            ":",
            "W"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "机",
      "code": "[oq]-j",
      "steps": [
        {
          "target": [
            "o",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "手",
      "code": "[io]",
      "steps": [
        {
          "target": [
            "i",
            "o"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "写",
      "code": "[Cf]=f",
      "steps": [
        {
          "target": [
            "C",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "型",
      "code": "[fp]=V",
      "steps": [
        {
          "target": [
            "f",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "V"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "外",
      "code": "[Sx]-b",
      "steps": [
        {
          "target": [
            "S",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "卡",
      "code": "[xf]=x",
      "steps": [
        {
          "target": [
            "x",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "正",
      "code": "[fI]=i",
      "steps": [
        {
          "target": [
            "f",
            "I"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "李",
      "code": "+o",
      "steps": [
        {
          "target": [
            "o"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "式",
      "code": "[US]=g",
      "steps": [
        {
          "target": [
            "U",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "各",
      "code": "[Yg]",
      "steps": [
        {
          "target": [
            "Y",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "女",
      "code": "[Zn]",
      "steps": [
        {
          "target": [
            "Z",
            "n"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "量",
      "code": "[wf]=P",
      "steps": [
        {
          "target": [
            "w",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "P"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "特",
      "code": "+m",
      "steps": [
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "德",
      "code": "[ge]-:",
      "steps": [
        {
          "target": [
            "g",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "西",
      "code": "[tx]",
      "steps": [
        {
          "target": [
            "t",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "重",
      "code": "_k",
      "steps": [
        {
          "target": [
            "k"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "强",
      "code": "[Pb]-B",
      "steps": [
        {
          "target": [
            "P",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "B"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "四",
      "code": "+O",
      "steps": [
        {
          "target": [
            "O"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "低",
      "code": "[aZ]-O",
      "steps": [
        {
          "target": [
            "a",
            "Z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "O"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "钱",
      "code": "[zf]-U",
      "steps": [
        {
          "target": [
            "z",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "U"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "利",
      "code": "[xW]-d",
      "steps": [
        {
          "target": [
            "x",
            "W"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "动",
      "code": "_N",
      "steps": [
        {
          "target": [
            "N"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "马",
      "code": "_/",
      "steps": [
        {
          "target": [
            "/"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "完",
      "code": "[jE]=J",
      "steps": [
        {
          "target": [
            "j",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "原",
      "code": "+y",
      "steps": [
        {
          "target": [
            "y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "处",
      "code": "[/x]-b",
      "steps": [
        {
          "target": [
            "/",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "东",
      "code": "[tE]=x",
      "steps": [
        {
          "target": [
            "t",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "非",
      "code": "[tf]",
      "steps": [
        {
          "target": [
            "t",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "回",
      "code": "[Ub]=k",
      "steps": [
        {
          "target": [
            "U",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "数",
      "code": "[rZ]-a",
      "steps": [
        {
          "target": [
            "r",
            "Z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "股",
      "code": "+H",
      "steps": [
        {
          "target": [
            "H"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "达",
      "code": "[Tp]-c",
      "steps": [
        {
          "target": [
            "T",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "花",
      "code": "+p",
      "steps": [
        {
          "target": [
            "p"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "受",
      "code": "[Av]=y",
      "steps": [
        {
          "target": [
            "A",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "间",
      "code": "[Iw]=r",
      "steps": [
        {
          "target": [
            "I",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "力",
      "code": "[<l]",
      "steps": [
        {
          "target": [
            "<",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "提",
      "code": "[iw]-C",
      "steps": [
        {
          "target": [
            "i",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "C"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "某",
      "code": "[oo]=m",
      "steps": [
        {
          "target": [
            "o",
            "o"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "基",
      "code": "[dV]=t",
      "steps": [
        {
          "target": [
            "d",
            "V"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "山",
      "code": "[<s]",
      "steps": [
        {
          "target": [
            "<",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "平",
      "code": "[?X]=b",
      "steps": [
        {
          "target": [
            "?",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "拉",
      "code": "[iC]-l",
      "steps": [
        {
          "target": [
            "i",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "玩",
      "code": "[,E]-J",
      "steps": [
        {
          "target": [
            ",",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "安",
      "code": "[jZ]=n",
      "steps": [
        {
          "target": [
            "j",
            "Z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "称",
      "code": "[xL]-E",
      "steps": [
        {
          "target": [
            "x",
            "L"
          ],
          "hand": "both"
        },
        {
          "target": [
            "E"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "拿",
      "code": "[ki]=o",
      "steps": [
        {
          "target": [
            "k",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "值",
      "code": "[aA]-z",
      "steps": [
        {
          "target": [
            "a",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "未",
      "code": "[zw]",
      "steps": [
        {
          "target": [
            "z",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "工",
      "code": "[Sg]",
      "steps": [
        {
          "target": [
            "S",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "种",
      "code": "[xb]-c",
      "steps": [
        {
          "target": [
            "x",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "越",
      "code": "[d;]-u",
      "steps": [
        {
          "target": [
            "d",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "省",
      "code": "[Et]=T",
      "steps": [
        {
          "target": [
            "E",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "信",
      "code": "[au]-y",
      "steps": [
        {
          "target": [
            "a",
            "u"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "定",
      "code": "[jC]=s",
      "steps": [
        {
          "target": [
            "j",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "海",
      "code": "[nK]-N",
      "steps": [
        {
          "target": [
            "n",
            "K"
          ],
          "hand": "both"
        },
        {
          "target": [
            "N"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "通",
      "code": "[Bq]-p",
      "steps": [
        {
          "target": [
            "B",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "十",
      "code": "[es]",
      "steps": [
        {
          "target": [
            "e",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "尔",
      "code": "+L",
      "steps": [
        {
          "target": [
            "L"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "话",
      "code": "[ug]-s",
      "steps": [
        {
          "target": [
            "u",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "据",
      "code": "[iy]-/",
      "steps": [
        {
          "target": [
            "i",
            "y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "/"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "米",
      "code": "[rm]",
      "steps": [
        {
          "target": [
            "r",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "系",
      "code": "[tR]=s",
      "steps": [
        {
          "target": [
            "t",
            "R"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "明",
      "code": "[wH]-y",
      "steps": [
        {
          "target": [
            "w",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "超",
      "code": "[du]-b",
      "steps": [
        {
          "target": [
            "d",
            "u"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "算",
      "code": "[cT]=p",
      "steps": [
        {
          "target": [
            "c",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "体",
      "code": "[an]-b",
      "steps": [
        {
          "target": [
            "a",
            "n"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "听",
      "code": "[b/]-j",
      "steps": [
        {
          "target": [
            "b",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "克",
      "code": "+/",
      "steps": [
        {
          "target": [
            "/"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "林",
      "code": "[ml]",
      "steps": [
        {
          "target": [
            "m",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "理",
      "code": "[,P]-l",
      "steps": [
        {
          "target": [
            ",",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "岁",
      "code": "[<S]=x",
      "steps": [
        {
          "target": [
            "<",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "款",
      "code": "[rN]-:",
      "steps": [
        {
          "target": [
            "r",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "关",
      "code": "[Rg]",
      "steps": [
        {
          "target": [
            "R",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "指",
      "code": "[ih]-w",
      "steps": [
        {
          "target": [
            "i",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "管",
      "code": "[cj]=m",
      "steps": [
        {
          "target": [
            "c",
            "j"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "电",
      "code": "[Ud]",
      "steps": [
        {
          "target": [
            "U",
            "d"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "选",
      "code": "[mJ]-p",
      "steps": [
        {
          "target": [
            "m",
            "J"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "条",
      "code": "[/o]=m",
      "steps": [
        {
          "target": [
            "/",
            "o"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "五",
      "code": "+N",
      "steps": [
        {
          "target": [
            "N"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "南",
      "code": "[eF]=Q",
      "steps": [
        {
          "target": [
            "e",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Q"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "合",
      "code": "+k",
      "steps": [
        {
          "target": [
            "k"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "率",
      "code": "[Z>]=e",
      "steps": [
        {
          "target": [
            "Z",
            ">"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "别",
      "code": "[b<]-W",
      "steps": [
        {
          "target": [
            "b",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "按",
      "code": "[ij]-Z",
      "steps": [
        {
          "target": [
            "i",
            "j"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Z"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "报",
      "code": "[iY]-v",
      "steps": [
        {
          "target": [
            "i",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "v"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "近",
      "code": "[/p]-c",
      "steps": [
        {
          "target": [
            "/",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "台",
      "code": "[Bb]=k",
      "steps": [
        {
          "target": [
            "B",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "刚",
      "code": "[Fl]-W",
      "steps": [
        {
          "target": [
            "F",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "实",
      "code": "[jS]=T",
      "steps": [
        {
          "target": [
            "j",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "曾",
      "code": "[Xe]=w",
      "steps": [
        {
          "target": [
            "X",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "城",
      "code": "[V;]-A",
      "steps": [
        {
          "target": [
            "V",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "A"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "版",
      "code": "[Oy]-v",
      "steps": [
        {
          "target": [
            "O",
            "y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "v"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "读",
      "code": "[ue]-T",
      "steps": [
        {
          "target": [
            "u",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "变",
      "code": "[Gv]=y",
      "steps": [
        {
          "target": [
            "G",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "集",
      "code": "[,o]=m",
      "steps": [
        {
          "target": [
            ",",
            "o"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "叫",
      "code": "[bW]-j",
      "steps": [
        {
          "target": [
            "b",
            "W"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "周",
      "code": "[FJ]=j",
      "steps": [
        {
          "target": [
            "F",
            "J"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "约",
      "code": "[R.]-O",
      "steps": [
        {
          "target": [
            "R",
            "."
          ],
          "hand": "both"
        },
        {
          "target": [
            "O"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "陈",
      "code": "[Yt]-E",
      "steps": [
        {
          "target": [
            "Y",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "E"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "么",
      "code": "[tB]=s",
      "steps": [
        {
          "target": [
            "t",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "谁",
      "code": "[u,]-i",
      "steps": [
        {
          "target": [
            "u",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "油",
      "code": "[nB]-y",
      "steps": [
        {
          "target": [
            "n",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "资",
      "code": "[EG]=b",
      "steps": [
        {
          "target": [
            "E",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "感",
      "code": "+;",
      "steps": [
        {
          "target": [
            ";"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "华",
      "code": "[ah]=e",
      "steps": [
        {
          "target": [
            "a",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "村",
      "code": "[oz]-c",
      "steps": [
        {
          "target": [
            "o",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "门",
      "code": "[Im]",
      "steps": [
        {
          "target": [
            "I",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "份",
      "code": "[aa]-f",
      "steps": [
        {
          "target": [
            "a",
            "a"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "贵",
      "code": "[BG]=b",
      "steps": [
        {
          "target": [
            "B",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "表",
      "code": "_>",
      "steps": [
        {
          "target": [
            ">"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "组",
      "code": "[Rq]-q",
      "steps": [
        {
          "target": [
            "R",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "即",
      "code": "[;Y]-j",
      "steps": [
        {
          "target": [
            ";",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "价",
      "code": "[ar]-W",
      "steps": [
        {
          "target": [
            "a",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "建",
      "code": "_l",
      "steps": [
        {
          "target": [
            "l"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "差",
      "code": "[QS]=g",
      "steps": [
        {
          "target": [
            "Q",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "制",
      "code": "[mQ]-W",
      "steps": [
        {
          "target": [
            "m",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "需",
      "code": "[kB]=e",
      "steps": [
        {
          "target": [
            "k",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "单",
      "code": "[Xw]=e",
      "steps": [
        {
          "target": [
            "X",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "白",
      "code": "[db]",
      "steps": [
        {
          "target": [
            "d",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "罗",
      "code": "[OS]=x",
      "steps": [
        {
          "target": [
            "O",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "连",
      "code": "[Mp]-c",
      "steps": [
        {
          "target": [
            "M",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "项",
      "code": "[S?]-y",
      "steps": [
        {
          "target": [
            "S",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "些",
      "code": "[Ih]=E",
      "steps": [
        {
          "target": [
            "I",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "E"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "相",
      "code": "[oT]-m",
      "steps": [
        {
          "target": [
            "o",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "头",
      "code": "[ST]=d",
      "steps": [
        {
          "target": [
            "S",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "送",
      "code": "[Rp]-c",
      "steps": [
        {
          "target": [
            "R",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "红",
      "code": "[RS]-g",
      "steps": [
        {
          "target": [
            "R",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "干",
      "code": "[?g]",
      "steps": [
        {
          "target": [
            "?",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "级",
      "code": "[Rs]-j",
      "steps": [
        {
          "target": [
            "R",
            "s"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "帮",
      "code": "+>",
      "steps": [
        {
          "target": [
            ">"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "黄",
      "code": "[Rh]",
      "steps": [
        {
          "target": [
            "R",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "品",
      "code": "[bm]=q",
      "steps": [
        {
          "target": [
            "b",
            "m"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "见",
      "code": "[ej]",
      "steps": [
        {
          "target": [
            "e",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "鱼",
      "code": "[Lv]",
      "steps": [
        {
          "target": [
            "L",
            "v"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "北",
      "code": "[?h]-b",
      "steps": [
        {
          "target": [
            "?",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "转",
      "code": "[ME]-O",
      "steps": [
        {
          "target": [
            "M",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "O"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "考",
      "code": "[qf]=A",
      "steps": [
        {
          "target": [
            "q",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "A"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "布",
      "code": "[Ab]",
      "steps": [
        {
          "target": [
            "A",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "喝",
      "code": "[bw]-u",
      "steps": [
        {
          "target": [
            "b",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "题",
      "code": "[wC]-?",
      "steps": [
        {
          "target": [
            "w",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "?"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "字",
      "code": "[jF]=i",
      "steps": [
        {
          "target": [
            "j",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "产",
      "code": "[Cy]=c",
      "steps": [
        {
          "target": [
            "C",
            "y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "常",
      "code": "[MQ]=j",
      "steps": [
        {
          "target": [
            "M",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "收",
      "code": "[Wa]-p",
      "steps": [
        {
          "target": [
            "W",
            "a"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "队",
      "code": "[Yr]-r",
      "steps": [
        {
          "target": [
            "Y",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "阿",
      "code": "[Yx]-k",
      "steps": [
        {
          "target": [
            "Y",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "双",
      "code": "[ms]",
      "steps": [
        {
          "target": [
            "m",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "刘",
      "code": "[vW]-d",
      "steps": [
        {
          "target": [
            "v",
            "W"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "口",
      "code": "[bk]",
      "steps": [
        {
          "target": [
            "b",
            "k"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "格",
      "code": "[oY]-g",
      "steps": [
        {
          "target": [
            "o",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "包",
      "code": "[.P]=s",
      "steps": [
        {
          "target": [
            ".",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "黑",
      "code": "[eh]",
      "steps": [
        {
          "target": [
            "e",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "记",
      "code": "[uP]-j",
      "steps": [
        {
          "target": [
            "u",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "啦",
      "code": "[bi]-C",
      "steps": [
        {
          "target": [
            "b",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "C"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "住",
      "code": "[aO]-,",
      "steps": [
        {
          "target": [
            "a",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            ","
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "较",
      "code": "[MZ]-h",
      "steps": [
        {
          "target": [
            "M",
            "Z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "风",
      "code": "[ql]=i",
      "steps": [
        {
          "target": [
            "q",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "知",
      "code": "_D",
      "steps": [
        {
          "target": [
            "D"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "哦",
      "code": "[bt]-U",
      "steps": [
        {
          "target": [
            "b",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "U"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "穿",
      "code": "[IP]=y",
      "steps": [
        {
          "target": [
            "I",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "男",
      "code": "+D",
      "steps": [
        {
          "target": [
            "D"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "卖",
      "code": "[eA]=T",
      "steps": [
        {
          "target": [
            "e",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "清",
      "code": "[n>]-H",
      "steps": [
        {
          "target": [
            "n",
            ">"
          ],
          "hand": "both"
        },
        {
          "target": [
            "H"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "交",
      "code": "[Zh]=f",
      "steps": [
        {
          "target": [
            "Z",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "讲",
      "code": "[uh]-j",
      "steps": [
        {
          "target": [
            "u",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "肉",
      "code": "[Br]=r",
      "steps": [
        {
          "target": [
            "B",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "光",
      "code": "[xg]",
      "steps": [
        {
          "target": [
            "x",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "保",
      "code": "[ab]-o",
      "steps": [
        {
          "target": [
            "a",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "改",
      "code": "[Pa]-p",
      "steps": [
        {
          "target": [
            "P",
            "a"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "任",
      "code": "[aN]-r",
      "steps": [
        {
          "target": [
            "a",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "活",
      "code": "[ng]-s",
      "steps": [
        {
          "target": [
            "n",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "香",
      "code": "[xw]=r",
      "steps": [
        {
          "target": [
            "x",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "房",
      "code": "[Q<]=f",
      "steps": [
        {
          "target": [
            "Q",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "死",
      "code": "[Jh]=b",
      "steps": [
        {
          "target": [
            "J",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "投",
      "code": "[iT]-s",
      "steps": [
        {
          "target": [
            "i",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "司",
      "code": "[Af]=b",
      "steps": [
        {
          "target": [
            "A",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "费",
      "code": "[PG]=b",
      "steps": [
        {
          "target": [
            "P",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "且",
      "code": "[qq]",
      "steps": [
        {
          "target": [
            "q",
            "q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "教",
      "code": "[qF]-a",
      "steps": [
        {
          "target": [
            "q",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "亚",
      "code": "[f/]=y",
      "steps": [
        {
          "target": [
            "f",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "热",
      "code": "[r;]=h",
      "steps": [
        {
          "target": [
            "r",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "换",
      "code": "[iL]-T",
      "steps": [
        {
          "target": [
            "i",
            "L"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "深",
      "code": "[nC]-o",
      "steps": [
        {
          "target": [
            "n",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "汤",
      "code": "[nA]-I",
      "steps": [
        {
          "target": [
            "n",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "球",
      "code": "[,f]-O",
      "steps": [
        {
          "target": [
            ",",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "O"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "赛",
      "code": "[jh]=G",
      "steps": [
        {
          "target": [
            "j",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "师",
      "code": "+W",
      "steps": [
        {
          "target": [
            "W"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "然",
      "code": "[HK]=;",
      "steps": [
        {
          "target": [
            "H",
            "K"
          ],
          "hand": "both"
        },
        {
          "target": [
            ";"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "局",
      "code": "[yA]=b",
      "steps": [
        {
          "target": [
            "y",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "坐",
      "code": "[mV]=t",
      "steps": [
        {
          "target": [
            "m",
            "V"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "哪",
      "code": "[bA]-Y",
      "steps": [
        {
          "target": [
            "b",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "龙",
      "code": "[Ul]",
      "steps": [
        {
          "target": [
            "U",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "情",
      "code": "[:>]-H",
      "steps": [
        {
          "target": [
            ":",
            ">"
          ],
          "hand": "both"
        },
        {
          "target": [
            "H"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "接",
      "code": "[iC]-Z",
      "steps": [
        {
          "target": [
            "i",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Z"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "首",
      "code": "[Xg]=i",
      "steps": [
        {
          "target": [
            "X",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "员",
      "code": "[bG]=b",
      "steps": [
        {
          "target": [
            "b",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "神",
      "code": "[Nw]-c",
      "steps": [
        {
          "target": [
            "N",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "商",
      "code": "[hX]=b",
      "steps": [
        {
          "target": [
            "h",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "目",
      "code": "[Tm]",
      "steps": [
        {
          "target": [
            "T",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "易",
      "code": "[w.]=I",
      "steps": [
        {
          "target": [
            "w",
            "."
          ],
          "hand": "both"
        },
        {
          "target": [
            "I"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "难",
      "code": "[v,]-i",
      "steps": [
        {
          "target": [
            "v",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "段",
      "code": "[if]-T",
      "steps": [
        {
          "target": [
            "i",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "句",
      "code": "[Gj]",
      "steps": [
        {
          "target": [
            "G",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "云",
      "code": "[Ny]",
      "steps": [
        {
          "target": [
            "N",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "样",
      "code": "[oQ]-y",
      "steps": [
        {
          "target": [
            "o",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "仅",
      "code": "[av]-y",
      "steps": [
        {
          "target": [
            "a",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "均",
      "code": "[V.]-S",
      "steps": [
        {
          "target": [
            "V",
            "."
          ],
          "hand": "both"
        },
        {
          "target": [
            "S"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "共",
      "code": "[RX]=b",
      "steps": [
        {
          "target": [
            "R",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "片",
      "code": "[Op]",
      "steps": [
        {
          "target": [
            "O",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "物",
      "code": "[m.]-I",
      "steps": [
        {
          "target": [
            "m",
            "."
          ],
          "hand": "both"
        },
        {
          "target": [
            "I"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "果",
      "code": "[Do]=m",
      "steps": [
        {
          "target": [
            "D",
            "o"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "创",
      "code": "[rY]-W",
      "steps": [
        {
          "target": [
            "r",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "宝",
      "code": "[j,]=O",
      "steps": [
        {
          "target": [
            "j",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "O"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "远",
      "code": "[EJ]-p",
      "steps": [
        {
          "target": [
            "E",
            "J"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "民",
      "code": "[wm]",
      "steps": [
        {
          "target": [
            "w",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "设",
      "code": "[uT]-s",
      "steps": [
        {
          "target": [
            "u",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "今",
      "code": "[kj]",
      "steps": [
        {
          "target": [
            "k",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "求",
      "code": "[fn]=O",
      "steps": [
        {
          "target": [
            "f",
            "n"
          ],
          "hand": "both"
        },
        {
          "target": [
            "O"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "微",
      "code": "[gq]=j",
      "steps": [
        {
          "target": [
            "g",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "副",
      "code": "[fb]-W",
      "steps": [
        {
          "target": [
            "f",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "满",
      "code": "[np]-Y",
      "steps": [
        {
          "target": [
            "n",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "配",
      "code": "[UP]-j",
      "steps": [
        {
          "target": [
            "U",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "展",
      "code": "[yR]=?",
      "steps": [
        {
          "target": [
            "y",
            "R"
          ],
          "hand": "both"
        },
        {
          "target": [
            "?"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "拍",
      "code": "[id]-b",
      "steps": [
        {
          "target": [
            "i",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "岛",
      "code": "[X<]=s",
      "steps": [
        {
          "target": [
            "X",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "代",
      "code": "[aU]-i",
      "steps": [
        {
          "target": [
            "a",
            "U"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "装",
      "code": "[?r]=?",
      "steps": [
        {
          "target": [
            "?",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "?"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "古",
      "code": "[/g]",
      "steps": [
        {
          "target": [
            "/",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "意",
      "code": "[S:]=x",
      "steps": [
        {
          "target": [
            "S",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "军",
      "code": "[CM]=c",
      "steps": [
        {
          "target": [
            "C",
            "M"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "游",
      "code": "[n<]-F",
      "steps": [
        {
          "target": [
            "n",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "F"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "气",
      "code": "[Dq]",
      "steps": [
        {
          "target": [
            "D",
            "q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "便",
      "code": "[ag]-w",
      "steps": [
        {
          "target": [
            "a",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "属",
      "code": "[yt]=B",
      "steps": [
        {
          "target": [
            "y",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "B"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "石",
      "code": "[.s]",
      "steps": [
        {
          "target": [
            ".",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "维",
      "code": "[R,]-i",
      "steps": [
        {
          "target": [
            "R",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "器",
      "code": "[mK]=m",
      "steps": [
        {
          "target": [
            "m",
            "K"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "层",
      "code": "[yN]=y",
      "steps": [
        {
          "target": [
            "y",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "增",
      "code": "[VX]-w",
      "steps": [
        {
          "target": [
            "V",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "流",
      "code": "[nN]-Y",
      "steps": [
        {
          "target": [
            "n",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "镇",
      "code": "[ze]-X",
      "steps": [
        {
          "target": [
            "z",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "X"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "早",
      "code": "[we]=s",
      "steps": [
        {
          "target": [
            "w",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "盘",
      "code": "[W;]=m",
      "steps": [
        {
          "target": [
            "W",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "立",
      "code": "[Cl]",
      "steps": [
        {
          "target": [
            "C",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "推",
      "code": "[i,]-i",
      "steps": [
        {
          "target": [
            "i",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "蛮",
      "code": "[GB]=c",
      "steps": [
        {
          "target": [
            "G",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "传",
      "code": "[aE]-O",
      "steps": [
        {
          "target": [
            "a",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "O"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "纳",
      "code": "[RB]-n",
      "steps": [
        {
          "target": [
            "R",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "几",
      "code": "[qj]",
      "steps": [
        {
          "target": [
            "q",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "办",
      "code": "[<X]=b",
      "steps": [
        {
          "target": [
            "<",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "座",
      "code": "[Jm]=V",
      "steps": [
        {
          "target": [
            "J",
            "m"
          ],
          "hand": "both"
        },
        {
          "target": [
            "V"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "计",
      "code": "[ue]-s",
      "steps": [
        {
          "target": [
            "u",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "证",
      "code": "[uf]-I",
      "steps": [
        {
          "target": [
            "u",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "件",
      "code": "[am]-n",
      "steps": [
        {
          "target": [
            "a",
            "m"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "直",
      "code": "[Az]",
      "steps": [
        {
          "target": [
            "A",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "调",
      "code": "[uF]-J",
      "steps": [
        {
          "target": [
            "u",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "巴",
      "code": "[Tb]",
      "steps": [
        {
          "target": [
            "T",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "另",
      "code": "[b<]=l",
      "steps": [
        {
          "target": [
            "b",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "试",
      "code": "[uU]-S",
      "steps": [
        {
          "target": [
            "u",
            "U"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "篇",
      "code": "[cQ]=F",
      "steps": [
        {
          "target": [
            "c",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "F"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "占",
      "code": "[Uz]",
      "steps": [
        {
          "target": [
            "U",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "联",
      "code": "[FR]-g",
      "steps": [
        {
          "target": [
            "F",
            "R"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "亿",
      "code": "[aj]-i",
      "steps": [
        {
          "target": [
            "a",
            "j"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "身",
      "code": "[Is]",
      "steps": [
        {
          "target": [
            "I",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "节",
      "code": "[pY]=j",
      "steps": [
        {
          "target": [
            "p",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "空",
      "code": "[IS]=g",
      "steps": [
        {
          "target": [
            "I",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "饭",
      "code": "[fy]-v",
      "steps": [
        {
          "target": [
            "f",
            "y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "v"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "味",
      "code": "[bz]-w",
      "steps": [
        {
          "target": [
            "b",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "奖",
      "code": "[?S]=T",
      "steps": [
        {
          "target": [
            "?",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "星",
      "code": "[wG]=s",
      "steps": [
        {
          "target": [
            "w",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "反",
      "code": "[yv]=y",
      "steps": [
        {
          "target": [
            "y",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "州",
      "code": "[YY]=c",
      "steps": [
        {
          "target": [
            "Y",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "久",
      "code": "[LO]=d",
      "steps": [
        {
          "target": [
            "L",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "极",
      "code": "[os]-j",
      "steps": [
        {
          "target": [
            "o",
            "s"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "排",
      "code": "[it]-f",
      "steps": [
        {
          "target": [
            "i",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "儿",
      "code": "[Je]",
      "steps": [
        {
          "target": [
            "J",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "河",
      "code": "[nx]-k",
      "steps": [
        {
          "target": [
            "n",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "食",
      "code": "[fs]",
      "steps": [
        {
          "target": [
            "f",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "整",
      "code": "[Ca]=I",
      "steps": [
        {
          "target": [
            "C",
            "a"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "银",
      "code": "[z;]-g",
      "steps": [
        {
          "target": [
            "z",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "乐",
      "code": "[WE]=x",
      "steps": [
        {
          "target": [
            "W",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "火",
      "code": "[;h]",
      "steps": [
        {
          "target": [
            ";",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "色",
      "code": "[LT]=b",
      "steps": [
        {
          "target": [
            "L",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "杨",
      "code": "[oA]-I",
      "steps": [
        {
          "target": [
            "o",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "跑",
      "code": "[s.]-P",
      "steps": [
        {
          "target": [
            "s",
            "."
          ],
          "hand": "both"
        },
        {
          "target": [
            "P"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "注",
      "code": "[nO]-,",
      "steps": [
        {
          "target": [
            "n",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            ","
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "战",
      "code": "[UU]-g",
      "steps": [
        {
          "target": [
            "U",
            "U"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "何",
      "code": "[ax]-k",
      "steps": [
        {
          "target": [
            "a",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "解",
      "code": "[Lu]-m",
      "steps": [
        {
          "target": [
            "L",
            "u"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "病",
      "code": "[lf]=B",
      "steps": [
        {
          "target": [
            "l",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "B"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "务",
      "code": "[/<]=l",
      "steps": [
        {
          "target": [
            "/",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "靠",
      "code": "[mb]=t",
      "steps": [
        {
          "target": [
            "m",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "掉",
      "code": "[ix]-e",
      "steps": [
        {
          "target": [
            "i",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "晚",
      "code": "[wA]-J",
      "steps": [
        {
          "target": [
            "w",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "团",
      "code": "[Ue]=t",
      "steps": [
        {
          "target": [
            "U",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "广",
      "code": "[Jg]",
      "steps": [
        {
          "target": [
            "J",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "田",
      "code": "[Dt]",
      "steps": [
        {
          "target": [
            "D",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "波",
      "code": "[nH]-p",
      "steps": [
        {
          "target": [
            "n",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "牛",
      "code": "[mn]",
      "steps": [
        {
          "target": [
            "m",
            "n"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "六",
      "code": "[wl]",
      "steps": [
        {
          "target": [
            "w",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "半",
      "code": "[Xi]=o",
      "steps": [
        {
          "target": [
            "X",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "英",
      "code": "[pF]=T",
      "steps": [
        {
          "target": [
            "p",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "茶",
      "code": "[pr]=o",
      "steps": [
        {
          "target": [
            "p",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "哈",
      "code": "[bk]-h",
      "steps": [
        {
          "target": [
            "b",
            "k"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "left"
        }
      ]
    }
  ],
  [
    {
      "char": "根",
      "code": "[o;]-g",
      "steps": [
        {
          "target": [
            "o",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "兰",
      "code": "[Xd]=s",
      "steps": [
        {
          "target": [
            "X",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "史",
      "code": "[bl]=i",
      "steps": [
        {
          "target": [
            "b",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "歌",
      "code": "[xx]-:",
      "steps": [
        {
          "target": [
            "x",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "酒",
      "code": "[nU]-y",
      "steps": [
        {
          "target": [
            "n",
            "U"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "皮",
      "code": "[Hp]",
      "steps": [
        {
          "target": [
            "H",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "边",
      "code": "[<p]-c",
      "steps": [
        {
          "target": [
            "<",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "群",
      "code": "+l",
      "steps": [
        {
          "target": [
            "l"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "离",
      "code": "[Zl]=B",
      "steps": [
        {
          "target": [
            "Z",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            "B"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "赞",
      "code": "[mJ]=G",
      "steps": [
        {
          "target": [
            "m",
            "J"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "查",
      "code": "[ow]=f",
      "steps": [
        {
          "target": [
            "o",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "伊",
      "code": "[al]-t",
      "steps": [
        {
          "target": [
            "a",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "懂",
      "code": "[:p]-P",
      "steps": [
        {
          "target": [
            ":",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "P"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "博",
      "code": "[eL]-z",
      "steps": [
        {
          "target": [
            "e",
            "L"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "画",
      "code": "[fD]=F",
      "steps": [
        {
          "target": [
            "f",
            "D"
          ],
          "hand": "both"
        },
        {
          "target": [
            "F"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "运",
      "code": "[Np]-c",
      "steps": [
        {
          "target": [
            "N",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "持",
      "code": "[iV]-z",
      "steps": [
        {
          "target": [
            "i",
            "V"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "留",
      "code": "[:D]=t",
      "steps": [
        {
          "target": [
            ":",
            "D"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "支",
      "code": "[;i]",
      "steps": [
        {
          "target": [
            ";",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "社",
      "code": "[NV]-t",
      "steps": [
        {
          "target": [
            "N",
            "V"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "粉",
      "code": "[ra]-f",
      "steps": [
        {
          "target": [
            "r",
            "a"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "往",
      "code": "[gO]-,",
      "steps": [
        {
          "target": [
            "g",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            ","
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "供",
      "code": "[aR]-X",
      "steps": [
        {
          "target": [
            "a",
            "R"
          ],
          "hand": "both"
        },
        {
          "target": [
            "X"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "街",
      "code": "[gM]=g",
      "steps": [
        {
          "target": [
            "g",
            "M"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "服",
      "code": "[HY]-v",
      "steps": [
        {
          "target": [
            "H",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "v"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "块",
      "code": "[VW]-r",
      "steps": [
        {
          "target": [
            "V",
            "W"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "八",
      "code": "[Xb]",
      "steps": [
        {
          "target": [
            "X",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "夫",
      "code": "[df]",
      "steps": [
        {
          "target": [
            "d",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "必",
      "code": "[:t]=p",
      "steps": [
        {
          "target": [
            ":",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "取",
      "code": "[Fv]-y",
      "steps": [
        {
          "target": [
            "F",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "治",
      "code": "[nB]-b",
      "steps": [
        {
          "target": [
            "n",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "塔",
      "code": "[Vp]-k",
      "steps": [
        {
          "target": [
            "V",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "世",
      "code": "[RA]=e",
      "steps": [
        {
          "target": [
            "R",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "仍",
      "code": "[aT]-n",
      "steps": [
        {
          "target": [
            "a",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "奥",
      "code": "[qr]=T",
      "steps": [
        {
          "target": [
            "q",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "足",
      "code": "[su]",
      "steps": [
        {
          "target": [
            "s",
            "u"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "源",
      "code": "[ny]-E",
      "steps": [
        {
          "target": [
            "n",
            "y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "E"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "购",
      "code": "[G.]-B",
      "steps": [
        {
          "target": [
            "G",
            "."
          ],
          "hand": "both"
        },
        {
          "target": [
            "B"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "江",
      "code": "[nS]-g",
      "steps": [
        {
          "target": [
            "n",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "切",
      "code": "[tu]-d",
      "steps": [
        {
          "target": [
            "t",
            "u"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "视",
      "code": "[Ne]-j",
      "steps": [
        {
          "target": [
            "N",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "杯",
      "code": "[oc]-b",
      "steps": [
        {
          "target": [
            "o",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "眼",
      "code": "[T;]-g",
      "steps": [
        {
          "target": [
            "T",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "权",
      "code": "[ov]-y",
      "steps": [
        {
          "target": [
            "o",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "鸡",
      "code": "[vX]-n",
      "steps": [
        {
          "target": [
            "v",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "标",
      "code": "[oN]-s",
      "steps": [
        {
          "target": [
            "o",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "具",
      "code": "[TX]=b",
      "steps": [
        {
          "target": [
            "T",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "班",
      "code": "[,W]=,",
      "steps": [
        {
          "target": [
            ",",
            "W"
          ],
          "hand": "both"
        },
        {
          "target": [
            ","
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "尼",
      "code": "[yh]=b",
      "steps": [
        {
          "target": [
            "y",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "词",
      "code": "[uA]-b",
      "steps": [
        {
          "target": [
            "u",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "政",
      "code": "[fI]-a",
      "steps": [
        {
          "target": [
            "f",
            "I"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "木",
      "code": "[om]",
      "steps": [
        {
          "target": [
            "o",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "树",
      "code": "[ov]-z",
      "steps": [
        {
          "target": [
            "o",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "程",
      "code": "[xb]-,",
      "steps": [
        {
          "target": [
            "x",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            ","
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "错",
      "code": "[zR]-w",
      "steps": [
        {
          "target": [
            "z",
            "R"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "库",
      "code": "[JM]=c",
      "steps": [
        {
          "target": [
            "J",
            "M"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "若",
      "code": "[pe]=b",
      "steps": [
        {
          "target": [
            "p",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "搞",
      "code": "[is]-g",
      "steps": [
        {
          "target": [
            "i",
            "s"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "随",
      "code": "[Ye]-p",
      "steps": [
        {
          "target": [
            "Y",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "院",
      "code": "[Yj]-J",
      "steps": [
        {
          "target": [
            "Y",
            "j"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "升",
      "code": "[tp]=c",
      "steps": [
        {
          "target": [
            "t",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "养",
      "code": "[QO]=W",
      "steps": [
        {
          "target": [
            "Q",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "烤",
      "code": "[;q]-A",
      "steps": [
        {
          "target": [
            ";",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "A"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "结",
      "code": "[RJ]-j",
      "steps": [
        {
          "target": [
            "R",
            "J"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "楼",
      "code": "[or]-Z",
      "steps": [
        {
          "target": [
            "o",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Z"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "语",
      "code": "[uN]-b",
      "steps": [
        {
          "target": [
            "u",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "步",
      "code": "[II]=i",
      "steps": [
        {
          "target": [
            "I",
            "I"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "优",
      "code": "[a:]-y",
      "steps": [
        {
          "target": [
            "a",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "普",
      "code": "[X/]=w",
      "steps": [
        {
          "target": [
            "X",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "讯",
      "code": "[uA]-e",
      "steps": [
        {
          "target": [
            "u",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "福",
      "code": "[Nf]-D",
      "steps": [
        {
          "target": [
            "N",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "D"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "索",
      "code": "[ER]=s",
      "steps": [
        {
          "target": [
            "E",
            "R"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "森",
      "code": "[om]=l",
      "steps": [
        {
          "target": [
            "o",
            "m"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "准",
      "code": "[S,]-i",
      "steps": [
        {
          "target": [
            "S",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "模",
      "code": "[oP]-T",
      "steps": [
        {
          "target": [
            "o",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "吴",
      "code": "[bf]=T",
      "steps": [
        {
          "target": [
            "b",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "领",
      "code": "[kO]-?",
      "steps": [
        {
          "target": [
            "k",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            "?"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "医",
      "code": "[WD]=s",
      "steps": [
        {
          "target": [
            "W",
            "D"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "客",
      "code": "[jY]=g",
      "steps": [
        {
          "target": [
            "j",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "友",
      "code": "[ev]=y",
      "steps": [
        {
          "target": [
            "e",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "偏",
      "code": "[aQ]-F",
      "steps": [
        {
          "target": [
            "a",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "F"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "锅",
      "code": "[zb]-B",
      "steps": [
        {
          "target": [
            "z",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "B"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "飞",
      "code": "[kf]",
      "steps": [
        {
          "target": [
            "k",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "够",
      "code": "[GS]-S",
      "steps": [
        {
          "target": [
            "G",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "料",
      "code": "[rD]-d",
      "steps": [
        {
          "target": [
            "r",
            "D"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "脸",
      "code": "[Hk]-f",
      "steps": [
        {
          "target": [
            "H",
            "k"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "希",
      "code": "[lA]=b",
      "steps": [
        {
          "target": [
            "l",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "辣",
      "code": "[<C]-s",
      "steps": [
        {
          "target": [
            "<",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "著",
      "code": "[pq]=z",
      "steps": [
        {
          "target": [
            "p",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "洗",
      "code": "[nm]-J",
      "steps": [
        {
          "target": [
            "n",
            "m"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "京",
      "code": "[sE]=x",
      "steps": [
        {
          "target": [
            "s",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "户",
      "code": "[Qh]",
      "steps": [
        {
          "target": [
            "Q",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "青",
      "code": "[>H]=y",
      "steps": [
        {
          "target": [
            ">",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "观",
      "code": "[ve]-j",
      "steps": [
        {
          "target": [
            "v",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "术",
      "code": "[oO]=d",
      "steps": [
        {
          "target": [
            "o",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "精",
      "code": "[r>]-H",
      "steps": [
        {
          "target": [
            "r",
            ">"
          ],
          "hand": "both"
        },
        {
          "target": [
            "H"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "百",
      "code": "[fd]=b",
      "steps": [
        {
          "target": [
            "f",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "案",
      "code": "[jZ]=o",
      "steps": [
        {
          "target": [
            "j",
            "Z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "己",
      "code": "[Pj]",
      "steps": [
        {
          "target": [
            "P",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "洛",
      "code": "[nY]-g",
      "steps": [
        {
          "target": [
            "n",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "专",
      "code": "[EA]=O",
      "steps": [
        {
          "target": [
            "E",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "O"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "影",
      "code": "[ws]-I",
      "steps": [
        {
          "target": [
            "w",
            "s"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "梦",
      "code": "[mS]=x",
      "steps": [
        {
          "target": [
            "m",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "界",
      "code": "[Dr]=W",
      "steps": [
        {
          "target": [
            "D",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "药",
      "code": "[pR]=O",
      "steps": [
        {
          "target": [
            "p",
            "R"
          ],
          "hand": "both"
        },
        {
          "target": [
            "O"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "照",
      "code": "[wu]=;",
      "steps": [
        {
          "target": [
            "w",
            "u"
          ],
          "hand": "both"
        },
        {
          "target": [
            ";"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "湖",
      "code": "[n/]-H",
      "steps": [
        {
          "target": [
            "n",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "H"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "质",
      "code": "[ye]=G",
      "steps": [
        {
          "target": [
            "y",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "造",
      "code": "[mb]-p",
      "steps": [
        {
          "target": [
            "m",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "苏",
      "code": "[p<]=X",
      "steps": [
        {
          "target": [
            "p",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "X"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "七",
      "code": "[tq]",
      "steps": [
        {
          "target": [
            "t",
            "q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "士",
      "code": "[rs]",
      "steps": [
        {
          "target": [
            "r",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "声",
      "code": "[ry]=s",
      "steps": [
        {
          "target": [
            "r",
            "y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "季",
      "code": "[xF]=i",
      "steps": [
        {
          "target": [
            "x",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "妈",
      "code": "[Z/]-m",
      "steps": [
        {
          "target": [
            "Z",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "港",
      "code": "[nR]-P",
      "steps": [
        {
          "target": [
            "n",
            "R"
          ],
          "hand": "both"
        },
        {
          "target": [
            "P"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "峰",
      "code": "[</]->",
      "steps": [
        {
          "target": [
            "<",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            ">"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "川",
      "code": "[Yc]",
      "steps": [
        {
          "target": [
            "Y",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "短",
      "code": "[D>]-d",
      "steps": [
        {
          "target": [
            "D",
            ">"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "降",
      "code": "[Y/]-r",
      "steps": [
        {
          "target": [
            "Y",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "园",
      "code": "[UE]=J",
      "steps": [
        {
          "target": [
            "U",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "营",
      "code": "[Kb]=b",
      "steps": [
        {
          "target": [
            "K",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "列",
      "code": "[JW]-d",
      "steps": [
        {
          "target": [
            "J",
            "W"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "沙",
      "code": "[nE]-t",
      "steps": [
        {
          "target": [
            "n",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "涨",
      "code": "[nP]-u",
      "steps": [
        {
          "target": [
            "n",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "叶",
      "code": "[be]-s",
      "steps": [
        {
          "target": [
            "b",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "获",
      "code": "[pK]=K",
      "steps": [
        {
          "target": [
            "p",
            "K"
          ],
          "hand": "both"
        },
        {
          "target": [
            "K"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "慢",
      "code": "[:w]-v",
      "steps": [
        {
          "target": [
            ":",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "v"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "富",
      "code": "[jf]=D",
      "steps": [
        {
          "target": [
            "j",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "D"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "派",
      "code": "[ny]-?",
      "steps": [
        {
          "target": [
            "n",
            "y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "?"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "呀",
      "code": "[bP]-y",
      "steps": [
        {
          "target": [
            "b",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "血",
      "code": "[t;]=m",
      "steps": [
        {
          "target": [
            "t",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "校",
      "code": "[oZ]-h",
      "steps": [
        {
          "target": [
            "o",
            "Z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "众",
      "code": "[rm]=c",
      "steps": [
        {
          "target": [
            "r",
            "m"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "认",
      "code": "[ur]-r",
      "steps": [
        {
          "target": [
            "u",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "煮",
      "code": "[q;]=h",
      "steps": [
        {
          "target": [
            "q",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "除",
      "code": "[Yr]-x",
      "steps": [
        {
          "target": [
            "Y",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "思",
      "code": "[D:]=x",
      "steps": [
        {
          "target": [
            "D",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "官",
      "code": "[jm]=q",
      "steps": [
        {
          "target": [
            "j",
            "m"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "亦",
      "code": "[Gi]",
      "steps": [
        {
          "target": [
            "G",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "炒",
      "code": "[;E]-t",
      "steps": [
        {
          "target": [
            ";",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "圣",
      "code": "[vV]=t",
      "steps": [
        {
          "target": [
            "v",
            "V"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "形",
      "code": "[fp]-I",
      "steps": [
        {
          "target": [
            "f",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "预",
      "code": "[>?]-y",
      "steps": [
        {
          "target": [
            ">",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "规",
      "code": "[de]-j",
      "steps": [
        {
          "target": [
            "d",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "圈",
      "code": "[UR]=Y",
      "steps": [
        {
          "target": [
            "U",
            "R"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "赵",
      "code": "[dl]-i",
      "steps": [
        {
          "target": [
            "d",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "举",
      "code": "[nX]=i",
      "steps": [
        {
          "target": [
            "n",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "诺",
      "code": "[up]-b",
      "steps": [
        {
          "target": [
            "u",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "修",
      "code": "[ac]-I",
      "steps": [
        {
          "target": [
            "a",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "梅",
      "code": "[oK]-N",
      "steps": [
        {
          "target": [
            "o",
            "K"
          ],
          "hand": "both"
        },
        {
          "target": [
            "N"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "盐",
      "code": "[Vx]=;",
      "steps": [
        {
          "target": [
            "V",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            ";"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "环",
      "code": "[,c]-b",
      "steps": [
        {
          "target": [
            ",",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "课",
      "code": "[uD]-o",
      "steps": [
        {
          "target": [
            "u",
            "D"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "景",
      "code": "[ws]=E",
      "steps": [
        {
          "target": [
            "w",
            "s"
          ],
          "hand": "both"
        },
        {
          "target": [
            "E"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "货",
      "code": "[ah]=G",
      "steps": [
        {
          "target": [
            "a",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "吉",
      "code": "[Jj]",
      "steps": [
        {
          "target": [
            "J",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "论",
      "code": "[uS]-l",
      "steps": [
        {
          "target": [
            "u",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "志",
      "code": "[r:]=x",
      "steps": [
        {
          "target": [
            "r",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "铁",
      "code": "[zt]-d",
      "steps": [
        {
          "target": [
            "z",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "许",
      "code": "[uK]-e",
      "steps": [
        {
          "target": [
            "u",
            "K"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "破",
      "code": "[.H]-p",
      "steps": [
        {
          "target": [
            ".",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "含",
      "code": "[kb]=k",
      "steps": [
        {
          "target": [
            "k",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "套",
      "code": "[Tu]=c",
      "steps": [
        {
          "target": [
            "T",
            "u"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "票",
      "code": "[tN]=s",
      "steps": [
        {
          "target": [
            "t",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "防",
      "code": "[Y<]-f",
      "steps": [
        {
          "target": [
            "Y",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "采",
      "code": "[:o]=m",
      "steps": [
        {
          "target": [
            ":",
            "o"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "牌",
      "code": "[Od]-k",
      "steps": [
        {
          "target": [
            "O",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "左",
      "code": "[eS]=g",
      "steps": [
        {
          "target": [
            "e",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "答",
      "code": "[ck]=h",
      "steps": [
        {
          "target": [
            "c",
            "k"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "狗",
      "code": "[KG]-j",
      "steps": [
        {
          "target": [
            "K",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "企",
      "code": "[rI]=i",
      "steps": [
        {
          "target": [
            "r",
            "I"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "奇",
      "code": "[Tx]=k",
      "steps": [
        {
          "target": [
            "T",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "雷",
      "code": "[kD]=t",
      "steps": [
        {
          "target": [
            "k",
            "D"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "显",
      "code": "[w/]=y",
      "steps": [
        {
          "target": [
            "w",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "补",
      "code": "[?x]-b",
      "steps": [
        {
          "target": [
            "?",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "瓦",
      "code": "[kw]",
      "steps": [
        {
          "target": [
            "k",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "汉",
      "code": "[nv]-y",
      "steps": [
        {
          "target": [
            "n",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "轻",
      "code": "[Mv]-S",
      "steps": [
        {
          "target": [
            "M",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "谈",
      "code": "[uM]-y",
      "steps": [
        {
          "target": [
            "u",
            "M"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "素",
      "code": "[>R]=s",
      "steps": [
        {
          "target": [
            ">",
            "R"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "参",
      "code": "[BT]=I",
      "steps": [
        {
          "target": [
            "B",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "松",
      "code": "[oX]-B",
      "steps": [
        {
          "target": [
            "o",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "B"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "烧",
      "code": "[;U]-J",
      "steps": [
        {
          "target": [
            ";",
            "U"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "恩",
      "code": "[UT]=:",
      "steps": [
        {
          "target": [
            "U",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "倒",
      "code": "[a.]-W",
      "steps": [
        {
          "target": [
            "a",
            "."
          ],
          "hand": "both"
        },
        {
          "target": [
            "W"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "欧",
      "code": "[Wl]-:",
      "steps": [
        {
          "target": [
            "W",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "什",
      "code": "[ae]-s",
      "steps": [
        {
          "target": [
            "a",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "剧",
      "code": "[y/]-W",
      "steps": [
        {
          "target": [
            "y",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "轮",
      "code": "[MS]-l",
      "steps": [
        {
          "target": [
            "M",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "卷",
      "code": "[RY]=j",
      "steps": [
        {
          "target": [
            "R",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "冷",
      "code": "[Sk]-O",
      "steps": [
        {
          "target": [
            "S",
            "k"
          ],
          "hand": "both"
        },
        {
          "target": [
            "O"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "净",
      "code": "[SL]-l",
      "steps": [
        {
          "target": [
            "S",
            "L"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "容",
      "code": "[jL]=g",
      "steps": [
        {
          "target": [
            "j",
            "L"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "土",
      "code": "[Vt]",
      "steps": [
        {
          "target": [
            "V",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "令",
      "code": "[kO]=d",
      "steps": [
        {
          "target": [
            "k",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "党",
      "code": "[MJ]=e",
      "steps": [
        {
          "target": [
            "M",
            "J"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "停",
      "code": "[as]-G",
      "steps": [
        {
          "target": [
            "a",
            "s"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "氏",
      "code": "[Zs]",
      "steps": [
        {
          "target": [
            "Z",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "示",
      "code": "[Ns]",
      "steps": [
        {
          "target": [
            "N",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "角",
      "code": "[Lj]",
      "steps": [
        {
          "target": [
            "L",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "玉",
      "code": "[,O]=d",
      "steps": [
        {
          "target": [
            ",",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "托",
      "code": "[it]-t",
      "steps": [
        {
          "target": [
            "i",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "甜",
      "code": "[go]-g",
      "steps": [
        {
          "target": [
            "g",
            "o"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "啥",
      "code": "[br]-g",
      "steps": [
        {
          "target": [
            "b",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "九",
      "code": "[Aj]",
      "steps": [
        {
          "target": [
            "A",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "旅",
      "code": "[<K]-?",
      "steps": [
        {
          "target": [
            "<",
            "K"
          ],
          "hand": "both"
        },
        {
          "target": [
            "?"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "嘛",
      "code": "[bh]-m",
      "steps": [
        {
          "target": [
            "b",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "丝",
      "code": "[RR]-s",
      "steps": [
        {
          "target": [
            "R",
            "R"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "笑",
      "code": "[ct]=T",
      "steps": [
        {
          "target": [
            "c",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "哥",
      "code": "[xx]=k",
      "steps": [
        {
          "target": [
            "x",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "春",
      "code": "[>w]=r",
      "steps": [
        {
          "target": [
            ">",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "技",
      "code": "[i;]-i",
      "steps": [
        {
          "target": [
            "i",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "康",
      "code": "[Jl]=n",
      "steps": [
        {
          "target": [
            "J",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "勒",
      "code": "[A<]-l",
      "steps": [
        {
          "target": [
            "A",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "板",
      "code": "[oy]-v",
      "steps": [
        {
          "target": [
            "o",
            "y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "v"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "秀",
      "code": "[xT]=n",
      "steps": [
        {
          "target": [
            "x",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "财",
      "code": "[Ge]-t",
      "steps": [
        {
          "target": [
            "G",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "千",
      "code": "[kq]",
      "steps": [
        {
          "target": [
            "k",
            "q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "温",
      "code": "[nw]-;",
      "steps": [
        {
          "target": [
            "n",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            ";"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "怕",
      "code": "[:d]-b",
      "steps": [
        {
          "target": [
            ":",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "细",
      "code": "[RD]-t",
      "steps": [
        {
          "target": [
            "R",
            "D"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "存",
      "code": "[ec]=F",
      "steps": [
        {
          "target": [
            "e",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "F"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "阳",
      "code": "[Yw]-r",
      "steps": [
        {
          "target": [
            "Y",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "智",
      "code": "[Db]=w",
      "steps": [
        {
          "target": [
            "D",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "限",
      "code": "[Y;]-g",
      "steps": [
        {
          "target": [
            "Y",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "夏",
      "code": "[?/]=i",
      "steps": [
        {
          "target": [
            "?",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "迪",
      "code": "[Bp]-c",
      "steps": [
        {
          "target": [
            "B",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "翻",
      "code": "[tr]-K",
      "steps": [
        {
          "target": [
            "t",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "K"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "底",
      "code": "[JZ]=O",
      "steps": [
        {
          "target": [
            "J",
            "Z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "O"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "莱",
      "code": "[pz]=X",
      "steps": [
        {
          "target": [
            "p",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "X"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "桥",
      "code": "[ot]-W",
      "steps": [
        {
          "target": [
            "o",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "消",
      "code": "[nE]-H",
      "steps": [
        {
          "target": [
            "n",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "H"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "速",
      "code": "[Cp]-c",
      "steps": [
        {
          "target": [
            "C",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "瑞",
      "code": "[,<]-B",
      "steps": [
        {
          "target": [
            ",",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "B"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "致",
      "code": "[.a]-p",
      "steps": [
        {
          "target": [
            ".",
            "a"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "泰",
      "code": "[>n]=s",
      "steps": [
        {
          "target": [
            ">",
            "n"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "余",
      "code": "[rx]=h",
      "steps": [
        {
          "target": [
            "r",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "导",
      "code": "[Pz]=c",
      "steps": [
        {
          "target": [
            "P",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "初",
      "code": "[?u]-d",
      "steps": [
        {
          "target": [
            "?",
            "u"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "端",
      "code": "[C<]-B",
      "steps": [
        {
          "target": [
            "C",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "B"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "胜",
      "code": "[HG]-s",
      "steps": [
        {
          "target": [
            "H",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "背",
      "code": "[?h]=H",
      "steps": [
        {
          "target": [
            "?",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "H"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "研",
      "code": "[.f]-p",
      "steps": [
        {
          "target": [
            ".",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "徐",
      "code": "[gr]-x",
      "steps": [
        {
          "target": [
            "g",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "义",
      "code": "[Ol]=i",
      "steps": [
        {
          "target": [
            "O",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "朱",
      "code": "[tz]=w",
      "steps": [
        {
          "target": [
            "t",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "冲",
      "code": "[Sb]-c",
      "steps": [
        {
          "target": [
            "S",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "贴",
      "code": "[GU]-z",
      "steps": [
        {
          "target": [
            "G",
            "U"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "复",
      "code": "[Kw]=/",
      "steps": [
        {
          "target": [
            "K",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "/"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "伤",
      "code": "[aK]-<",
      "steps": [
        {
          "target": [
            "a",
            "K"
          ],
          "hand": "both"
        },
        {
          "target": [
            "<"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "孙",
      "code": "[FE]-x",
      "steps": [
        {
          "target": [
            "F",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "额",
      "code": "[jY]-?",
      "steps": [
        {
          "target": [
            "j",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "?"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "贝",
      "code": "[Gb]",
      "steps": [
        {
          "target": [
            "G",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "演",
      "code": "[nj]-R",
      "steps": [
        {
          "target": [
            "n",
            "j"
          ],
          "hand": "both"
        },
        {
          "target": [
            "R"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "居",
      "code": "[y/]=g",
      "steps": [
        {
          "target": [
            "y",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "施",
      "code": "[<K]-z",
      "steps": [
        {
          "target": [
            "<",
            "K"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "野",
      "code": "[P>]-v",
      "steps": [
        {
          "target": [
            "P",
            ">"
          ],
          "hand": "both"
        },
        {
          "target": [
            "v"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "旧",
      "code": "[cw]-r",
      "steps": [
        {
          "target": [
            "c",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "猫",
      "code": "[Kp]-D",
      "steps": [
        {
          "target": [
            "K",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "D"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "亲",
      "code": "[Co]=m",
      "steps": [
        {
          "target": [
            "C",
            "o"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "引",
      "code": "[Pc]-s",
      "steps": [
        {
          "target": [
            "P",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "武",
      "code": "[fU]=I",
      "steps": [
        {
          "target": [
            "f",
            "U"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "鲜",
      "code": "[LQ]-y",
      "steps": [
        {
          "target": [
            "L",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "息",
      "code": "[g:]=x",
      "steps": [
        {
          "target": [
            "g",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "统",
      "code": "[RN]-J",
      "steps": [
        {
          "target": [
            "R",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "蓝",
      "code": "[pW]=;",
      "steps": [
        {
          "target": [
            "p",
            "W"
          ],
          "hand": "both"
        },
        {
          "target": [
            ";"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "寺",
      "code": "[Vz]=c",
      "steps": [
        {
          "target": [
            "V",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "觉",
      "code": "[Me]=j",
      "steps": [
        {
          "target": [
            "M",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "例",
      "code": "[aJ]-W",
      "steps": [
        {
          "target": [
            "a",
            "J"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "丽",
      "code": "[fH]=H",
      "steps": [
        {
          "target": [
            "f",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "H"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "杀",
      "code": "[lo]=m",
      "steps": [
        {
          "target": [
            "l",
            "o"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "练",
      "code": "[Rt]-E",
      "steps": [
        {
          "target": [
            "R",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "E"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "假",
      "code": "[ay]-v",
      "steps": [
        {
          "target": [
            "a",
            "y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "v"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "摄",
      "code": "[iF]-m",
      "steps": [
        {
          "target": [
            "i",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "鲁",
      "code": "[Lw]=r",
      "steps": [
        {
          "target": [
            "L",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "睡",
      "code": "[Tk]-r",
      "steps": [
        {
          "target": [
            "T",
            "k"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "碗",
      "code": "[.j]-Y",
      "steps": [
        {
          "target": [
            ".",
            "j"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "压",
      "code": "[yV]=O",
      "steps": [
        {
          "target": [
            "y",
            "V"
          ],
          "hand": "both"
        },
        {
          "target": [
            "O"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "室",
      "code": "[j.]=i",
      "steps": [
        {
          "target": [
            "j",
            "."
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "棒",
      "code": "[o>]-i",
      "steps": [
        {
          "target": [
            "o",
            ">"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "唐",
      "code": "[Jl]=b",
      "steps": [
        {
          "target": [
            "J",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "顿",
      "code": "[fY]-?",
      "steps": [
        {
          "target": [
            "f",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "?"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "君",
      "code": "[lt]=b",
      "steps": [
        {
          "target": [
            "l",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "塞",
      "code": "[jh]=V",
      "steps": [
        {
          "target": [
            "j",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "V"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "宫",
      "code": "[jb]=b",
      "steps": [
        {
          "target": [
            "j",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "亮",
      "code": "[sq]=j",
      "steps": [
        {
          "target": [
            "s",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "告",
      "code": "[mb]=k",
      "steps": [
        {
          "target": [
            "m",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "喜",
      "code": "[Jb]=k",
      "steps": [
        {
          "target": [
            "J",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "韩",
      "code": "[AD]-w",
      "steps": [
        {
          "target": [
            "A",
            "D"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "糖",
      "code": "[rJ]-b",
      "steps": [
        {
          "target": [
            "r",
            "J"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "确",
      "code": "[.L]-j",
      "steps": [
        {
          "target": [
            ".",
            "L"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "莫",
      "code": "[PT]=d",
      "steps": [
        {
          "target": [
            "P",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "乡",
      "code": "[ex]",
      "steps": [
        {
          "target": [
            "e",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "兴",
      "code": "[nX]=b",
      "steps": [
        {
          "target": [
            "n",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "核",
      "code": "[oL]-h",
      "steps": [
        {
          "target": [
            "o",
            "L"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "佳",
      "code": "[aM]-g",
      "steps": [
        {
          "target": [
            "a",
            "M"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "胡",
      "code": "[/H]-y",
      "steps": [
        {
          "target": [
            "/",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "辆",
      "code": "[MY]-l",
      "steps": [
        {
          "target": [
            "M",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "功",
      "code": "[S<]-l",
      "steps": [
        {
          "target": [
            "S",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "右",
      "code": "[eb]=k",
      "steps": [
        {
          "target": [
            "e",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "音",
      "code": "[Sy]",
      "steps": [
        {
          "target": [
            "S",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "融",
      "code": "[>B]-c",
      "steps": [
        {
          "target": [
            ">",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "萨",
      "code": "[pY]=y",
      "steps": [
        {
          "target": [
            "p",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "冰",
      "code": "[Sn]-s",
      "steps": [
        {
          "target": [
            "S",
            "n"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "助",
      "code": "[q<]-l",
      "steps": [
        {
          "target": [
            "q",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "范",
      "code": "[/Y]=j",
      "steps": [
        {
          "target": [
            "/",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "略",
      "code": "[DY]-g",
      "steps": [
        {
          "target": [
            "D",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "孩",
      "code": "[FL]-h",
      "steps": [
        {
          "target": [
            "F",
            "L"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "招",
      "code": "[iu]-b",
      "steps": [
        {
          "target": [
            "i",
            "u"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "象",
      "code": "[,x]",
      "steps": [
        {
          "target": [
            ",",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "丁",
      "code": "[Gd]",
      "steps": [
        {
          "target": [
            "G",
            "d"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "盖",
      "code": "[Q;]=m",
      "steps": [
        {
          "target": [
            "Q",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "尚",
      "code": "[Ms]",
      "steps": [
        {
          "target": [
            "M",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "望",
      "code": "[uH]=,",
      "steps": [
        {
          "target": [
            "u",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            ","
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "威",
      "code": "[;f]=Z",
      "steps": [
        {
          "target": [
            ";",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Z"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "言",
      "code": "[uy]",
      "steps": [
        {
          "target": [
            "u",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "续",
      "code": "[Re]-T",
      "steps": [
        {
          "target": [
            "R",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "减",
      "code": "[S;]-b",
      "steps": [
        {
          "target": [
            "S",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "宗",
      "code": "[jN]=s",
      "steps": [
        {
          "target": [
            "j",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "谢",
      "code": "[uI]-z",
      "steps": [
        {
          "target": [
            "u",
            "I"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "落",
      "code": "[/l]",
      "steps": [
        {
          "target": [
            "/",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "险",
      "code": "[Yk]-f",
      "steps": [
        {
          "target": [
            "Y",
            "k"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "嘉",
      "code": "[J<]=b",
      "steps": [
        {
          "target": [
            "J",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "府",
      "code": "[Ja]=z",
      "steps": [
        {
          "target": [
            "J",
            "a"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "势",
      "code": "[r<]=l",
      "steps": [
        {
          "target": [
            "r",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "雪",
      "code": "[kC]=j",
      "steps": [
        {
          "target": [
            "k",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "追",
      "code": "[tm]-p",
      "steps": [
        {
          "target": [
            "t",
            "m"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "脚",
      "code": "[HV]-Y",
      "steps": [
        {
          "target": [
            "H",
            "V"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "既",
      "code": "[;z]-u",
      "steps": [
        {
          "target": [
            ";",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "始",
      "code": "[ZB]-b",
      "steps": [
        {
          "target": [
            "Z",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "郑",
      "code": "[RY]-j",
      "steps": [
        {
          "target": [
            "R",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "止",
      "code": "[Ii]",
      "steps": [
        {
          "target": [
            "I",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "届",
      "code": "[yB]=y",
      "steps": [
        {
          "target": [
            "y",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "纯",
      "code": "[Rf]-Y",
      "steps": [
        {
          "target": [
            "R",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "育",
      "code": "[NH]=y",
      "steps": [
        {
          "target": [
            "N",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "堂",
      "code": "[MV]=t",
      "steps": [
        {
          "target": [
            "M",
            "V"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "刷",
      "code": "[yQ]-W",
      "steps": [
        {
          "target": [
            "y",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "硬",
      "code": "[.g]-w",
      "steps": [
        {
          "target": [
            ".",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "毛",
      "code": "[ym]",
      "steps": [
        {
          "target": [
            "y",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "永",
      "code": "[On]=s",
      "steps": [
        {
          "target": [
            "O",
            "n"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "绿",
      "code": "[RC]-n",
      "steps": [
        {
          "target": [
            "R",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "馆",
      "code": "[fj]-m",
      "steps": [
        {
          "target": [
            "f",
            "j"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "酸",
      "code": "[UB]-/",
      "steps": [
        {
          "target": [
            "U",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "/"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "命",
      "code": "[kb]=Y",
      "steps": [
        {
          "target": [
            "k",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "依",
      "code": "[a?]-i",
      "steps": [
        {
          "target": [
            "a",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "累",
      "code": "[DR]=s",
      "steps": [
        {
          "target": [
            "D",
            "R"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "戴",
      "code": "[LD]=X",
      "steps": [
        {
          "target": [
            "L",
            "D"
          ],
          "hand": "both"
        },
        {
          "target": [
            "X"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "济",
      "code": "[nc]-q",
      "steps": [
        {
          "target": [
            "n",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "蒂",
      "code": "[ph]=Q",
      "steps": [
        {
          "target": [
            "p",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Q"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "雨",
      "code": "[kv]",
      "steps": [
        {
          "target": [
            "k",
            "v"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "备",
      "code": "[/D]=t",
      "steps": [
        {
          "target": [
            "/",
            "D"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "坏",
      "code": "[Vc]-b",
      "steps": [
        {
          "target": [
            "V",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "尽",
      "code": "[yO]=S",
      "steps": [
        {
          "target": [
            "y",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "健",
      "code": "[al]-g",
      "steps": [
        {
          "target": [
            "a",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "登",
      "code": "[I>]=d",
      "steps": [
        {
          "target": [
            "I",
            ">"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "齐",
      "code": "[cq]",
      "steps": [
        {
          "target": [
            "c",
            "q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "待",
      "code": "[gV]-z",
      "steps": [
        {
          "target": [
            "g",
            "V"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "控",
      "code": "[iI]-S",
      "steps": [
        {
          "target": [
            "i",
            "I"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "蒙",
      "code": "[Kf]=Q",
      "steps": [
        {
          "target": [
            "K",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Q"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "决",
      "code": "[SW]-r",
      "steps": [
        {
          "target": [
            "S",
            "W"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "餐",
      "code": "[Jv]=f",
      "steps": [
        {
          "target": [
            "J",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "状",
      "code": "[?K]-q",
      "steps": [
        {
          "target": [
            "?",
            "K"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "挂",
      "code": "[iM]-g",
      "steps": [
        {
          "target": [
            "i",
            "M"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "职",
      "code": "[Fb]-X",
      "steps": [
        {
          "target": [
            "F",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "X"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "雅",
      "code": "[P,]-i",
      "steps": [
        {
          "target": [
            "P",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "郭",
      "code": "[sF]-Y",
      "steps": [
        {
          "target": [
            "s",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "笔",
      "code": "[cy]=m",
      "steps": [
        {
          "target": [
            "c",
            "y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "虾",
      "code": "[Bf]-x",
      "steps": [
        {
          "target": [
            "B",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "付",
      "code": "[az]-c",
      "steps": [
        {
          "target": [
            "a",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "归",
      "code": "[WC]-j",
      "steps": [
        {
          "target": [
            "W",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "评",
      "code": "[u?]-X",
      "steps": [
        {
          "target": [
            "u",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            "X"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "泽",
      "code": "[nv]-i",
      "steps": [
        {
          "target": [
            "n",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "跳",
      "code": "[sJ]-S",
      "steps": [
        {
          "target": [
            "s",
            "J"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "宁",
      "code": "[jG]=d",
      "steps": [
        {
          "target": [
            "j",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "汽",
      "code": "[nD]-q",
      "steps": [
        {
          "target": [
            "n",
            "D"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "赚",
      "code": "[GX]-;",
      "steps": [
        {
          "target": [
            "G",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            ";"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "炸",
      "code": "[;H]-a",
      "steps": [
        {
          "target": [
            ";",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "积",
      "code": "[xb]-X",
      "steps": [
        {
          "target": [
            "x",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "X"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "跌",
      "code": "[st]-d",
      "steps": [
        {
          "target": [
            "s",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "测",
      "code": "[nG]-W",
      "steps": [
        {
          "target": [
            "n",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "益",
      "code": "[n;]=m",
      "steps": [
        {
          "target": [
            "n",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "杰",
      "code": "[o;]=h",
      "steps": [
        {
          "target": [
            "o",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "故",
      "code": "[/a]-p",
      "steps": [
        {
          "target": [
            "/",
            "a"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "诗",
      "code": "[uV]-z",
      "steps": [
        {
          "target": [
            "u",
            "V"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "乱",
      "code": "[gA]-e",
      "steps": [
        {
          "target": [
            "g",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "互",
      "code": "[fC]=j",
      "steps": [
        {
          "target": [
            "f",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "曼",
      "code": "[wO]=v",
      "steps": [
        {
          "target": [
            "w",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            "v"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "盛",
      "code": "[;A]=;",
      "steps": [
        {
          "target": [
            ";",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            ";"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "帕",
      "code": "[Qd]-b",
      "steps": [
        {
          "target": [
            "Q",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "置",
      "code": "[OA]=z",
      "steps": [
        {
          "target": [
            "O",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "藏",
      "code": "[p;]=K",
      "steps": [
        {
          "target": [
            "p",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "K"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "谷",
      "code": "[Lg]",
      "steps": [
        {
          "target": [
            "L",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "杜",
      "code": "[oV]-t",
      "steps": [
        {
          "target": [
            "o",
            "V"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "印",
      "code": "[Wf]-Y",
      "steps": [
        {
          "target": [
            "W",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "良",
      "code": "[O;]=g",
      "steps": [
        {
          "target": [
            "O",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "负",
      "code": "[LG]=b",
      "steps": [
        {
          "target": [
            "L",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "编",
      "code": "[RQ]-F",
      "steps": [
        {
          "target": [
            "R",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "F"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "酱",
      "code": "[?S]=U",
      "steps": [
        {
          "target": [
            "?",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "U"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "汁",
      "code": "[ne]-s",
      "steps": [
        {
          "target": [
            "n",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "饰",
      "code": "[fK]-Q",
      "steps": [
        {
          "target": [
            "f",
            "K"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "厅",
      "code": "[yG]=d",
      "steps": [
        {
          "target": [
            "y",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "效",
      "code": "[Zh]-a",
      "steps": [
        {
          "target": [
            "Z",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "顶",
      "code": "[G?]-y",
      "steps": [
        {
          "target": [
            "G",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "咸",
      "code": "[;f]=b",
      "steps": [
        {
          "target": [
            ";",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "软",
      "code": "[M:]-q",
      "steps": [
        {
          "target": [
            "M",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "抓",
      "code": "[i:]-a",
      "steps": [
        {
          "target": [
            "i",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "唱",
      "code": "[bw]-w",
      "steps": [
        {
          "target": [
            "b",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "猪",
      "code": "[Kq]-z",
      "steps": [
        {
          "target": [
            "K",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "借",
      "code": "[aR]-w",
      "steps": [
        {
          "target": [
            "a",
            "R"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "章",
      "code": "[Se]=s",
      "steps": [
        {
          "target": [
            "S",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "伦",
      "code": "[aS]-l",
      "steps": [
        {
          "target": [
            "a",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "伯",
      "code": "[ad]-b",
      "steps": [
        {
          "target": [
            "a",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "庄",
      "code": "[JV]=t",
      "steps": [
        {
          "target": [
            "J",
            "V"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "断",
      "code": "[rA]-/",
      "steps": [
        {
          "target": [
            "r",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "/"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "梁",
      "code": "[nu]=o",
      "steps": [
        {
          "target": [
            "n",
            "u"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "厂",
      "code": "[yc]",
      "steps": [
        {
          "target": [
            "y",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "宋",
      "code": "[jo]=m",
      "steps": [
        {
          "target": [
            "j",
            "o"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "草",
      "code": "[Pe]=s",
      "steps": [
        {
          "target": [
            "P",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "虽",
      "code": "[bB]=c",
      "steps": [
        {
          "target": [
            "b",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "厚",
      "code": "[yw]=F",
      "steps": [
        {
          "target": [
            "y",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "F"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "委",
      "code": "[xZ]=n",
      "steps": [
        {
          "target": [
            "x",
            "Z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "甲",
      "code": "[Oj]",
      "steps": [
        {
          "target": [
            "O",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "失",
      "code": "[td]=f",
      "steps": [
        {
          "target": [
            "t",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "埃",
      "code": "[VB]-D",
      "steps": [
        {
          "target": [
            "V",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "D"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "议",
      "code": "[uO]-l",
      "steps": [
        {
          "target": [
            "u",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "简",
      "code": "[cI]=w",
      "steps": [
        {
          "target": [
            "c",
            "I"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "惠",
      "code": "[fw]=:",
      "steps": [
        {
          "target": [
            "f",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "卫",
      "code": "[Yf]=i",
      "steps": [
        {
          "target": [
            "Y",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "识",
      "code": "[ub]-X",
      "steps": [
        {
          "target": [
            "u",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "X"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "善",
      "code": "[QX]=b",
      "steps": [
        {
          "target": [
            "Q",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "封",
      "code": "[Mz]-c",
      "steps": [
        {
          "target": [
            "M",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "爆",
      "code": "[;w]-n",
      "steps": [
        {
          "target": [
            ";",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "划",
      "code": "[UW]-d",
      "steps": [
        {
          "target": [
            "U",
            "W"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "农",
      "code": "[C?]=i",
      "steps": [
        {
          "target": [
            "C",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "刀",
      "code": "[ud]",
      "steps": [
        {
          "target": [
            "u",
            "d"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "吸",
      "code": "[bs]-j",
      "steps": [
        {
          "target": [
            "b",
            "s"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "佛",
      "code": "[aP]-f",
      "steps": [
        {
          "target": [
            "a",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "击",
      "code": "[iF]=t",
      "steps": [
        {
          "target": [
            "i",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "母",
      "code": "[Nm]",
      "steps": [
        {
          "target": [
            "N",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "熟",
      "code": "[sF]=;",
      "steps": [
        {
          "target": [
            "s",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            ";"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "充",
      "code": "[NJ]=e",
      "steps": [
        {
          "target": [
            "N",
            "J"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "退",
      "code": "[;p]-c",
      "steps": [
        {
          "target": [
            ";",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "售",
      "code": "[,b]=k",
      "steps": [
        {
          "target": [
            ",",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "卢",
      "code": "[xy]=s",
      "steps": [
        {
          "target": [
            "x",
            "y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "销",
      "code": "[zE]-H",
      "steps": [
        {
          "target": [
            "z",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "H"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "朝",
      "code": "[AH]-y",
      "steps": [
        {
          "target": [
            "A",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "弄",
      "code": "[,p]=c",
      "steps": [
        {
          "target": [
            ",",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "艾",
      "code": "[pl]=i",
      "steps": [
        {
          "target": [
            "p",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "券",
      "code": "[Ru]=d",
      "steps": [
        {
          "target": [
            "R",
            "u"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "族",
      "code": "[<K]-D",
      "steps": [
        {
          "target": [
            "<",
            "K"
          ],
          "hand": "both"
        },
        {
          "target": [
            "D"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "姆",
      "code": "[ZN]-m",
      "steps": [
        {
          "target": [
            "Z",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "响",
      "code": "[bq]-b",
      "steps": [
        {
          "target": [
            "b",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "哭",
      "code": "[mK]=q",
      "steps": [
        {
          "target": [
            "m",
            "K"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "急",
      "code": "[LC]=:",
      "steps": [
        {
          "target": [
            "L",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "免",
      "code": "[AJ]=e",
      "steps": [
        {
          "target": [
            "A",
            "J"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "伟",
      "code": "[aD]-w",
      "steps": [
        {
          "target": [
            "a",
            "D"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "输",
      "code": "[Mk]-W",
      "steps": [
        {
          "target": [
            "M",
            "k"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "继",
      "code": "[Rr]-A",
      "steps": [
        {
          "target": [
            "R",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "A"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "曲",
      "code": "[Fq]",
      "steps": [
        {
          "target": [
            "F",
            "q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "灵",
      "code": "[C;]=h",
      "steps": [
        {
          "target": [
            "C",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "护",
      "code": "[iQ]-h",
      "steps": [
        {
          "target": [
            "i",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "痛",
      "code": "[lB]=q",
      "steps": [
        {
          "target": [
            "l",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "抢",
      "code": "[ir]-Y",
      "steps": [
        {
          "target": [
            "i",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "纸",
      "code": "[RZ]-s",
      "steps": [
        {
          "target": [
            "R",
            "Z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "态",
      "code": "[TO]=:",
      "steps": [
        {
          "target": [
            "T",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "夜",
      "code": "[Za]=H",
      "steps": [
        {
          "target": [
            "Z",
            "a"
          ],
          "hand": "both"
        },
        {
          "target": [
            "H"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "泡",
      "code": "[n.]-P",
      "steps": [
        {
          "target": [
            "n",
            "."
          ],
          "hand": "both"
        },
        {
          "target": [
            "P"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "麦",
      "code": "[>/]=i",
      "steps": [
        {
          "target": [
            ">",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "墙",
      "code": "[VV]-b",
      "steps": [
        {
          "target": [
            "V",
            "V"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "严",
      "code": "[f;]=y",
      "steps": [
        {
          "target": [
            "f",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "稳",
      "code": "[xL]-:",
      "steps": [
        {
          "target": [
            "x",
            "L"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "骨",
      "code": "[qg]",
      "steps": [
        {
          "target": [
            "q",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "顺",
      "code": "[Y?]-y",
      "steps": [
        {
          "target": [
            "Y",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "荣",
      "code": "[Ko]=m",
      "steps": [
        {
          "target": [
            "K",
            "o"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "乌",
      "code": "[Xu]",
      "steps": [
        {
          "target": [
            "X",
            "u"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "抗",
      "code": "[iZ]-q",
      "steps": [
        {
          "target": [
            "i",
            "Z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "架",
      "code": "[<b]=o",
      "steps": [
        {
          "target": [
            "<",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "适",
      "code": "[gp]-c",
      "steps": [
        {
          "target": [
            "g",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "桌",
      "code": "[xw]=o",
      "steps": [
        {
          "target": [
            "x",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "丰",
      "code": "[>f]",
      "steps": [
        {
          "target": [
            ">",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "钟",
      "code": "[zb]-c",
      "steps": [
        {
          "target": [
            "z",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "宽",
      "code": "[jp]=e",
      "steps": [
        {
          "target": [
            "j",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "抱",
      "code": "[i.]-P",
      "steps": [
        {
          "target": [
            "i",
            "."
          ],
          "hand": "both"
        },
        {
          "target": [
            "P"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "蛋",
      "code": "[CB]=c",
      "steps": [
        {
          "target": [
            "C",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "艺",
      "code": "[pj]=i",
      "steps": [
        {
          "target": [
            "p",
            "j"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "灯",
      "code": "[;G]-d",
      "steps": [
        {
          "target": [
            ";",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "围",
      "code": "[UD]=w",
      "steps": [
        {
          "target": [
            "U",
            "D"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "忘",
      "code": "[u:]=x",
      "steps": [
        {
          "target": [
            "u",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "零",
      "code": "[kk]=O",
      "steps": [
        {
          "target": [
            "k",
            "k"
          ],
          "hand": "both"
        },
        {
          "target": [
            "O"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "遇",
      "code": "[DB]-p",
      "steps": [
        {
          "target": [
            "D",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "腿",
      "code": "[H;]-p",
      "steps": [
        {
          "target": [
            "H",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "申",
      "code": "[wc]=s",
      "steps": [
        {
          "target": [
            "w",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "晓",
      "code": "[wU]-J",
      "steps": [
        {
          "target": [
            "w",
            "U"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "批",
      "code": "[ih]-h",
      "steps": [
        {
          "target": [
            "i",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "粥",
      "code": "[Pr]=P",
      "steps": [
        {
          "target": [
            "P",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "P"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "兹",
      "code": "[X>]=>",
      "steps": [
        {
          "target": [
            "X",
            ">"
          ],
          "hand": "both"
        },
        {
          "target": [
            ">"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "享",
      "code": "[sF]=i",
      "steps": [
        {
          "target": [
            "s",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "折",
      "code": "[i/]-j",
      "steps": [
        {
          "target": [
            "i",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "债",
      "code": "[a>]-G",
      "steps": [
        {
          "target": [
            "a",
            ">"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G"
          ],
          "hand": "left"
        }
      ]
    }
  ],
  [
    {
      "char": "弹",
      "code": "[PX]-e",
      "steps": [
        {
          "target": [
            "P",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "衣",
      "code": "[?i]",
      "steps": [
        {
          "target": [
            "?",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "露",
      "code": "[ks]=Y",
      "steps": [
        {
          "target": [
            "k",
            "s"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "薄",
      "code": "[/L]=z",
      "steps": [
        {
          "target": [
            "/",
            "L"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "姜",
      "code": "[QZ]=n",
      "steps": [
        {
          "target": [
            "Q",
            "Z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "页",
      "code": "[?y]",
      "steps": [
        {
          "target": [
            "?",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "税",
      "code": "[xX]-J",
      "steps": [
        {
          "target": [
            "x",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "般",
      "code": "[WT]-s",
      "steps": [
        {
          "target": [
            "W",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "陆",
      "code": "[Yi]-F",
      "steps": [
        {
          "target": [
            "Y",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "F"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "赫",
      "code": "[VG]-G",
      "steps": [
        {
          "target": [
            "V",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "屋",
      "code": "[y.]=i",
      "steps": [
        {
          "target": [
            "y",
            "."
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "倍",
      "code": "[aC]-b",
      "steps": [
        {
          "target": [
            "a",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "滴",
      "code": "[nh]-/",
      "steps": [
        {
          "target": [
            "n",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "/"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "损",
      "code": "[ib]-G",
      "steps": [
        {
          "target": [
            "i",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "警",
      "code": "[pG]=u",
      "steps": [
        {
          "target": [
            "p",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "码",
      "code": "[./]-m",
      "steps": [
        {
          "target": [
            ".",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "独",
      "code": "[KB]-c",
      "steps": [
        {
          "target": [
            "K",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "彩",
      "code": "[:o]-I",
      "steps": [
        {
          "target": [
            ":",
            "o"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "湾",
      "code": "[nG]-P",
      "steps": [
        {
          "target": [
            "n",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "P"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "须",
      "code": "[I?]-y",
      "steps": [
        {
          "target": [
            "I",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "脑",
      "code": "[HZ]-F",
      "steps": [
        {
          "target": [
            "H",
            "Z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "F"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "坑",
      "code": "[VZ]-q",
      "steps": [
        {
          "target": [
            "V",
            "Z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "候",
      "code": "[ac]-D",
      "steps": [
        {
          "target": [
            "a",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "D"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "静",
      "code": "[>H]-l",
      "steps": [
        {
          "target": [
            ">",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "礼",
      "code": "[NA]-e",
      "steps": [
        {
          "target": [
            "N",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "戏",
      "code": "[vU]-g",
      "steps": [
        {
          "target": [
            "v",
            "U"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "弗",
      "code": "[Pf]",
      "steps": [
        {
          "target": [
            "P",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "颗",
      "code": "[Do]-?",
      "steps": [
        {
          "target": [
            "D",
            "o"
          ],
          "hand": "both"
        },
        {
          "target": [
            "?"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "耶",
      "code": "[FY]-j",
      "steps": [
        {
          "target": [
            "F",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "录",
      "code": "[Cn]=s",
      "steps": [
        {
          "target": [
            "C",
            "n"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "淡",
      "code": "[nM]-y",
      "steps": [
        {
          "target": [
            "n",
            "M"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "习",
      "code": "[yx]",
      "steps": [
        {
          "target": [
            "y",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "历",
      "code": "[y<]=l",
      "steps": [
        {
          "target": [
            "y",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "扎",
      "code": "[iA]-e",
      "steps": [
        {
          "target": [
            "i",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "念",
      "code": "[k:]=x",
      "steps": [
        {
          "target": [
            "k",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "秋",
      "code": "[x;]-h",
      "steps": [
        {
          "target": [
            "x",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "忙",
      "code": "[:u]-w",
      "steps": [
        {
          "target": [
            ":",
            "u"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "症",
      "code": "[lf]=I",
      "steps": [
        {
          "target": [
            "l",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "缺",
      "code": "[EW]-r",
      "steps": [
        {
          "target": [
            "E",
            "W"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "临",
      "code": "[Wc]-w",
      "steps": [
        {
          "target": [
            "W",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "聊",
      "code": "[F:]-m",
      "steps": [
        {
          "target": [
            "F",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "羊",
      "code": "[Qy]",
      "steps": [
        {
          "target": [
            "Q",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "航",
      "code": "[WZ]-q",
      "steps": [
        {
          "target": [
            "W",
            "Z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "纪",
      "code": "[RP]-j",
      "steps": [
        {
          "target": [
            "R",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "紧",
      "code": "[Wv]=R",
      "steps": [
        {
          "target": [
            "W",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "R"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "挑",
      "code": "[iJ]-S",
      "steps": [
        {
          "target": [
            "i",
            "J"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "策",
      "code": "[co]=F",
      "steps": [
        {
          "target": [
            "c",
            "o"
          ],
          "hand": "both"
        },
        {
          "target": [
            "F"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "庆",
      "code": "[JT]=d",
      "steps": [
        {
          "target": [
            "J",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "瘦",
      "code": "[l?]=v",
      "steps": [
        {
          "target": [
            "l",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            "v"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "汇",
      "code": "[nW]-j",
      "steps": [
        {
          "target": [
            "n",
            "W"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "终",
      "code": "[R/]-S",
      "steps": [
        {
          "target": [
            "R",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "监",
      "code": "[Wc]=;",
      "steps": [
        {
          "target": [
            "W",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            ";"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "菲",
      "code": "[pt]=f",
      "steps": [
        {
          "target": [
            "p",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "脆",
      "code": "[HL]-Y",
      "steps": [
        {
          "target": [
            "H",
            "L"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "仁",
      "code": "[aE]-e",
      "steps": [
        {
          "target": [
            "a",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "苦",
      "code": "[p/]=g",
      "steps": [
        {
          "target": [
            "p",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "兵",
      "code": "[/X]=b",
      "steps": [
        {
          "target": [
            "/",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "际",
      "code": "[YN]-s",
      "steps": [
        {
          "target": [
            "Y",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "丹",
      "code": "[FZ]=t",
      "steps": [
        {
          "target": [
            "F",
            "Z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "构",
      "code": "[o.]-B",
      "steps": [
        {
          "target": [
            "o",
            "."
          ],
          "hand": "both"
        },
        {
          "target": [
            "B"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "幅",
      "code": "[Qf]-D",
      "steps": [
        {
          "target": [
            "Q",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "D"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "闻",
      "code": "[IF]=e",
      "steps": [
        {
          "target": [
            "I",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "况",
      "code": "[Sb]-J",
      "steps": [
        {
          "target": [
            "S",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "朗",
      "code": "[O;]-H",
      "steps": [
        {
          "target": [
            "O",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "H"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "玛",
      "code": "[,/]-m",
      "steps": [
        {
          "target": [
            ",",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "船",
      "code": "[Wq]-b",
      "steps": [
        {
          "target": [
            "W",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "堡",
      "code": "[ab]=V",
      "steps": [
        {
          "target": [
            "a",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "V"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "混",
      "code": "[nw]-h",
      "steps": [
        {
          "target": [
            "n",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "烂",
      "code": "[;X]-d",
      "steps": [
        {
          "target": [
            ";",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "圆",
      "code": "[Ub]=G",
      "steps": [
        {
          "target": [
            "U",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "饼",
      "code": "[fX]-p",
      "steps": [
        {
          "target": [
            "f",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "滑",
      "code": "[nq]-g",
      "steps": [
        {
          "target": [
            "n",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "争",
      "code": "[Ll]=v",
      "steps": [
        {
          "target": [
            "L",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            "v"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "摆",
      "code": "[iO]-B",
      "steps": [
        {
          "target": [
            "i",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            "B"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "凯",
      "code": "[<P]-q",
      "steps": [
        {
          "target": [
            "<",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "俩",
      "code": "[aY]-l",
      "steps": [
        {
          "target": [
            "a",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "境",
      "code": "[VS]-J",
      "steps": [
        {
          "target": [
            "V",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "剑",
      "code": "[kn]-W",
      "steps": [
        {
          "target": [
            "k",
            "n"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "尾",
      "code": "[yy]=m",
      "steps": [
        {
          "target": [
            "y",
            "y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "隆",
      "code": "[Y/]-G",
      "steps": [
        {
          "target": [
            "Y",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "帝",
      "code": "[hQ]=j",
      "steps": [
        {
          "target": [
            "h",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "承",
      "code": "[An]=d",
      "steps": [
        {
          "target": [
            "A",
            "n"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "搭",
      "code": "[ip]-k",
      "steps": [
        {
          "target": [
            "i",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "敏",
      "code": "[KN]-a",
      "steps": [
        {
          "target": [
            "K",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "载",
      "code": "[Lz]",
      "steps": [
        {
          "target": [
            "L",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "床",
      "code": "[Jo]=m",
      "steps": [
        {
          "target": [
            "J",
            "o"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "绝",
      "code": "[RL]-T",
      "steps": [
        {
          "target": [
            "R",
            "L"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "剂",
      "code": "[cW]-d",
      "steps": [
        {
          "target": [
            "c",
            "W"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "守",
      "code": "[jz]=c",
      "steps": [
        {
          "target": [
            "j",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "签",
      "code": "[ck]=f",
      "steps": [
        {
          "target": [
            "c",
            "k"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "逛",
      "code": "[K,]-p",
      "steps": [
        {
          "target": [
            "K",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "井",
      "code": "[hj]",
      "steps": [
        {
          "target": [
            "h",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "沃",
      "code": "[nt]-T",
      "steps": [
        {
          "target": [
            "n",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "宜",
      "code": "[jq]=q",
      "steps": [
        {
          "target": [
            "j",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "贷",
      "code": "[aU]=G",
      "steps": [
        {
          "target": [
            "a",
            "U"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "冬",
      "code": "[/S]=b",
      "steps": [
        {
          "target": [
            "/",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "敢",
      "code": "[AF]-a",
      "steps": [
        {
          "target": [
            "A",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "宇",
      "code": "[jf]=e",
      "steps": [
        {
          "target": [
            "j",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "嫩",
      "code": "[ZC]-a",
      "steps": [
        {
          "target": [
            "Z",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "霍",
      "code": "[k,]=i",
      "steps": [
        {
          "target": [
            "k",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "订",
      "code": "[uG]-d",
      "steps": [
        {
          "target": [
            "u",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "爸",
      "code": "[hT]=b",
      "steps": [
        {
          "target": [
            "h",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "怪",
      "code": "[:v]-V",
      "steps": [
        {
          "target": [
            ":",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "V"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "域",
      "code": "[VU]-f",
      "steps": [
        {
          "target": [
            "V",
            "U"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "介",
      "code": "[rW]=d",
      "steps": [
        {
          "target": [
            "r",
            "W"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "检",
      "code": "[ok]-f",
      "steps": [
        {
          "target": [
            "o",
            "k"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "池",
      "code": "[nz]-y",
      "steps": [
        {
          "target": [
            "n",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "键",
      "code": "[zl]-g",
      "steps": [
        {
          "target": [
            "z",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "嘴",
      "code": "[bI]-L",
      "steps": [
        {
          "target": [
            "b",
            "I"
          ],
          "hand": "both"
        },
        {
          "target": [
            "L"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "佩",
      "code": "[aq]-Q",
      "steps": [
        {
          "target": [
            "a",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "陪",
      "code": "[YC]-b",
      "steps": [
        {
          "target": [
            "Y",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "堆",
      "code": "[V,]-i",
      "steps": [
        {
          "target": [
            "V",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "帅",
      "code": "[WQ]-j",
      "steps": [
        {
          "target": [
            "W",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "验",
      "code": "[/k]-f",
      "steps": [
        {
          "target": [
            "/",
            "k"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "秒",
      "code": "[xE]-t",
      "steps": [
        {
          "target": [
            "x",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "密",
      "code": "[j:]=<",
      "steps": [
        {
          "target": [
            "j",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "<"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "洪",
      "code": "[nR]-X",
      "steps": [
        {
          "target": [
            "n",
            "R"
          ],
          "hand": "both"
        },
        {
          "target": [
            "X"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "父",
      "code": "[hf]",
      "steps": [
        {
          "target": [
            "h",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "尝",
      "code": "[MN]=y",
      "steps": [
        {
          "target": [
            "M",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "牙",
      "code": "[Py]",
      "steps": [
        {
          "target": [
            "P",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "桶",
      "code": "[oB]-q",
      "steps": [
        {
          "target": [
            "o",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "吹",
      "code": "[b:]-q",
      "steps": [
        {
          "target": [
            "b",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "奶",
      "code": "[ZT]-n",
      "steps": [
        {
          "target": [
            "Z",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "鞋",
      "code": "[AM]-g",
      "steps": [
        {
          "target": [
            "A",
            "M"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "浓",
      "code": "[nC]-?",
      "steps": [
        {
          "target": [
            "n",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "?"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "启",
      "code": "[Qb]=k",
      "steps": [
        {
          "target": [
            "Q",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "协",
      "code": "[e<]-X",
      "steps": [
        {
          "target": [
            "e",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "X"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "跨",
      "code": "[sT]-A",
      "steps": [
        {
          "target": [
            "s",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "A"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "熊",
      "code": "[BH]=;",
      "steps": [
        {
          "target": [
            "B",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            ";"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "麻",
      "code": "[hm]",
      "steps": [
        {
          "target": [
            "h",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "弱",
      "code": "[PS]-S",
      "steps": [
        {
          "target": [
            "P",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "链",
      "code": "[zM]-p",
      "steps": [
        {
          "target": [
            "z",
            "M"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "典",
      "code": "[FX]=b",
      "steps": [
        {
          "target": [
            "F",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "韦",
      "code": "[Dw]",
      "steps": [
        {
          "target": [
            "D",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "散",
      "code": "[RH]-a",
      "steps": [
        {
          "target": [
            "R",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "鸟",
      "code": "[Xn]",
      "steps": [
        {
          "target": [
            "X",
            "n"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "饱",
      "code": "[f.]-P",
      "steps": [
        {
          "target": [
            "f",
            "."
          ],
          "hand": "both"
        },
        {
          "target": [
            "P"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "仓",
      "code": "[rY]=j",
      "steps": [
        {
          "target": [
            "r",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "旺",
      "code": "[w,]-w",
      "steps": [
        {
          "target": [
            "w",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "虎",
      "code": "[Oh]",
      "steps": [
        {
          "target": [
            "O",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "郡",
      "code": "[lt]-Y",
      "steps": [
        {
          "target": [
            "l",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "患",
      "code": "[bb]=:",
      "steps": [
        {
          "target": [
            "b",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "洋",
      "code": "[nQ]-y",
      "steps": [
        {
          "target": [
            "n",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "愿",
      "code": "[yd]=:",
      "steps": [
        {
          "target": [
            "y",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "蒸",
      "code": "[pA]=;",
      "steps": [
        {
          "target": [
            "p",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            ";"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "尤",
      "code": "[:y]",
      "steps": [
        {
          "target": [
            ":",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "透",
      "code": "[xT]-p",
      "steps": [
        {
          "target": [
            "x",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "毒",
      "code": "[>N]=m",
      "steps": [
        {
          "target": [
            ">",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "呈",
      "code": "[b,]=w",
      "steps": [
        {
          "target": [
            "b",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "救",
      "code": "[fn]-a",
      "steps": [
        {
          "target": [
            "f",
            "n"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "欢",
      "code": "[v:]-q",
      "steps": [
        {
          "target": [
            "v",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "舞",
      "code": "[Kh]=r",
      "steps": [
        {
          "target": [
            "K",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "侧",
      "code": "[aG]-W",
      "steps": [
        {
          "target": [
            "a",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "沈",
      "code": "[nC]-J",
      "steps": [
        {
          "target": [
            "n",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "董",
      "code": "[pk]=P",
      "steps": [
        {
          "target": [
            "p",
            "k"
          ],
          "hand": "both"
        },
        {
          "target": [
            "P"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "突",
      "code": "[IK]=q",
      "steps": [
        {
          "target": [
            "I",
            "K"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "究",
      "code": "[IA]=j",
      "steps": [
        {
          "target": [
            "I",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "辉",
      "code": "[xC]-M",
      "steps": [
        {
          "target": [
            "x",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "M"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "币",
      "code": "[tQ]=j",
      "steps": [
        {
          "target": [
            "t",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "末",
      "code": "[fo]=m",
      "steps": [
        {
          "target": [
            "f",
            "o"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "异",
      "code": "[Pp]=c",
      "steps": [
        {
          "target": [
            "P",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "迷",
      "code": "[rp]-c",
      "steps": [
        {
          "target": [
            "r",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "鬼",
      "code": "[Gg]",
      "steps": [
        {
          "target": [
            "G",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "移",
      "code": "[xS]-S",
      "steps": [
        {
          "target": [
            "x",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "润",
      "code": "[nI]-,",
      "steps": [
        {
          "target": [
            "n",
            "I"
          ],
          "hand": "both"
        },
        {
          "target": [
            ","
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "祝",
      "code": "[Nb]-J",
      "steps": [
        {
          "target": [
            "N",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "拼",
      "code": "[iX]-p",
      "steps": [
        {
          "target": [
            "i",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "萌",
      "code": "[pw]=H",
      "steps": [
        {
          "target": [
            "p",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "H"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "秦",
      "code": "[>x]=h",
      "steps": [
        {
          "target": [
            ">",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "搜",
      "code": "[i?]-v",
      "steps": [
        {
          "target": [
            "i",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            "v"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "材",
      "code": "[oe]-t",
      "steps": [
        {
          "target": [
            "o",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "皆",
      "code": "[hh]=d",
      "steps": [
        {
          "target": [
            "h",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "拟",
      "code": "[ih]-r",
      "steps": [
        {
          "target": [
            "i",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "孔",
      "code": "[FA]-e",
      "steps": [
        {
          "target": [
            "F",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "宣",
      "code": "[jf]=f",
      "steps": [
        {
          "target": [
            "j",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "播",
      "code": "[it]-D",
      "steps": [
        {
          "target": [
            "i",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "D"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "茨",
      "code": "[pE]=c",
      "steps": [
        {
          "target": [
            "p",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "魔",
      "code": "[hG]=g",
      "steps": [
        {
          "target": [
            "h",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "责",
      "code": "[>G]=b",
      "steps": [
        {
          "target": [
            ">",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "兼",
      "code": "[Xl]=;",
      "steps": [
        {
          "target": [
            "X",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            ";"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "瓶",
      "code": "[Xp]-k",
      "steps": [
        {
          "target": [
            "X",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "姓",
      "code": "[ZG]-s",
      "steps": [
        {
          "target": [
            "Z",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "斤",
      "code": "[/j]",
      "steps": [
        {
          "target": [
            "/",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "赢",
      "code": "[gG]=b",
      "steps": [
        {
          "target": [
            "g",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "液",
      "code": "[nZ]-H",
      "steps": [
        {
          "target": [
            "n",
            "Z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "H"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "骂",
      "code": "[m/]=m",
      "steps": [
        {
          "target": [
            "m",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "培",
      "code": "[VC]-b",
      "steps": [
        {
          "target": [
            "V",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "审",
      "code": "[jw]=c",
      "steps": [
        {
          "target": [
            "j",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "晒",
      "code": "[wt]-x",
      "steps": [
        {
          "target": [
            "w",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "甚",
      "code": "[dA]=e",
      "steps": [
        {
          "target": [
            "d",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "租",
      "code": "[xq]-q",
      "steps": [
        {
          "target": [
            "x",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "脱",
      "code": "[HX]-J",
      "steps": [
        {
          "target": [
            "H",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "罪",
      "code": "[Ot]=f",
      "steps": [
        {
          "target": [
            "O",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "冯",
      "code": "[S/]-m",
      "steps": [
        {
          "target": [
            "S",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "附",
      "code": "[Ya]-z",
      "steps": [
        {
          "target": [
            "Y",
            "a"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "怀",
      "code": "[:c]-b",
      "steps": [
        {
          "target": [
            ":",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "凉",
      "code": "[Ss]-E",
      "steps": [
        {
          "target": [
            "S",
            "s"
          ],
          "hand": "both"
        },
        {
          "target": [
            "E"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "溪",
      "code": "[n:]-T",
      "steps": [
        {
          "target": [
            "n",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "岩",
      "code": "[<.]=s",
      "steps": [
        {
          "target": [
            "<",
            "."
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "喷",
      "code": "[be]-G",
      "steps": [
        {
          "target": [
            "b",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "洲",
      "code": "[nY]-Y",
      "steps": [
        {
          "target": [
            "n",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "榜",
      "code": "[oh]-<",
      "steps": [
        {
          "target": [
            "o",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "<"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "驻",
      "code": "[/O]-,",
      "steps": [
        {
          "target": [
            "/",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            ","
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "泪",
      "code": "[nT]-m",
      "steps": [
        {
          "target": [
            "n",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "雄",
      "code": "[eB]-,",
      "steps": [
        {
          "target": [
            "e",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            ","
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "娜",
      "code": "[ZA]-Y",
      "steps": [
        {
          "target": [
            "Z",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "遭",
      "code": "[fF]-p",
      "steps": [
        {
          "target": [
            "f",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "延",
      "code": "[Cg]-y",
      "steps": [
        {
          "target": [
            "C",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "骑",
      "code": "[/T]-x",
      "steps": [
        {
          "target": [
            "/",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "蟹",
      "code": "[Lu]=B",
      "steps": [
        {
          "target": [
            "L",
            "u"
          ],
          "hand": "both"
        },
        {
          "target": [
            "B"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "乘",
      "code": "[x?]=h",
      "steps": [
        {
          "target": [
            "x",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "昌",
      "code": "[ww]=r",
      "steps": [
        {
          "target": [
            "w",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "姐",
      "code": "[Zq]-q",
      "steps": [
        {
          "target": [
            "Z",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "顾",
      "code": "[yY]-?",
      "steps": [
        {
          "target": [
            "y",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "?"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "聚",
      "code": "[Fv]=n",
      "steps": [
        {
          "target": [
            "F",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "似",
      "code": "[ah]-r",
      "steps": [
        {
          "target": [
            "a",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "冠",
      "code": "[CE]=z",
      "steps": [
        {
          "target": [
            "C",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "坚",
      "code": "[Wv]=V",
      "steps": [
        {
          "target": [
            "W",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "V"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "旗",
      "code": "[<K]-d",
      "steps": [
        {
          "target": [
            "<",
            "K"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "犯",
      "code": "[KY]-j",
      "steps": [
        {
          "target": [
            "K",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "巨",
      "code": "[WW]=j",
      "steps": [
        {
          "target": [
            "W",
            "W"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "征",
      "code": "[gf]-I",
      "steps": [
        {
          "target": [
            "g",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "甘",
      "code": "[og]",
      "steps": [
        {
          "target": [
            "o",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "饮",
      "code": "[f:]-q",
      "steps": [
        {
          "target": [
            "f",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "潮",
      "code": "[nA]-H",
      "steps": [
        {
          "target": [
            "n",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "H"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "宏",
      "code": "[je]=B",
      "steps": [
        {
          "target": [
            "j",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "B"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "骗",
      "code": "[/Q]-F",
      "steps": [
        {
          "target": [
            "/",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "F"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "肥",
      "code": "[HT]-b",
      "steps": [
        {
          "target": [
            "H",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "津",
      "code": "[nl]-v",
      "steps": [
        {
          "target": [
            "n",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            "v"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "豪",
      "code": "[sQ]=s",
      "steps": [
        {
          "target": [
            "s",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "曹",
      "code": "[fF]=w",
      "steps": [
        {
          "target": [
            "f",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "童",
      "code": "[CP]=l",
      "steps": [
        {
          "target": [
            "C",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "佐",
      "code": "[ae]-S",
      "steps": [
        {
          "target": [
            "a",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "泉",
      "code": "[dn]=s",
      "steps": [
        {
          "target": [
            "d",
            "n"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "乔",
      "code": "[tT]=W",
      "steps": [
        {
          "target": [
            "t",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "胃",
      "code": "[DH]=y",
      "steps": [
        {
          "target": [
            "D",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "仪",
      "code": "[aO]-l",
      "steps": [
        {
          "target": [
            "a",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "勇",
      "code": "[Bq]=<",
      "steps": [
        {
          "target": [
            "B",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "<"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "酷",
      "code": "[Um]-b",
      "steps": [
        {
          "target": [
            "U",
            "m"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "魏",
      "code": "[xZ]-G",
      "steps": [
        {
          "target": [
            "x",
            "Z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "吨",
      "code": "[bf]-Y",
      "steps": [
        {
          "target": [
            "b",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "攻",
      "code": "[Sa]-p",
      "steps": [
        {
          "target": [
            "S",
            "a"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "怎",
      "code": "[H:]=x",
      "steps": [
        {
          "target": [
            "H",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "肌",
      "code": "[Hq]-j",
      "steps": [
        {
          "target": [
            "H",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "凭",
      "code": "[aN]=q",
      "steps": [
        {
          "target": [
            "a",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "胖",
      "code": "[HX]-i",
      "steps": [
        {
          "target": [
            "H",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "屏",
      "code": "[yX]=p",
      "steps": [
        {
          "target": [
            "y",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "镜",
      "code": "[zS]-J",
      "steps": [
        {
          "target": [
            "z",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "暖",
      "code": "[w:]-v",
      "steps": [
        {
          "target": [
            "w",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "v"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "贾",
      "code": "[tG]=b",
      "steps": [
        {
          "target": [
            "t",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "洞",
      "code": "[nF]-t",
      "steps": [
        {
          "target": [
            "n",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "涂",
      "code": "[nr]-x",
      "steps": [
        {
          "target": [
            "n",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "爽",
      "code": "[Tl]=l",
      "steps": [
        {
          "target": [
            "T",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "阴",
      "code": "[YH]-y",
      "steps": [
        {
          "target": [
            "Y",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "赶",
      "code": "[d?]-g",
      "steps": [
        {
          "target": [
            "d",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "奈",
      "code": "[TN]=s",
      "steps": [
        {
          "target": [
            "T",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "竹",
      "code": "[cu]",
      "steps": [
        {
          "target": [
            "c",
            "u"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "辛",
      "code": "[<x]",
      "steps": [
        {
          "target": [
            "<",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "疼",
      "code": "[l/]=S",
      "steps": [
        {
          "target": [
            "l",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "蔡",
      "code": "[pI]=j",
      "steps": [
        {
          "target": [
            "p",
            "I"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "否",
      "code": "[cb]=k",
      "steps": [
        {
          "target": [
            "c",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "俊",
      "code": "[aB]-/",
      "steps": [
        {
          "target": [
            "a",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "/"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "朋",
      "code": "[HH]-y",
      "steps": [
        {
          "target": [
            "H",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "箱",
      "code": "[co]=T",
      "steps": [
        {
          "target": [
            "c",
            "o"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "抽",
      "code": "[iB]-y",
      "steps": [
        {
          "target": [
            "i",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "择",
      "code": "[iv]-i",
      "steps": [
        {
          "target": [
            "i",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "腻",
      "code": "[HU]-G",
      "steps": [
        {
          "target": [
            "H",
            "U"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "吕",
      "code": "[bb]=k",
      "steps": [
        {
          "target": [
            "b",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "律",
      "code": "[gl]-v",
      "steps": [
        {
          "target": [
            "g",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            "v"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "操",
      "code": "[ib]-o",
      "steps": [
        {
          "target": [
            "i",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "斗",
      "code": "[Dd]",
      "steps": [
        {
          "target": [
            "D",
            "d"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "恒",
      "code": "[:f]-f",
      "steps": [
        {
          "target": [
            ":",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "酥",
      "code": "[Ux]-h",
      "steps": [
        {
          "target": [
            "U",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "邦",
      "code": "[>Y]-j",
      "steps": [
        {
          "target": [
            ">",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "豆",
      "code": "[>d]",
      "steps": [
        {
          "target": [
            ">",
            "d"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "湿",
      "code": "[nw]-/",
      "steps": [
        {
          "target": [
            "n",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "/"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "仔",
      "code": "[aF]-i",
      "steps": [
        {
          "target": [
            "a",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "忠",
      "code": "[bc]=:",
      "steps": [
        {
          "target": [
            "b",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "钢",
      "code": "[zF]-l",
      "steps": [
        {
          "target": [
            "z",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "隔",
      "code": "[Y>]-g",
      "steps": [
        {
          "target": [
            "Y",
            ">"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "扣",
      "code": "[ib]-k",
      "steps": [
        {
          "target": [
            "i",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "锁",
      "code": "[zE]-G",
      "steps": [
        {
          "target": [
            "z",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "莉",
      "code": "[px]=W",
      "steps": [
        {
          "target": [
            "p",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "害",
      "code": "[j>]=b",
      "steps": [
        {
          "target": [
            "j",
            ">"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "档",
      "code": "[oE]-C",
      "steps": [
        {
          "target": [
            "o",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "C"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "窗",
      "code": "[It]=/",
      "steps": [
        {
          "target": [
            "I",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "/"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "欲",
      "code": "[L:]-q",
      "steps": [
        {
          "target": [
            "L",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "潘",
      "code": "[nt]-D",
      "steps": [
        {
          "target": [
            "n",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "D"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "摩",
      "code": "[hi]=o",
      "steps": [
        {
          "target": [
            "h",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "袋",
      "code": "[aU]=?",
      "steps": [
        {
          "target": [
            "a",
            "U"
          ],
          "hand": "both"
        },
        {
          "target": [
            "?"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "针",
      "code": "[ze]-s",
      "steps": [
        {
          "target": [
            "z",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "庭",
      "code": "[JN]=g",
      "steps": [
        {
          "target": [
            "J",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "枪",
      "code": "[or]-Y",
      "steps": [
        {
          "target": [
            "o",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "担",
      "code": "[iw]-f",
      "steps": [
        {
          "target": [
            "i",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "肯",
      "code": "[IH]=y",
      "steps": [
        {
          "target": [
            "I",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "紫",
      "code": "[Ih]=R",
      "steps": [
        {
          "target": [
            "I",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "R"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "撞",
      "code": "[iC]-P",
      "steps": [
        {
          "target": [
            "i",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "P"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "咬",
      "code": "[bZ]-h",
      "steps": [
        {
          "target": [
            "b",
            "Z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "席",
      "code": "[JR]=Q",
      "steps": [
        {
          "target": [
            "J",
            "R"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Q"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "劳",
      "code": "[Kl]",
      "steps": [
        {
          "target": [
            "K",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "舰",
      "code": "[We]-j",
      "steps": [
        {
          "target": [
            "W",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "戈",
      "code": "[Ug]",
      "steps": [
        {
          "target": [
            "U",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "婚",
      "code": "[ZZ]-w",
      "steps": [
        {
          "target": [
            "Z",
            "Z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "炎",
      "code": "[My]",
      "steps": [
        {
          "target": [
            "M",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "鸭",
      "code": "[OX]-n",
      "steps": [
        {
          "target": [
            "O",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "擦",
      "code": "[ij]-I",
      "steps": [
        {
          "target": [
            "i",
            "j"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "误",
      "code": "[ub]-T",
      "steps": [
        {
          "target": [
            "u",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "町",
      "code": "[DG]-d",
      "steps": [
        {
          "target": [
            "D",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "激",
      "code": "[nd]-a",
      "steps": [
        {
          "target": [
            "n",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "慧",
      "code": "[>>]=:",
      "steps": [
        {
          "target": [
            ">",
            ">"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "彭",
      "code": "[JI]-s",
      "steps": [
        {
          "target": [
            "J",
            "I"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "肝",
      "code": "[H?]-g",
      "steps": [
        {
          "target": [
            "H",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "距",
      "code": "[sW]-W",
      "steps": [
        {
          "target": [
            "s",
            "W"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "撑",
      "code": "[iM]-i",
      "steps": [
        {
          "target": [
            "i",
            "M"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "肾",
      "code": "[Wv]=H",
      "steps": [
        {
          "target": [
            "W",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "H"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "燕",
      "code": "[Rb]=;",
      "steps": [
        {
          "target": [
            "R",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            ";"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "添",
      "code": "[nf]-:",
      "steps": [
        {
          "target": [
            "n",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "射",
      "code": "[Iz]-c",
      "steps": [
        {
          "target": [
            "I",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "柱",
      "code": "[oO]-,",
      "steps": [
        {
          "target": [
            "o",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            ","
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "喊",
      "code": "[b;]-b",
      "steps": [
        {
          "target": [
            "b",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "鹏",
      "code": "[HH]-X",
      "steps": [
        {
          "target": [
            "H",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "X"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "挖",
      "code": "[iI]-j",
      "steps": [
        {
          "target": [
            "i",
            "I"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "穆",
      "code": "[xd]-I",
      "steps": [
        {
          "target": [
            "x",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "汗",
      "code": "[n?]-g",
      "steps": [
        {
          "target": [
            "n",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "诚",
      "code": "[u;]-A",
      "steps": [
        {
          "target": [
            "u",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "A"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "浪",
      "code": "[nO]-;",
      "steps": [
        {
          "target": [
            "n",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            ";"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "挤",
      "code": "[ic]-q",
      "steps": [
        {
          "target": [
            "i",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "侯",
      "code": "[aW]-D",
      "steps": [
        {
          "target": [
            "a",
            "W"
          ],
          "hand": "both"
        },
        {
          "target": [
            "D"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "胸",
      "code": "[H.]-F",
      "steps": [
        {
          "target": [
            "H",
            "."
          ],
          "hand": "both"
        },
        {
          "target": [
            "F"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "刻",
      "code": "[LW]-d",
      "steps": [
        {
          "target": [
            "L",
            "W"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "耳",
      "code": "[Fe]",
      "steps": [
        {
          "target": [
            "F",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "枚",
      "code": "[oa]-p",
      "steps": [
        {
          "target": [
            "o",
            "a"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "竞",
      "code": "[Cb]=J",
      "steps": [
        {
          "target": [
            "C",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "撒",
      "code": "[iR]-a",
      "steps": [
        {
          "target": [
            "i",
            "R"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "串",
      "code": "[bb]=c",
      "steps": [
        {
          "target": [
            "b",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "默",
      "code": "[eK]-q",
      "steps": [
        {
          "target": [
            "e",
            "K"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "醒",
      "code": "[Uw]-G",
      "steps": [
        {
          "target": [
            "U",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "逼",
      "code": "[fb]-p",
      "steps": [
        {
          "target": [
            "f",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "俄",
      "code": "[at]-U",
      "steps": [
        {
          "target": [
            "a",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "U"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "搬",
      "code": "[iW]-T",
      "steps": [
        {
          "target": [
            "i",
            "W"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "织",
      "code": "[Rb]-X",
      "steps": [
        {
          "target": [
            "R",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "X"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "遍",
      "code": "[QF]-p",
      "steps": [
        {
          "target": [
            "Q",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "邓",
      "code": "[vY]-j",
      "steps": [
        {
          "target": [
            "v",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "凡",
      "code": "[qO]=d",
      "steps": [
        {
          "target": [
            "q",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "执",
      "code": "[rz]",
      "steps": [
        {
          "target": [
            "r",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "舒",
      "code": "[rg]->",
      "steps": [
        {
          "target": [
            "r",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            ">"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "稍",
      "code": "[xE]-H",
      "steps": [
        {
          "target": [
            "x",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "H"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "仙",
      "code": "[a<]-s",
      "steps": [
        {
          "target": [
            "a",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "浩",
      "code": "[nm]-b",
      "steps": [
        {
          "target": [
            "n",
            "m"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "暗",
      "code": "[wS]-y",
      "steps": [
        {
          "target": [
            "w",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "详",
      "code": "[uQ]-y",
      "steps": [
        {
          "target": [
            "u",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "柳",
      "code": "[o:]-m",
      "steps": [
        {
          "target": [
            "o",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "煎",
      "code": "[XH]=;",
      "steps": [
        {
          "target": [
            "X",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            ";"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "碎",
      "code": "[.Z]-e",
      "steps": [
        {
          "target": [
            ".",
            "Z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "穷",
      "code": "[I<]=l",
      "steps": [
        {
          "target": [
            "I",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "腰",
      "code": "[Ht]-Z",
      "steps": [
        {
          "target": [
            "H",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Z"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "颜",
      "code": "[Cy]-?",
      "steps": [
        {
          "target": [
            "C",
            "y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "?"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "插",
      "code": "[ik]-?",
      "steps": [
        {
          "target": [
            "i",
            "k"
          ],
          "hand": "both"
        },
        {
          "target": [
            "?"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "炖",
      "code": "[;f]-Y",
      "steps": [
        {
          "target": [
            ";",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "促",
      "code": "[as]-u",
      "steps": [
        {
          "target": [
            "a",
            "s"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "珠",
      "code": "[,t]-z",
      "steps": [
        {
          "target": [
            ",",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "填",
      "code": "[Ve]-X",
      "steps": [
        {
          "target": [
            "V",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "X"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "悦",
      "code": "[:X]-J",
      "steps": [
        {
          "target": [
            ":",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "烟",
      "code": "[;U]-T",
      "steps": [
        {
          "target": [
            ";",
            "U"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "舍",
      "code": "[rg]=s",
      "steps": [
        {
          "target": [
            "r",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "沟",
      "code": "[n.]-B",
      "steps": [
        {
          "target": [
            "n",
            "."
          ],
          "hand": "both"
        },
        {
          "target": [
            "B"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "训",
      "code": "[uY]-c",
      "steps": [
        {
          "target": [
            "u",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "寻",
      "code": "[Cz]=c",
      "steps": [
        {
          "target": [
            "C",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "迎",
      "code": "[WY]-p",
      "steps": [
        {
          "target": [
            "W",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "灰",
      "code": "[e;]=h",
      "steps": [
        {
          "target": [
            "e",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "幕",
      "code": "[PT]=Q",
      "steps": [
        {
          "target": [
            "P",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Q"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "竟",
      "code": "[SJ]=e",
      "steps": [
        {
          "target": [
            "S",
            "J"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "铺",
      "code": "[zL]-f",
      "steps": [
        {
          "target": [
            "z",
            "L"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "皇",
      "code": "[d,]=w",
      "steps": [
        {
          "target": [
            "d",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "绍",
      "code": "[Ru]-b",
      "steps": [
        {
          "target": [
            "R",
            "u"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "芳",
      "code": "[p<]=f",
      "steps": [
        {
          "target": [
            "p",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "丑",
      "code": "[AV]=t",
      "steps": [
        {
          "target": [
            "A",
            "V"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "袁",
      "code": "[Vb]=?",
      "steps": [
        {
          "target": [
            "V",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "?"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "菌",
      "code": "[pU]=x",
      "steps": [
        {
          "target": [
            "p",
            "U"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "扬",
      "code": "[iA]-I",
      "steps": [
        {
          "target": [
            "i",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "察",
      "code": "[jI]=j",
      "steps": [
        {
          "target": [
            "j",
            "I"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "疾",
      "code": "[lD]=s",
      "steps": [
        {
          "target": [
            "l",
            "D"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "轴",
      "code": "[MB]-y",
      "steps": [
        {
          "target": [
            "M",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "欣",
      "code": "[/:]-q",
      "steps": [
        {
          "target": [
            "/",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "祖",
      "code": "[Nq]-q",
      "steps": [
        {
          "target": [
            "N",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "频",
      "code": "[II]-?",
      "steps": [
        {
          "target": [
            "I",
            "I"
          ],
          "hand": "both"
        },
        {
          "target": [
            "?"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "凤",
      "code": "[qv]=y",
      "steps": [
        {
          "target": [
            "q",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "刺",
      "code": "[oF]-W",
      "steps": [
        {
          "target": [
            "o",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "虚",
      "code": "[O/]=y",
      "steps": [
        {
          "target": [
            "O",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "潜",
      "code": "[nd]-w",
      "steps": [
        {
          "target": [
            "n",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "脏",
      "code": "[HJ]-V",
      "steps": [
        {
          "target": [
            "H",
            "J"
          ],
          "hand": "both"
        },
        {
          "target": [
            "V"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "毕",
      "code": "[hh]=e",
      "steps": [
        {
          "target": [
            "h",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "恋",
      "code": "[G:]=x",
      "steps": [
        {
          "target": [
            "G",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "偶",
      "code": "[aD]-B",
      "steps": [
        {
          "target": [
            "a",
            "D"
          ],
          "hand": "both"
        },
        {
          "target": [
            "B"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "柏",
      "code": "[od]-b",
      "steps": [
        {
          "target": [
            "o",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "仲",
      "code": "[ab]-c",
      "steps": [
        {
          "target": [
            "a",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "替",
      "code": "[dd]=w",
      "steps": [
        {
          "target": [
            "d",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "饿",
      "code": "[ft]-U",
      "steps": [
        {
          "target": [
            "f",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "U"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "翼",
      "code": "[KD]=X",
      "steps": [
        {
          "target": [
            "K",
            "D"
          ],
          "hand": "both"
        },
        {
          "target": [
            "X"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "葱",
      "code": "[p.]=:",
      "steps": [
        {
          "target": [
            "p",
            "."
          ],
          "hand": "both"
        },
        {
          "target": [
            ":"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "震",
      "code": "[k<]=c",
      "steps": [
        {
          "target": [
            "k",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "丢",
      "code": "[NB]=s",
      "steps": [
        {
          "target": [
            "N",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "摸",
      "code": "[iP]-T",
      "steps": [
        {
          "target": [
            "i",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "乃",
      "code": "[Tn]",
      "steps": [
        {
          "target": [
            "T",
            "n"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "焦",
      "code": "[,;]=h",
      "steps": [
        {
          "target": [
            ",",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "猜",
      "code": "[K>]-H",
      "steps": [
        {
          "target": [
            "K",
            ">"
          ],
          "hand": "both"
        },
        {
          "target": [
            "H"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "桑",
      "code": "[vm]=o",
      "steps": [
        {
          "target": [
            "v",
            "m"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "拖",
      "code": "[iK]-z",
      "steps": [
        {
          "target": [
            "i",
            "K"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "振",
      "code": "[i<]-c",
      "steps": [
        {
          "target": [
            "i",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "郎",
      "code": "[O;]-Y",
      "steps": [
        {
          "target": [
            "O",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "洁",
      "code": "[nJ]-j",
      "steps": [
        {
          "target": [
            "n",
            "J"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "储",
      "code": "[au]-q",
      "steps": [
        {
          "target": [
            "a",
            "u"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "泥",
      "code": "[ny]-h",
      "steps": [
        {
          "target": [
            "n",
            "y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "休",
      "code": "[ao]-m",
      "steps": [
        {
          "target": [
            "a",
            "o"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "盒",
      "code": "[k;]=m",
      "steps": [
        {
          "target": [
            "k",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "贤",
      "code": "[Wv]=G",
      "steps": [
        {
          "target": [
            "W",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "岭",
      "code": "[<k]-O",
      "steps": [
        {
          "target": [
            "<",
            "k"
          ],
          "hand": "both"
        },
        {
          "target": [
            "O"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "澳",
      "code": "[nq]-T",
      "steps": [
        {
          "target": [
            "n",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "楚",
      "code": "[mC]=s",
      "steps": [
        {
          "target": [
            "m",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "蒋",
      "code": "[p?]=z",
      "steps": [
        {
          "target": [
            "p",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "夹",
      "code": "[dX]=b",
      "steps": [
        {
          "target": [
            "d",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "粗",
      "code": "[rq]-q",
      "steps": [
        {
          "target": [
            "r",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "努",
      "code": "[Zv]=<",
      "steps": [
        {
          "target": [
            "Z",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "<"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "横",
      "code": "[oR]-h",
      "steps": [
        {
          "target": [
            "o",
            "R"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "午",
      "code": "[Ke]=s",
      "steps": [
        {
          "target": [
            "K",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "暴",
      "code": "[wR]=n",
      "steps": [
        {
          "target": [
            "w",
            "R"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "碳",
      "code": "[.<]-;",
      "steps": [
        {
          "target": [
            ".",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            ";"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "诉",
      "code": "[u/]-O",
      "steps": [
        {
          "target": [
            "u",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "O"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "判",
      "code": "[Xi]-W",
      "steps": [
        {
          "target": [
            "X",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "纹",
      "code": "[Rv]-w",
      "steps": [
        {
          "target": [
            "R",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "拥",
      "code": "[iq]-y",
      "steps": [
        {
          "target": [
            "i",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "碰",
      "code": "[.X]-/",
      "steps": [
        {
          "target": [
            ".",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "/"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "闹",
      "code": "[IZ]=Q",
      "steps": [
        {
          "target": [
            "I",
            "Z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Q"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "琴",
      "code": "[,,]=k",
      "steps": [
        {
          "target": [
            ",",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "k"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "琳",
      "code": "[,m]-l",
      "steps": [
        {
          "target": [
            ",",
            "m"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "黎",
      "code": "[xu]=n",
      "steps": [
        {
          "target": [
            "x",
            "u"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "析",
      "code": "[o/]-j",
      "steps": [
        {
          "target": [
            "o",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "败",
      "code": "[Ga]-p",
      "steps": [
        {
          "target": [
            "G",
            "a"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "偷",
      "code": "[ak]-W",
      "steps": [
        {
          "target": [
            "a",
            "k"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "赏",
      "code": "[MG]=b",
      "steps": [
        {
          "target": [
            "M",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "伴",
      "code": "[aX]-i",
      "steps": [
        {
          "target": [
            "a",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "崔",
      "code": "[<,]=i",
      "steps": [
        {
          "target": [
            "<",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "恶",
      "code": "[f/]=:",
      "steps": [
        {
          "target": [
            "f",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "晋",
      "code": "[f/]=w",
      "steps": [
        {
          "target": [
            "f",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "绕",
      "code": "[RU]-J",
      "steps": [
        {
          "target": [
            "R",
            "U"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "浅",
      "code": "[nf]-U",
      "steps": [
        {
          "target": [
            "n",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "U"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "耐",
      "code": "[Bz]-c",
      "steps": [
        {
          "target": [
            "B",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "私",
      "code": "[xB]-s",
      "steps": [
        {
          "target": [
            "x",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "困",
      "code": "[Uo]=m",
      "steps": [
        {
          "target": [
            "U",
            "o"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "烫",
      "code": "[nA]=;",
      "steps": [
        {
          "target": [
            "n",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            ";"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "肖",
      "code": "[EH]=y",
      "steps": [
        {
          "target": [
            "E",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "乙",
      "code": "[ji]",
      "steps": [
        {
          "target": [
            "j",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "幸",
      "code": "[VQ]=y",
      "steps": [
        {
          "target": [
            "V",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "膜",
      "code": "[HP]-T",
      "steps": [
        {
          "target": [
            "H",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "盆",
      "code": "[a;]=m",
      "steps": [
        {
          "target": [
            "a",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "驾",
      "code": "[<b]=/",
      "steps": [
        {
          "target": [
            "<",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "/"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "邀",
      "code": "[d<]-p",
      "steps": [
        {
          "target": [
            "d",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "探",
      "code": "[iC]-o",
      "steps": [
        {
          "target": [
            "i",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "固",
      "code": "[U/]=g",
      "steps": [
        {
          "target": [
            "U",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "锦",
      "code": "[zd]-Q",
      "steps": [
        {
          "target": [
            "z",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "署",
      "code": "[Oq]=z",
      "steps": [
        {
          "target": [
            "O",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "轨",
      "code": "[MA]-j",
      "steps": [
        {
          "target": [
            "M",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "寒",
      "code": "[jh]=S",
      "steps": [
        {
          "target": [
            "j",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "庙",
      "code": "[JB]=y",
      "steps": [
        {
          "target": [
            "J",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "瓜",
      "code": "[<g]",
      "steps": [
        {
          "target": [
            "<",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "媒",
      "code": "[Zo]-o",
      "steps": [
        {
          "target": [
            "Z",
            "o"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "涉",
      "code": "[nI]-I",
      "steps": [
        {
          "target": [
            "n",
            "I"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "杂",
      "code": "[Ao]=m",
      "steps": [
        {
          "target": [
            "A",
            "o"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "孝",
      "code": "[qF]=i",
      "steps": [
        {
          "target": [
            "q",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "丸",
      "code": "[AO]=d",
      "steps": [
        {
          "target": [
            "A",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "铜",
      "code": "[zF]-t",
      "steps": [
        {
          "target": [
            "z",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "诸",
      "code": "[uq]-z",
      "steps": [
        {
          "target": [
            "u",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "拆",
      "code": "[i/]-O",
      "steps": [
        {
          "target": [
            "i",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "O"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "晨",
      "code": "[w<]=c",
      "steps": [
        {
          "target": [
            "w",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "陶",
      "code": "[Y.]-E",
      "steps": [
        {
          "target": [
            "Y",
            "."
          ],
          "hand": "both"
        },
        {
          "target": [
            "E"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "授",
      "code": "[iA]-v",
      "steps": [
        {
          "target": [
            "i",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "v"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "疗",
      "code": "[ls]=l",
      "steps": [
        {
          "target": [
            "l",
            "s"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "岗",
      "code": "[<F]=l",
      "steps": [
        {
          "target": [
            "<",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "l"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "嫁",
      "code": "[Zj]-Q",
      "steps": [
        {
          "target": [
            "Z",
            "j"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "序",
      "code": "[J>]=v",
      "steps": [
        {
          "target": [
            "J",
            ">"
          ],
          "hand": "both"
        },
        {
          "target": [
            "v"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "肺",
      "code": "[Hf]-Q",
      "steps": [
        {
          "target": [
            "H",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "剩",
      "code": "[x?]-W",
      "steps": [
        {
          "target": [
            "x",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "革",
      "code": "[Ag]",
      "steps": [
        {
          "target": [
            "A",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "吵",
      "code": "[bE]-t",
      "steps": [
        {
          "target": [
            "b",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "祥",
      "code": "[NQ]-y",
      "steps": [
        {
          "target": [
            "N",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "译",
      "code": "[uv]-i",
      "steps": [
        {
          "target": [
            "u",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "染",
      "code": "[nA]=o",
      "steps": [
        {
          "target": [
            "n",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "缘",
      "code": "[RC]-Q",
      "steps": [
        {
          "target": [
            "R",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "脂",
      "code": "[Hh]-w",
      "steps": [
        {
          "target": [
            "H",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "胎",
      "code": "[HB]-b",
      "steps": [
        {
          "target": [
            "H",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "珍",
      "code": "[,r]-I",
      "steps": [
        {
          "target": [
            ",",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "拌",
      "code": "[iX]-i",
      "steps": [
        {
          "target": [
            "i",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "浦",
      "code": "[nL]-f",
      "steps": [
        {
          "target": [
            "n",
            "L"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "虫",
      "code": "[Bc]",
      "steps": [
        {
          "target": [
            "B",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "旁",
      "code": "[h<]=f",
      "steps": [
        {
          "target": [
            "h",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "乎",
      "code": "[tX]=e",
      "steps": [
        {
          "target": [
            "t",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "剪",
      "code": "[XH]=u",
      "steps": [
        {
          "target": [
            "X",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "char": "避",
      "code": "[Wp]-c",
      "steps": [
        {
          "target": [
            "W",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "char": "册",
      "code": "[Fc]",
      "steps": [
        {
          "target": [
            "F",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "char": "芬",
      "code": "[pa]=f",
      "steps": [
        {
          "target": [
            "p",
            "a"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f"
          ],
          "hand": "right"
        }
      ]
    }
  ]
];

// 常用词组（1500 个，分 3 段）
const KM_WORDS = [
  [
    {
      "text": "可以",
      "code": "_x",
      "steps": [
        {
          "target": [
            "x"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "一个",
      "code": "_f",
      "steps": [
        {
          "target": [
            "f"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "自己",
      "code": "_g",
      "steps": [
        {
          "target": [
            "g"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "没有",
      "code": "_n",
      "steps": [
        {
          "target": [
            "n"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "我们",
      "code": "_t",
      "steps": [
        {
          "target": [
            "t"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "这个",
      "code": "_v",
      "steps": [
        {
          "target": [
            "v"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "问题",
      "code": "_I",
      "steps": [
        {
          "target": [
            "I"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "中国",
      "code": "_b",
      "steps": [
        {
          "target": [
            "b"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "不错",
      "code": "_c",
      "steps": [
        {
          "target": [
            "c"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "什么",
      "code": "_a",
      "steps": [
        {
          "target": [
            "a"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "进行",
      "code": "_h",
      "steps": [
        {
          "target": [
            "h"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "还是",
      "code": "+c",
      "steps": [
        {
          "target": [
            "c"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "使用",
      "code": "+a",
      "steps": [
        {
          "target": [
            "a"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "数据",
      "code": "_r",
      "steps": [
        {
          "target": [
            "r"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "需要",
      "code": "_k",
      "steps": [
        {
          "target": [
            "k"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "公司",
      "code": "_X",
      "steps": [
        {
          "target": [
            "X"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "学习",
      "code": "_M",
      "steps": [
        {
          "target": [
            "M"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "但是",
      "code": "aw",
      "steps": [
        {
          "target": [
            "a",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "都是",
      "code": "_q",
      "steps": [
        {
          "target": [
            "q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "如果",
      "code": "_Z",
      "steps": [
        {
          "target": [
            "Z"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "如何",
      "code": "+Z",
      "steps": [
        {
          "target": [
            "Z"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "时间",
      "code": "_w",
      "steps": [
        {
          "target": [
            "w"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "喜欢",
      "code": "_J",
      "steps": [
        {
          "target": [
            "J"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "因为",
      "code": "_U",
      "steps": [
        {
          "target": [
            "U"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "技术",
      "code": "_i",
      "steps": [
        {
          "target": [
            "i"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "时候",
      "code": "+w",
      "steps": [
        {
          "target": [
            "w"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "年月",
      "code": "_K",
      "steps": [
        {
          "target": [
            "K"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "他们",
      "code": "az",
      "steps": [
        {
          "target": [
            "a",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "很多",
      "code": "+g",
      "steps": [
        {
          "target": [
            "g"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "一些",
      "code": "+f",
      "steps": [
        {
          "target": [
            "f"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "比较",
      "code": "+h",
      "steps": [
        {
          "target": [
            "h"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "感觉",
      "code": "_;",
      "steps": [
        {
          "target": [
            ";"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "不是",
      "code": "cb",
      "steps": [
        {
          "target": [
            "c",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "通过",
      "code": "_B",
      "steps": [
        {
          "target": [
            "B"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "选择",
      "code": "_m",
      "steps": [
        {
          "target": [
            "m"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "现在",
      "code": "_,",
      "steps": [
        {
          "target": [
            ","
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "非常",
      "code": "+t",
      "steps": [
        {
          "target": [
            "t"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "所以",
      "code": "_Q",
      "steps": [
        {
          "target": [
            "Q"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "也是",
      "code": "_z",
      "steps": [
        {
          "target": [
            "z"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "模型",
      "code": "_o",
      "steps": [
        {
          "target": [
            "o"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "用户",
      "code": "+q",
      "steps": [
        {
          "target": [
            "q"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "工作",
      "code": "_S",
      "steps": [
        {
          "target": [
            "S"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "服务",
      "code": "_H",
      "steps": [
        {
          "target": [
            "H"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "可能",
      "code": "+x",
      "steps": [
        {
          "target": [
            "x"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "觉得",
      "code": "+M",
      "steps": [
        {
          "target": [
            "M"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "以下",
      "code": "hr",
      "steps": [
        {
          "target": [
            "h",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "推荐",
      "code": "+i",
      "steps": [
        {
          "target": [
            "i"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "发展",
      "code": "_Y",
      "steps": [
        {
          "target": [
            "Y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "其他",
      "code": "_d",
      "steps": [
        {
          "target": [
            "d"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "已经",
      "code": "_P",
      "steps": [
        {
          "target": [
            "P"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "味道",
      "code": "+b",
      "steps": [
        {
          "target": [
            "b"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "开始",
      "code": "fp",
      "steps": [
        {
          "target": [
            "f",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "孩子",
      "code": "_F",
      "steps": [
        {
          "target": [
            "F"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "知道",
      "code": "_D",
      "steps": [
        {
          "target": [
            "D"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "分析",
      "code": "af",
      "steps": [
        {
          "target": [
            "a",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "市场",
      "code": "ZQ",
      "steps": [
        {
          "target": [
            "Z",
            "Q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "美国",
      "code": "+Q",
      "steps": [
        {
          "target": [
            "Q"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "应该",
      "code": "+J",
      "steps": [
        {
          "target": [
            "J"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "价格",
      "code": "ar",
      "steps": [
        {
          "target": [
            "a",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "这些",
      "code": "vp",
      "steps": [
        {
          "target": [
            "v",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "还有",
      "code": "cp",
      "steps": [
        {
          "target": [
            "c",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "包括",
      "code": "_.",
      "steps": [
        {
          "target": [
            "."
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "这样",
      "code": "+v",
      "steps": [
        {
          "target": [
            "v"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "产品",
      "code": "_C",
      "steps": [
        {
          "target": [
            "C"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "系统",
      "code": "tR",
      "steps": [
        {
          "target": [
            "t",
            "R"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "大家",
      "code": "_T",
      "steps": [
        {
          "target": [
            "T"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "提供",
      "code": "iw",
      "steps": [
        {
          "target": [
            "i",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "一般",
      "code": "fi",
      "steps": [
        {
          "target": [
            "f",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "不过",
      "code": "cbzp",
      "steps": [
        {
          "target": [
            "c",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "内容",
      "code": "+B",
      "steps": [
        {
          "target": [
            "B"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "游戏",
      "code": "+n",
      "steps": [
        {
          "target": [
            "n"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "信息",
      "code": "au",
      "steps": [
        {
          "target": [
            "a",
            "u"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "提高",
      "code": "iwsg",
      "steps": [
        {
          "target": [
            "i",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "投资",
      "code": "iT",
      "steps": [
        {
          "target": [
            "i",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "一下",
      "code": "fifx",
      "steps": [
        {
          "target": [
            "f",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "环境",
      "code": "+,",
      "steps": [
        {
          "target": [
            ","
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "方法",
      "code": "_<",
      "steps": [
        {
          "target": [
            "<"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "朋友",
      "code": "HH",
      "steps": [
        {
          "target": [
            "H",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "生活",
      "code": "_G",
      "steps": [
        {
          "target": [
            "G"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "语言",
      "code": "_u",
      "steps": [
        {
          "target": [
            "u"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "就是",
      "code": "_s",
      "steps": [
        {
          "target": [
            "s"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "怎么",
      "code": "+H",
      "steps": [
        {
          "target": [
            "H"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "情况",
      "code": "_:",
      "steps": [
        {
          "target": [
            ":"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "影响",
      "code": "ws",
      "steps": [
        {
          "target": [
            "w",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "企业",
      "code": "rI",
      "steps": [
        {
          "target": [
            "r",
            "I"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "网络",
      "code": "+F",
      "steps": [
        {
          "target": [
            "F"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "根据",
      "code": "+o",
      "steps": [
        {
          "target": [
            "o"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "作为",
      "code": "aH",
      "steps": [
        {
          "target": [
            "a",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "东西",
      "code": "tE",
      "steps": [
        {
          "target": [
            "t",
            "E"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "真的",
      "code": "_e",
      "steps": [
        {
          "target": [
            "e"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "设计",
      "code": "+u",
      "steps": [
        {
          "target": [
            "u"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "发现",
      "code": "+Y",
      "steps": [
        {
          "target": [
            "Y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "电影",
      "code": "+U",
      "steps": [
        {
          "target": [
            "U"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "这种",
      "code": "vpxb",
      "steps": [
        {
          "target": [
            "v",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "建议",
      "code": "_l",
      "steps": [
        {
          "target": [
            "l"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "不同",
      "code": "cbFt",
      "steps": [
        {
          "target": [
            "c",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "F",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "个人",
      "code": "+r",
      "steps": [
        {
          "target": [
            "r"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "或者",
      "code": "Ub",
      "steps": [
        {
          "target": [
            "U",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "为什么",
      "code": "_O",
      "steps": [
        {
          "target": [
            "O"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "帮助",
      "code": "_>",
      "steps": [
        {
          "target": [
            ">"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "质量",
      "code": "_y",
      "steps": [
        {
          "target": [
            "y"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "而且",
      "code": "Be",
      "steps": [
        {
          "target": [
            "B",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "那么",
      "code": "_A",
      "steps": [
        {
          "target": [
            "A"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "处理",
      "code": "_/",
      "steps": [
        {
          "target": [
            "/"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "关注",
      "code": "_R",
      "steps": [
        {
          "target": [
            "R"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "方式",
      "code": "+<",
      "steps": [
        {
          "target": [
            "<"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "活动",
      "code": "ng",
      "steps": [
        {
          "target": [
            "n",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "对于",
      "code": "vz",
      "steps": [
        {
          "target": [
            "v",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "管理",
      "code": "cj",
      "steps": [
        {
          "target": [
            "c",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "主要",
      "code": "+O",
      "steps": [
        {
          "target": [
            "O"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "看到",
      "code": "iT.W",
      "steps": [
        {
          "target": [
            "i",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            ".",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "能力",
      "code": "BH",
      "steps": [
        {
          "target": [
            "B",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "教育",
      "code": "qF",
      "steps": [
        {
          "target": [
            "q",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "了解",
      "code": "+s",
      "steps": [
        {
          "target": [
            "s"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "文化",
      "code": "vw",
      "steps": [
        {
          "target": [
            "v",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "世界",
      "code": "+R",
      "steps": [
        {
          "target": [
            "R"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "其实",
      "code": "+d",
      "steps": [
        {
          "target": [
            "d"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "这里",
      "code": "vpPl",
      "steps": [
        {
          "target": [
            "v",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "P",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "健康",
      "code": "al",
      "steps": [
        {
          "target": [
            "a",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "一直",
      "code": "fiAz",
      "steps": [
        {
          "target": [
            "f",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "A",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "国家",
      "code": "U,",
      "steps": [
        {
          "target": [
            "U",
            ","
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "同时",
      "code": "Ft",
      "steps": [
        {
          "target": [
            "F",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "然后",
      "code": "HK",
      "steps": [
        {
          "target": [
            "H",
            "K"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "不能",
      "code": "cbBH",
      "steps": [
        {
          "target": [
            "c",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "B",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "这是",
      "code": "vpwC",
      "steps": [
        {
          "target": [
            "v",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "有点",
      "code": "+e",
      "steps": [
        {
          "target": [
            "e"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "地方",
      "code": "_V",
      "steps": [
        {
          "target": [
            "V"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "不要",
      "code": "cbtZ",
      "steps": [
        {
          "target": [
            "c",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t",
            "Z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "日本",
      "code": "wr",
      "steps": [
        {
          "target": [
            "w",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "基金",
      "code": "dV",
      "steps": [
        {
          "target": [
            "d",
            "V"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "应用",
      "code": "Jn",
      "steps": [
        {
          "target": [
            "J",
            "n"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "成为",
      "code": "+;",
      "steps": [
        {
          "target": [
            ";"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "方面",
      "code": "<f",
      "steps": [
        {
          "target": [
            "<",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "结果",
      "code": "RJ",
      "steps": [
        {
          "target": [
            "R",
            "J"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "训练",
      "code": "uY",
      "steps": [
        {
          "target": [
            "u",
            "Y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "自己的",
      "code": "gP",
      "steps": [
        {
          "target": [
            "g",
            "P"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "专业",
      "code": "_E",
      "steps": [
        {
          "target": [
            "E"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "重要",
      "code": "+k",
      "steps": [
        {
          "target": [
            "k"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "适合",
      "code": "gp",
      "steps": [
        {
          "target": [
            "g",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "最后",
      "code": "wF",
      "steps": [
        {
          "target": [
            "w",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "能够",
      "code": "BHGS",
      "steps": [
        {
          "target": [
            "B",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "城市",
      "code": "+V",
      "steps": [
        {
          "target": [
            "V"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "安全",
      "code": "_j",
      "steps": [
        {
          "target": [
            "j"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "目前",
      "code": "Tm",
      "steps": [
        {
          "target": [
            "T",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "经济",
      "code": "Rv",
      "steps": [
        {
          "target": [
            "R",
            "v"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "之后",
      "code": "_L",
      "steps": [
        {
          "target": [
            "L"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "出现",
      "code": "YF",
      "steps": [
        {
          "target": [
            "Y",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "不会",
      "code": "cbrN",
      "steps": [
        {
          "target": [
            "c",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "N"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "一样",
      "code": "fioQ",
      "steps": [
        {
          "target": [
            "f",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o",
            "Q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "历史",
      "code": "+y",
      "steps": [
        {
          "target": [
            "y"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "哪些",
      "code": "bA",
      "steps": [
        {
          "target": [
            "b",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "希望",
      "code": "+l",
      "steps": [
        {
          "target": [
            "l"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "学生",
      "code": "MF",
      "steps": [
        {
          "target": [
            "M",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "以及",
      "code": "hrsj",
      "steps": [
        {
          "target": [
            "h",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "例如",
      "code": "aJ",
      "steps": [
        {
          "target": [
            "a",
            "J"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "手机",
      "code": "io",
      "steps": [
        {
          "target": [
            "i",
            "o"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "一起",
      "code": "fidP",
      "steps": [
        {
          "target": [
            "f",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d",
            "P"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "虽然",
      "code": "bB",
      "steps": [
        {
          "target": [
            "b",
            "B"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "认为",
      "code": "ur",
      "steps": [
        {
          "target": [
            "u",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "社会",
      "code": "_N",
      "steps": [
        {
          "target": [
            "N"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "相关",
      "code": "oT",
      "steps": [
        {
          "target": [
            "o",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "是否",
      "code": "wC",
      "steps": [
        {
          "target": [
            "w",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "研究",
      "code": "+.",
      "steps": [
        {
          "target": [
            "."
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "算法",
      "code": "cT",
      "steps": [
        {
          "target": [
            "c",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "平台",
      "code": "_?",
      "steps": [
        {
          "target": [
            "?"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "行业",
      "code": "gx",
      "steps": [
        {
          "target": [
            "g",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "注意",
      "code": "nO",
      "steps": [
        {
          "target": [
            "n",
            "O"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "出来",
      "code": "YFzX",
      "steps": [
        {
          "target": [
            "Y",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "品牌",
      "code": "bm",
      "steps": [
        {
          "target": [
            "b",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "人工智能",
      "code": "rS",
      "steps": [
        {
          "target": [
            "r",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "实现",
      "code": "+j",
      "steps": [
        {
          "target": [
            "j"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "一定",
      "code": "fijC",
      "steps": [
        {
          "target": [
            "f",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "一次",
      "code": "fiEc",
      "steps": [
        {
          "target": [
            "f",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "E",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "大学",
      "code": "+T",
      "steps": [
        {
          "target": [
            "T"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "支持",
      "code": ";i",
      "steps": [
        {
          "target": [
            ";",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "体验",
      "code": "an",
      "steps": [
        {
          "target": [
            "a",
            "n"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "关系",
      "code": "Rg",
      "steps": [
        {
          "target": [
            "R",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "其中",
      "code": "dq",
      "steps": [
        {
          "target": [
            "d",
            "q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "无法",
      "code": "zu",
      "steps": [
        {
          "target": [
            "z",
            "u"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "里面",
      "code": "+P",
      "steps": [
        {
          "target": [
            "P"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "识别",
      "code": "ub",
      "steps": [
        {
          "target": [
            "u",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "学校",
      "code": "MFoZ",
      "steps": [
        {
          "target": [
            "M",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o",
            "Z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "表示",
      "code": "+>",
      "steps": [
        {
          "target": [
            ">"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "所有",
      "code": "Q/",
      "steps": [
        {
          "target": [
            "Q",
            "/"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "项目",
      "code": "+S",
      "steps": [
        {
          "target": [
            "S"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "只有",
      "code": "bXeH",
      "steps": [
        {
          "target": [
            "b",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "只是",
      "code": "bX",
      "steps": [
        {
          "target": [
            "b",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "领域",
      "code": "kO",
      "steps": [
        {
          "target": [
            "k",
            "O"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "要求",
      "code": "tZ",
      "steps": [
        {
          "target": [
            "t",
            "Z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "好吃",
      "code": "ZF",
      "steps": [
        {
          "target": [
            "Z",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "未来",
      "code": "+z",
      "steps": [
        {
          "target": [
            "z"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "参考",
      "code": "BT",
      "steps": [
        {
          "target": [
            "B",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "自然",
      "code": "gi",
      "steps": [
        {
          "target": [
            "g",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "的话",
      "code": "d.",
      "steps": [
        {
          "target": [
            "d",
            "."
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "北京",
      "code": "+?",
      "steps": [
        {
          "target": [
            "?"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "回答",
      "code": "Ubck",
      "steps": [
        {
          "target": [
            "U",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c",
            "k"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "文章",
      "code": "vwSe",
      "steps": [
        {
          "target": [
            "v",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "为了",
      "code": "O<",
      "steps": [
        {
          "target": [
            "O",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "起来",
      "code": "dP",
      "steps": [
        {
          "target": [
            "d",
            "P"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "之前",
      "code": "Li",
      "steps": [
        {
          "target": [
            "L",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "目标",
      "code": "TmoN",
      "steps": [
        {
          "target": [
            "T",
            "m"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o",
            "N"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "效果",
      "code": "Zh",
      "steps": [
        {
          "target": [
            "Z",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "智能",
      "code": "+D",
      "steps": [
        {
          "target": [
            "D"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "来说",
      "code": "zX",
      "steps": [
        {
          "target": [
            "z",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "这么",
      "code": "vptB",
      "steps": [
        {
          "target": [
            "v",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t",
            "B"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "直接",
      "code": "+A",
      "steps": [
        {
          "target": [
            "A"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "各种",
      "code": "Yg",
      "steps": [
        {
          "target": [
            "Y",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "今天",
      "code": "kj",
      "steps": [
        {
          "target": [
            "k",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "理解",
      "code": ",P",
      "steps": [
        {
          "target": [
            ",",
            "P"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "特别",
      "code": "+m",
      "steps": [
        {
          "target": [
            "m"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "计划",
      "code": "ue",
      "steps": [
        {
          "target": [
            "u",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "老师",
      "code": "qh",
      "steps": [
        {
          "target": [
            "q",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "控制",
      "code": "iI",
      "steps": [
        {
          "target": [
            "i",
            "I"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "更加",
      "code": "gw",
      "steps": [
        {
          "target": [
            "g",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "风险",
      "code": "ql",
      "steps": [
        {
          "target": [
            "q",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "两个",
      "code": "Yl",
      "steps": [
        {
          "target": [
            "Y",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "评价",
      "code": "u?",
      "steps": [
        {
          "target": [
            "u",
            "?"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "网站",
      "code": "Fl",
      "steps": [
        {
          "target": [
            "F",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "一点",
      "code": "fiU;",
      "steps": [
        {
          "target": [
            "f",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "U",
            ";"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "分类",
      "code": "afrT",
      "steps": [
        {
          "target": [
            "a",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "旅游",
      "code": "<K",
      "steps": [
        {
          "target": [
            "<",
            "K"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "增加",
      "code": "VX",
      "steps": [
        {
          "target": [
            "V",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "故事",
      "code": "+/",
      "steps": [
        {
          "target": [
            "/"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "获得",
      "code": "_p",
      "steps": [
        {
          "target": [
            "p"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "功能",
      "code": "S<",
      "steps": [
        {
          "target": [
            "S",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "解决",
      "code": "Lu",
      "steps": [
        {
          "target": [
            "L",
            "u"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "比如",
      "code": "hh",
      "steps": [
        {
          "target": [
            "h",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "原因",
      "code": "yd",
      "steps": [
        {
          "target": [
            "y",
            "d"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "以上",
      "code": "hrxf",
      "steps": [
        {
          "target": [
            "h",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "文本",
      "code": "vwnb",
      "steps": [
        {
          "target": [
            "v",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "减少",
      "code": "S;",
      "steps": [
        {
          "target": [
            "S",
            ";"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "值得",
      "code": "aA",
      "steps": [
        {
          "target": [
            "a",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "需求",
      "code": "kB",
      "steps": [
        {
          "target": [
            "k",
            "B"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "音乐",
      "code": "Sy",
      "steps": [
        {
          "target": [
            "S",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "客户",
      "code": "jY",
      "steps": [
        {
          "target": [
            "j",
            "Y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "因此",
      "code": "UT",
      "steps": [
        {
          "target": [
            "U",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "金融",
      "code": "zj",
      "steps": [
        {
          "target": [
            "z",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "基本",
      "code": "dVnb",
      "steps": [
        {
          "target": [
            "d",
            "V"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "导致",
      "code": "Pz",
      "steps": [
        {
          "target": [
            "P",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "保持",
      "code": "ab",
      "steps": [
        {
          "target": [
            "a",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "考虑",
      "code": "qf",
      "steps": [
        {
          "target": [
            "q",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "那个",
      "code": "Ai",
      "steps": [
        {
          "target": [
            "A",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "发生",
      "code": "Yv",
      "steps": [
        {
          "target": [
            "Y",
            "v"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "以后",
      "code": "hryf",
      "steps": [
        {
          "target": [
            "h",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "知识",
      "code": "Db",
      "steps": [
        {
          "target": [
            "D",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "当时",
      "code": "+E",
      "steps": [
        {
          "target": [
            "E"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "行为",
      "code": "gxO<",
      "steps": [
        {
          "target": [
            "g",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "O",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "运动",
      "code": "+N",
      "steps": [
        {
          "target": [
            "N"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "有些",
      "code": "eH",
      "steps": [
        {
          "target": [
            "e",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "国际",
      "code": "U,YN",
      "steps": [
        {
          "target": [
            "U",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y",
            "N"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "地区",
      "code": "Vz",
      "steps": [
        {
          "target": [
            "V",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "交易",
      "code": "Zhw.",
      "steps": [
        {
          "target": [
            "Z",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w",
            "."
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "身体",
      "code": "+I",
      "steps": [
        {
          "target": [
            "I"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "关于",
      "code": "Rgfe",
      "steps": [
        {
          "target": [
            "R",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "每天",
      "code": "+K",
      "steps": [
        {
          "target": [
            "K"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "过程",
      "code": "zp",
      "steps": [
        {
          "target": [
            "z",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "避免",
      "code": "_W",
      "steps": [
        {
          "target": [
            "W"
          ],
          "hand": "left"
        }
      ]
    },
    {
      "text": "你们",
      "code": "aL",
      "steps": [
        {
          "target": [
            "a",
            "L"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "机器",
      "code": "oq",
      "steps": [
        {
          "target": [
            "o",
            "q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "介绍",
      "code": "rW",
      "steps": [
        {
          "target": [
            "r",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "存在",
      "code": "ec",
      "steps": [
        {
          "target": [
            "e",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "治疗",
      "code": "nB",
      "steps": [
        {
          "target": [
            "n",
            "B"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "之一",
      "code": "Lifi",
      "steps": [
        {
          "target": [
            "L",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "后来",
      "code": "yf",
      "steps": [
        {
          "target": [
            "y",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "几个",
      "code": "qj",
      "steps": [
        {
          "target": [
            "q",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "记者",
      "code": "uP",
      "steps": [
        {
          "target": [
            "u",
            "P"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "作品",
      "code": "aHbm",
      "steps": [
        {
          "target": [
            "a",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "上海",
      "code": "xf",
      "steps": [
        {
          "target": [
            "x",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "由于",
      "code": "By",
      "steps": [
        {
          "target": [
            "B",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "购买",
      "code": "+G",
      "steps": [
        {
          "target": [
            "G"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "利用",
      "code": "xW",
      "steps": [
        {
          "target": [
            "x",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "部分",
      "code": "Cb",
      "steps": [
        {
          "target": [
            "C",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "当然",
      "code": "EC",
      "steps": [
        {
          "target": [
            "E",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "保护",
      "code": "abiQ",
      "steps": [
        {
          "target": [
            "a",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i",
            "Q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "简单",
      "code": "cI",
      "steps": [
        {
          "target": [
            "c",
            "I"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "具体",
      "code": "TX",
      "steps": [
        {
          "target": [
            "T",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "汽车",
      "code": "nD",
      "steps": [
        {
          "target": [
            "n",
            "D"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "速度",
      "code": "Cp",
      "steps": [
        {
          "target": [
            "C",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "政府",
      "code": "fI",
      "steps": [
        {
          "target": [
            "f",
            "I"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "微信",
      "code": "gq",
      "steps": [
        {
          "target": [
            "g",
            "q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "事情",
      "code": "fb",
      "steps": [
        {
          "target": [
            "f",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "新闻",
      "code": "+C",
      "steps": [
        {
          "target": [
            "C"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "人员",
      "code": "rr",
      "steps": [
        {
          "target": [
            "r",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "股票",
      "code": "HT",
      "steps": [
        {
          "target": [
            "H",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "医疗",
      "code": "+W",
      "steps": [
        {
          "target": [
            "W"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "之间",
      "code": "+L",
      "steps": [
        {
          "target": [
            "L"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "评估",
      "code": "u?a/",
      "steps": [
        {
          "target": [
            "u",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "/"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "继续",
      "code": "Rr",
      "steps": [
        {
          "target": [
            "R",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "容易",
      "code": "jL",
      "steps": [
        {
          "target": [
            "j",
            "L"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "自动",
      "code": "giN<",
      "steps": [
        {
          "target": [
            "g",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "N",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "最近",
      "code": "wF/p",
      "steps": [
        {
          "target": [
            "w",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "/",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "优化",
      "code": "a:",
      "steps": [
        {
          "target": [
            "a",
            ":"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "社区",
      "code": "NVWl",
      "steps": [
        {
          "target": [
            "N",
            "V"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "任何",
      "code": "aN",
      "steps": [
        {
          "target": [
            "a",
            "N"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "不断",
      "code": "cbrA",
      "steps": [
        {
          "target": [
            "c",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "甚至",
      "code": "dA",
      "steps": [
        {
          "target": [
            "d",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "完全",
      "code": "jE",
      "steps": [
        {
          "target": [
            "j",
            "E"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "准备",
      "code": "S,",
      "steps": [
        {
          "target": [
            "S",
            ","
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "传统",
      "code": "aE",
      "steps": [
        {
          "target": [
            "a",
            "E"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "以前",
      "code": "hrXH",
      "steps": [
        {
          "target": [
            "h",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "X",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "具有",
      "code": "TXeH",
      "steps": [
        {
          "target": [
            "T",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "进入",
      "code": "hp",
      "steps": [
        {
          "target": [
            "h",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "成功",
      "code": ";A",
      "steps": [
        {
          "target": [
            ";",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "阅读",
      "code": "IX",
      "steps": [
        {
          "target": [
            "I",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "别人",
      "code": "b<",
      "steps": [
        {
          "target": [
            "b",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "全球",
      "code": "r,",
      "steps": [
        {
          "target": [
            "r",
            ","
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "比赛",
      "code": "hhjh",
      "steps": [
        {
          "target": [
            "h",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "互联网",
      "code": "fF",
      "steps": [
        {
          "target": [
            "f",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "家庭",
      "code": "jQ",
      "steps": [
        {
          "target": [
            "j",
            "Q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "完成",
      "code": "jE;A",
      "steps": [
        {
          "target": [
            "j",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            ";",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "经常",
      "code": "RvMQ",
      "steps": [
        {
          "target": [
            "R",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "M",
            "Q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "预测",
      "code": ">?",
      "steps": [
        {
          "target": [
            ">",
            "?"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "视频",
      "code": "Ne",
      "steps": [
        {
          "target": [
            "N",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "合作",
      "code": "kh",
      "steps": [
        {
          "target": [
            "k",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "科技",
      "code": "xD",
      "steps": [
        {
          "target": [
            "x",
            "D"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "人类",
      "code": "rrrT",
      "steps": [
        {
          "target": [
            "r",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "有的",
      "code": "eHd.",
      "steps": [
        {
          "target": [
            "e",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d",
            "."
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "小行星",
      "code": "Eg",
      "steps": [
        {
          "target": [
            "E",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "香港",
      "code": "xw",
      "steps": [
        {
          "target": [
            "x",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "发布",
      "code": "YvAb",
      "steps": [
        {
          "target": [
            "Y",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "A",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "分享",
      "code": "afsF",
      "steps": [
        {
          "target": [
            "a",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "调整",
      "code": "uF",
      "steps": [
        {
          "target": [
            "u",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "中心",
      "code": "bc",
      "steps": [
        {
          "target": [
            "b",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "建立",
      "code": "lg",
      "steps": [
        {
          "target": [
            "l",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "情感",
      "code": ":>",
      "steps": [
        {
          "target": [
            ":",
            ">"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "模式",
      "code": "oP",
      "steps": [
        {
          "target": [
            "o",
            "P"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "除了",
      "code": "Yr",
      "steps": [
        {
          "target": [
            "Y",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "确定",
      "code": ".L",
      "steps": [
        {
          "target": [
            ".",
            "L"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "左右",
      "code": "eS",
      "steps": [
        {
          "target": [
            "e",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "任务",
      "code": "aN/<",
      "steps": [
        {
          "target": [
            "a",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            "/",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "水平",
      "code": "ns",
      "steps": [
        {
          "target": [
            "n",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "交通",
      "code": "ZhBq",
      "steps": [
        {
          "target": [
            "Z",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "B",
            "q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "得到",
      "code": "gw.W",
      "steps": [
        {
          "target": [
            "g",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            ".",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "第一",
      "code": "cP",
      "steps": [
        {
          "target": [
            "c",
            "P"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "很好",
      "code": "g;",
      "steps": [
        {
          "target": [
            "g",
            ";"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "事件",
      "code": "fbam",
      "steps": [
        {
          "target": [
            "f",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "变化",
      "code": "Gv",
      "steps": [
        {
          "target": [
            "G",
            "v"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "资料",
      "code": "EGrD",
      "steps": [
        {
          "target": [
            "E",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "D"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "软件",
      "code": "M:",
      "steps": [
        {
          "target": [
            "M",
            ":"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "媒体",
      "code": "Zo",
      "steps": [
        {
          "target": [
            "Z",
            "o"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "图像",
      "code": "U/",
      "steps": [
        {
          "target": [
            "U",
            "/"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "参加",
      "code": "BT<b",
      "steps": [
        {
          "target": [
            "B",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "<",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "表现",
      "code": ">?,e",
      "steps": [
        {
          "target": [
            ">",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            ",",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "政策",
      "code": "fIco",
      "steps": [
        {
          "target": [
            "f",
            "I"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c",
            "o"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "图片",
      "code": "U/Op",
      "steps": [
        {
          "target": [
            "U",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "O",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "英语",
      "code": "+p",
      "steps": [
        {
          "target": [
            "p"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "国内",
      "code": "U,Bn",
      "steps": [
        {
          "target": [
            "U",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "B",
            "n"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "机构",
      "code": "oqo.",
      "steps": [
        {
          "target": [
            "o",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o",
            "."
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "测试",
      "code": "nG",
      "steps": [
        {
          "target": [
            "n",
            "G"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "基础",
      "code": "dV.Y",
      "steps": [
        {
          "target": [
            "d",
            "V"
          ],
          "hand": "both"
        },
        {
          "target": [
            ".",
            "Y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "位于",
      "code": "aC",
      "steps": [
        {
          "target": [
            "a",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "组织",
      "code": "Rq",
      "steps": [
        {
          "target": [
            "R",
            "q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "特征",
      "code": "mV",
      "steps": [
        {
          "target": [
            "m",
            "V"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "确保",
      "code": ".Lab",
      "steps": [
        {
          "target": [
            ".",
            "L"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "医院",
      "code": "WD",
      "steps": [
        {
          "target": [
            "W",
            "D"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "最好",
      "code": "wFZF",
      "steps": [
        {
          "target": [
            "w",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Z",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "并不",
      "code": "Xp",
      "steps": [
        {
          "target": [
            "X",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "台湾",
      "code": "Bb",
      "steps": [
        {
          "target": [
            "B",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "银行",
      "code": "z;",
      "steps": [
        {
          "target": [
            "z",
            ";"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "资源",
      "code": "EG",
      "steps": [
        {
          "target": [
            "E",
            "G"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "人们",
      "code": "rraI",
      "steps": [
        {
          "target": [
            "r",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "I"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "价值",
      "code": "araA",
      "steps": [
        {
          "target": [
            "a",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "电脑",
      "code": "Ud",
      "steps": [
        {
          "target": [
            "U",
            "d"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "首先",
      "code": "Xg",
      "steps": [
        {
          "target": [
            "X",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "单位",
      "code": "+X",
      "steps": [
        {
          "target": [
            "X"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "业务",
      "code": "/y",
      "steps": [
        {
          "target": [
            "/",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "找到",
      "code": "iU",
      "steps": [
        {
          "target": [
            "i",
            "U"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "生成",
      "code": "Gs",
      "steps": [
        {
          "target": [
            "G",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "不好",
      "code": "cbZF",
      "steps": [
        {
          "target": [
            "c",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Z",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "另外",
      "code": "b<Sx",
      "steps": [
        {
          "target": [
            "b",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "设备",
      "code": "uT",
      "steps": [
        {
          "target": [
            "u",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "便宜",
      "code": "ag",
      "steps": [
        {
          "target": [
            "a",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "产生",
      "code": "Cy",
      "steps": [
        {
          "target": [
            "C",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "操作",
      "code": "ib",
      "steps": [
        {
          "target": [
            "i",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "必须",
      "code": "+:",
      "steps": [
        {
          "target": [
            ":"
          ],
          "hand": "right"
        }
      ]
    },
    {
      "text": "同学",
      "code": "FtMF",
      "steps": [
        {
          "target": [
            "F",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "M",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "怎样",
      "code": "H:",
      "steps": [
        {
          "target": [
            "H",
            ":"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "不知道",
      "code": "cD",
      "steps": [
        {
          "target": [
            "c",
            "D"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "报告",
      "code": "iY",
      "steps": [
        {
          "target": [
            "i",
            "Y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "用于",
      "code": "qy",
      "steps": [
        {
          "target": [
            "q",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "经验",
      "code": "Rv/k",
      "steps": [
        {
          "target": [
            "R",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "/",
            "k"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "因素",
      "code": "UT>R",
      "steps": [
        {
          "target": [
            "U",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            ">",
            "R"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "他的",
      "code": "azd.",
      "steps": [
        {
          "target": [
            "a",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d",
            "."
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "每个",
      "code": "KNrc",
      "steps": [
        {
          "target": [
            "K",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "开发",
      "code": "fpYv",
      "steps": [
        {
          "target": [
            "f",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y",
            "v"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "许多",
      "code": "uK",
      "steps": [
        {
          "target": [
            "u",
            "K"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "加入",
      "code": "<b",
      "steps": [
        {
          "target": [
            "<",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "计算",
      "code": "uecT",
      "steps": [
        {
          "target": [
            "u",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "每次",
      "code": "KN",
      "steps": [
        {
          "target": [
            "K",
            "N"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "建设",
      "code": "lguT",
      "steps": [
        {
          "target": [
            "l",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "拥有",
      "code": "iq",
      "steps": [
        {
          "target": [
            "i",
            "q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "是不是",
      "code": "wc",
      "steps": [
        {
          "target": [
            "w",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "今年",
      "code": "kjKr",
      "steps": [
        {
          "target": [
            "k",
            "j"
          ],
          "hand": "both"
        },
        {
          "target": [
            "K",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "标准",
      "code": "oN",
      "steps": [
        {
          "target": [
            "o",
            "N"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "结构",
      "code": "RJo.",
      "steps": [
        {
          "target": [
            "R",
            "J"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o",
            "."
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "只能",
      "code": "bXBH",
      "steps": [
        {
          "target": [
            "b",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "B",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "属于",
      "code": "yt",
      "steps": [
        {
          "target": [
            "y",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "机会",
      "code": "oqrN",
      "steps": [
        {
          "target": [
            "o",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "N"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "考试",
      "code": "qfuU",
      "steps": [
        {
          "target": [
            "q",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "U"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "达到",
      "code": "Tp",
      "steps": [
        {
          "target": [
            "T",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "答案",
      "code": "ck",
      "steps": [
        {
          "target": [
            "c",
            "k"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "决定",
      "code": "SW",
      "steps": [
        {
          "target": [
            "S",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "接受",
      "code": "iC",
      "steps": [
        {
          "target": [
            "i",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "那些",
      "code": "AiIh",
      "steps": [
        {
          "target": [
            "A",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "生产",
      "code": "GsCy",
      "steps": [
        {
          "target": [
            "G",
            "s"
          ],
          "hand": "both"
        },
        {
          "target": [
            "C",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "并且",
      "code": "Xpqq",
      "steps": [
        {
          "target": [
            "X",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q",
            "q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "微博",
      "code": "gqeL",
      "steps": [
        {
          "target": [
            "g",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e",
            "L"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "创新",
      "code": "rY",
      "steps": [
        {
          "target": [
            "r",
            "Y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "增长",
      "code": "VXuc",
      "steps": [
        {
          "target": [
            "V",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "空间",
      "code": "IS",
      "steps": [
        {
          "target": [
            "I",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "第一次",
      "code": "cf",
      "steps": [
        {
          "target": [
            "c",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "工具",
      "code": "Sg",
      "steps": [
        {
          "target": [
            "S",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "深度",
      "code": "nC",
      "steps": [
        {
          "target": [
            "n",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "销售",
      "code": "zE",
      "steps": [
        {
          "target": [
            "z",
            "E"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "最大",
      "code": "wFTd",
      "steps": [
        {
          "target": [
            "w",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T",
            "d"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "口味",
      "code": "bkbz",
      "steps": [
        {
          "target": [
            "b",
            "k"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "参与",
      "code": "BTfA",
      "steps": [
        {
          "target": [
            "B",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "看看",
      "code": "iTiT",
      "steps": [
        {
          "target": [
            "i",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "多少",
      "code": "SS",
      "steps": [
        {
          "target": [
            "S",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "代表",
      "code": "aU",
      "steps": [
        {
          "target": [
            "a",
            "U"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "医生",
      "code": "WDGs",
      "steps": [
        {
          "target": [
            "W",
            "D"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "免费",
      "code": "AJ",
      "steps": [
        {
          "target": [
            "A",
            "J"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "父母",
      "code": "hf",
      "steps": [
        {
          "target": [
            "h",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "人口",
      "code": "rrbk",
      "steps": [
        {
          "target": [
            "r",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b",
            "k"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "评论",
      "code": "u?uS",
      "steps": [
        {
          "target": [
            "u",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "翻译",
      "code": "tr",
      "steps": [
        {
          "target": [
            "t",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "政治",
      "code": "fInB",
      "steps": [
        {
          "target": [
            "f",
            "I"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            "B"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "广告",
      "code": "Jg",
      "steps": [
        {
          "target": [
            "J",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "采用",
      "code": ":o",
      "steps": [
        {
          "target": [
            ":",
            "o"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "位置",
      "code": "aCOA",
      "steps": [
        {
          "target": [
            "a",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "O",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "分钟",
      "code": "afzb",
      "steps": [
        {
          "target": [
            "a",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "可是",
      "code": "xk",
      "steps": [
        {
          "target": [
            "x",
            "k"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "制定",
      "code": "mQjC",
      "steps": [
        {
          "target": [
            "m",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "社交",
      "code": "NV",
      "steps": [
        {
          "target": [
            "N",
            "V"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "效率",
      "code": "ZhZ>",
      "steps": [
        {
          "target": [
            "Z",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Z",
            ">"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "服务员",
      "code": "H/",
      "steps": [
        {
          "target": [
            "H",
            "/"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "步骤",
      "code": "II",
      "steps": [
        {
          "target": [
            "I",
            "I"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "造成",
      "code": "mb;A",
      "steps": [
        {
          "target": [
            "m",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            ";",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "谢谢",
      "code": "uI",
      "steps": [
        {
          "target": [
            "u",
            "I"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "艺术",
      "code": "pj",
      "steps": [
        {
          "target": [
            "p",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "基于",
      "code": "dVfe",
      "steps": [
        {
          "target": [
            "d",
            "V"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "商品",
      "code": "hX",
      "steps": [
        {
          "target": [
            "h",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "照片",
      "code": "wu",
      "steps": [
        {
          "target": [
            "w",
            "u"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "科学",
      "code": "xDMF",
      "steps": [
        {
          "target": [
            "x",
            "D"
          ],
          "hand": "both"
        },
        {
          "target": [
            "M",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "成本",
      "code": ";Anb",
      "steps": [
        {
          "target": [
            ";",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "食物",
      "code": "fs",
      "steps": [
        {
          "target": [
            "f",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "方便",
      "code": "<fag",
      "steps": [
        {
          "target": [
            "<",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "职业",
      "code": "Fb",
      "steps": [
        {
          "target": [
            "F",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "显示",
      "code": "w/",
      "steps": [
        {
          "target": [
            "w",
            "/"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "越来越",
      "code": "dz",
      "steps": [
        {
          "target": [
            "d",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "英国",
      "code": "pF",
      "steps": [
        {
          "target": [
            "p",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "努力",
      "code": "Zv",
      "steps": [
        {
          "target": [
            "Z",
            "v"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "特色",
      "code": "mVLT",
      "steps": [
        {
          "target": [
            "m",
            "V"
          ],
          "hand": "both"
        },
        {
          "target": [
            "L",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "妈妈",
      "code": "Z/",
      "steps": [
        {
          "target": [
            "Z",
            "/"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "超过",
      "code": "du",
      "steps": [
        {
          "target": [
            "d",
            "u"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "当地",
      "code": "ECVz",
      "steps": [
        {
          "target": [
            "E",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "V",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "晚上",
      "code": "wA",
      "steps": [
        {
          "target": [
            "w",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "态度",
      "code": "TO",
      "steps": [
        {
          "target": [
            "T",
            "O"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "作用",
      "code": "aHqy",
      "steps": [
        {
          "target": [
            "a",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "丰富",
      "code": ">f",
      "steps": [
        {
          "target": [
            ">",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "风格",
      "code": "qloY",
      "steps": [
        {
          "target": [
            "q",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o",
            "Y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "时代",
      "code": "wz",
      "steps": [
        {
          "target": [
            "w",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "最终",
      "code": "wFR/",
      "steps": [
        {
          "target": [
            "w",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "R",
            "/"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "全国",
      "code": "r,U,",
      "steps": [
        {
          "target": [
            "r",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "U",
            ","
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "经历",
      "code": "Rvy<",
      "steps": [
        {
          "target": [
            "R",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "资金",
      "code": "EGzj",
      "steps": [
        {
          "target": [
            "E",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "部门",
      "code": "CbIm",
      "steps": [
        {
          "target": [
            "C",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "改变",
      "code": "Pa",
      "steps": [
        {
          "target": [
            "P",
            "a"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "制作",
      "code": "mQ",
      "steps": [
        {
          "target": [
            "m",
            "Q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "带来",
      "code": "hC",
      "steps": [
        {
          "target": [
            "h",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "联系",
      "code": "FR",
      "steps": [
        {
          "target": [
            "F",
            "R"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "问答",
      "code": "Ib",
      "steps": [
        {
          "target": [
            "I",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "趋势",
      "code": "dL",
      "steps": [
        {
          "target": [
            "d",
            "L"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "期间",
      "code": "dH",
      "steps": [
        {
          "target": [
            "d",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "只要",
      "code": "bXtZ",
      "steps": [
        {
          "target": [
            "b",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t",
            "Z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "收集",
      "code": "Wa",
      "steps": [
        {
          "target": [
            "W",
            "a"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "实际",
      "code": "jS",
      "steps": [
        {
          "target": [
            "j",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "好的",
      "code": "ZFd.",
      "steps": [
        {
          "target": [
            "Z",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d",
            "."
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "商业",
      "code": "hX/y",
      "steps": [
        {
          "target": [
            "h",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "/",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "交流",
      "code": "ZhnN",
      "steps": [
        {
          "target": [
            "Z",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            "N"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "检查",
      "code": "ok",
      "steps": [
        {
          "target": [
            "o",
            "k"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "系列",
      "code": "tRJW",
      "steps": [
        {
          "target": [
            "t",
            "R"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "大量",
      "code": "Td",
      "steps": [
        {
          "target": [
            "T",
            "d"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "作者",
      "code": "aHqz",
      "steps": [
        {
          "target": [
            "a",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "确实",
      "code": ".LjS",
      "steps": [
        {
          "target": [
            ".",
            "L"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "宝宝",
      "code": "j,",
      "steps": [
        {
          "target": [
            "j",
            ","
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "有效",
      "code": "eHZh",
      "steps": [
        {
          "target": [
            "e",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Z",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "习惯",
      "code": "yx",
      "steps": [
        {
          "target": [
            "y",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "策略",
      "code": "co",
      "steps": [
        {
          "target": [
            "c",
            "o"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "哈哈",
      "code": "bk",
      "steps": [
        {
          "target": [
            "b",
            "k"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "不少",
      "code": "cbEt",
      "steps": [
        {
          "target": [
            "c",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "E",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "快速",
      "code": ":W",
      "steps": [
        {
          "target": [
            ":",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "营销",
      "code": "Kb",
      "steps": [
        {
          "target": [
            "K",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "资产",
      "code": "EGCy",
      "steps": [
        {
          "target": [
            "E",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "C",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "提升",
      "code": "iwtp",
      "steps": [
        {
          "target": [
            "i",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "等等",
      "code": "cV",
      "steps": [
        {
          "target": [
            "c",
            "V"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "过去",
      "code": "zpVB",
      "steps": [
        {
          "target": [
            "z",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "V",
            "B"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "说明",
      "code": "uX",
      "steps": [
        {
          "target": [
            "u",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "解释",
      "code": "Lutr",
      "steps": [
        {
          "target": [
            "L",
            "u"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "团队",
      "code": "Ue",
      "steps": [
        {
          "target": [
            "U",
            "e"
          ],
          "hand": "both"
        }
      ]
    }
  ],
  [
    {
      "text": "酒店",
      "code": "nU",
      "steps": [
        {
          "target": [
            "n",
            "U"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "告诉",
      "code": "mb",
      "steps": [
        {
          "target": [
            "m",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "电话",
      "code": "Udug",
      "steps": [
        {
          "target": [
            "U",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "主题",
      "code": "O,",
      "steps": [
        {
          "target": [
            "O",
            ","
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "加强",
      "code": "<bPb",
      "steps": [
        {
          "target": [
            "<",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "P",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "更新",
      "code": "gwCo",
      "steps": [
        {
          "target": [
            "g",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "C",
            "o"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "整个",
      "code": "Ca",
      "steps": [
        {
          "target": [
            "C",
            "a"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "状态",
      "code": "?K",
      "steps": [
        {
          "target": [
            "?",
            "K"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "正常",
      "code": "fIMQ",
      "steps": [
        {
          "target": [
            "f",
            "I"
          ],
          "hand": "both"
        },
        {
          "target": [
            "M",
            "Q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "到了",
      "code": ".W",
      "steps": [
        {
          "target": [
            ".",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "语音",
      "code": "uN",
      "steps": [
        {
          "target": [
            "u",
            "N"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "按照",
      "code": "ij",
      "steps": [
        {
          "target": [
            "i",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "条件",
      "code": "/o",
      "steps": [
        {
          "target": [
            "/",
            "o"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "收入",
      "code": "WaVu",
      "steps": [
        {
          "target": [
            "W",
            "a"
          ],
          "hand": "both"
        },
        {
          "target": [
            "V",
            "u"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "方案",
      "code": "<fjZ",
      "steps": [
        {
          "target": [
            "<",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j",
            "Z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "女性",
      "code": "Zn",
      "steps": [
        {
          "target": [
            "Z",
            "n"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "好像",
      "code": "ZFa,",
      "steps": [
        {
          "target": [
            "Z",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            ","
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "通常",
      "code": "Bq",
      "steps": [
        {
          "target": [
            "B",
            "q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "美食",
      "code": "QTfs",
      "steps": [
        {
          "target": [
            "Q",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "工程",
      "code": "Sgxb",
      "steps": [
        {
          "target": [
            "S",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "请问",
      "code": "u>",
      "steps": [
        {
          "target": [
            "u",
            ">"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "心理",
      "code": ":x",
      "steps": [
        {
          "target": [
            ":",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "来自",
      "code": "zXgi",
      "steps": [
        {
          "target": [
            "z",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "经典",
      "code": "RvFX",
      "steps": [
        {
          "target": [
            "R",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "F",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "下面",
      "code": "fxcm",
      "steps": [
        {
          "target": [
            "f",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "患者",
      "code": "bb",
      "steps": [
        {
          "target": [
            "b",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "压力",
      "code": "yV",
      "steps": [
        {
          "target": [
            "y",
            "V"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "持续",
      "code": "iV",
      "steps": [
        {
          "target": [
            "i",
            "V"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "技能",
      "code": "i;",
      "steps": [
        {
          "target": [
            "i",
            ";"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "人物",
      "code": "rrm.",
      "steps": [
        {
          "target": [
            "r",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m",
            "."
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "描述",
      "code": "ip",
      "steps": [
        {
          "target": [
            "i",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "场景",
      "code": "VA",
      "steps": [
        {
          "target": [
            "V",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "从而",
      "code": "mc",
      "steps": [
        {
          "target": [
            "m",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "是什么",
      "code": "wa",
      "steps": [
        {
          "target": [
            "w",
            "a"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "感受",
      "code": ";f",
      "steps": [
        {
          "target": [
            ";",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "外部",
      "code": "Sx",
      "steps": [
        {
          "target": [
            "S",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "来源",
      "code": "zXny",
      "steps": [
        {
          "target": [
            "z",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "规定",
      "code": "de",
      "steps": [
        {
          "target": [
            "d",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "实在",
      "code": "jSec",
      "steps": [
        {
          "target": [
            "j",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "餐厅",
      "code": "Jv",
      "steps": [
        {
          "target": [
            "J",
            "v"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "方向",
      "code": "<fqb",
      "steps": [
        {
          "target": [
            "<",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "先生",
      "code": "mJ",
      "steps": [
        {
          "target": [
            "m",
            "J"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "真是",
      "code": "eT",
      "steps": [
        {
          "target": [
            "e",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "下来",
      "code": "fx",
      "steps": [
        {
          "target": [
            "f",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "报道",
      "code": "iYXg",
      "steps": [
        {
          "target": [
            "i",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "X",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "及时",
      "code": "sj",
      "steps": [
        {
          "target": [
            "s",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "现场",
      "code": ",e",
      "steps": [
        {
          "target": [
            ",",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "附近",
      "code": "Ya",
      "steps": [
        {
          "target": [
            "Y",
            "a"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "建筑",
      "code": "lgcS",
      "steps": [
        {
          "target": [
            "l",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "材料",
      "code": "oe",
      "steps": [
        {
          "target": [
            "o",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "坚持",
      "code": "Wv",
      "steps": [
        {
          "target": [
            "W",
            "v"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "法国",
      "code": "nV",
      "steps": [
        {
          "target": [
            "n",
            "V"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "还可以",
      "code": "cx",
      "steps": [
        {
          "target": [
            "c",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "规划",
      "code": "deUW",
      "steps": [
        {
          "target": [
            "d",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "U",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "娱乐",
      "code": "Zb",
      "steps": [
        {
          "target": [
            "Z",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "网上",
      "code": "Flxf",
      "steps": [
        {
          "target": [
            "F",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "毕业",
      "code": "hh/y",
      "steps": [
        {
          "target": [
            "h",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "/",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "明显",
      "code": "wH",
      "steps": [
        {
          "target": [
            "w",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "正在",
      "code": "fIec",
      "steps": [
        {
          "target": [
            "f",
            "I"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "它们",
      "code": "jh",
      "steps": [
        {
          "target": [
            "j",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "点击",
      "code": "U;",
      "steps": [
        {
          "target": [
            "U",
            ";"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "兴趣",
      "code": "nX",
      "steps": [
        {
          "target": [
            "n",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "表达",
      "code": ">?Tp",
      "steps": [
        {
          "target": [
            ">",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "对方",
      "code": "vz<f",
      "steps": [
        {
          "target": [
            "v",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "<",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "员工",
      "code": "bG",
      "steps": [
        {
          "target": [
            "b",
            "G"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "总之",
      "code": "Xb",
      "steps": [
        {
          "target": [
            "X",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "普通",
      "code": "X/",
      "steps": [
        {
          "target": [
            "X",
            "/"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "严重",
      "code": "f;",
      "steps": [
        {
          "target": [
            "f",
            ";"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "尤其是",
      "code": ":d",
      "steps": [
        {
          "target": [
            ":",
            "d"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "法律",
      "code": "nVgl",
      "steps": [
        {
          "target": [
            "n",
            "V"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "性能",
      "code": ":G",
      "steps": [
        {
          "target": [
            ":",
            "G"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "不用",
      "code": "cbqy",
      "steps": [
        {
          "target": [
            "c",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "女人",
      "code": "Znrr",
      "steps": [
        {
          "target": [
            "Z",
            "n"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "真正",
      "code": "eTfI",
      "steps": [
        {
          "target": [
            "e",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f",
            "I"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "降低",
      "code": "Y/",
      "steps": [
        {
          "target": [
            "Y",
            "/"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "吸引",
      "code": "bs",
      "steps": [
        {
          "target": [
            "b",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "类型",
      "code": "rT",
      "steps": [
        {
          "target": [
            "r",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "饮食",
      "code": "f:",
      "steps": [
        {
          "target": [
            "f",
            ":"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "受到",
      "code": "Av",
      "steps": [
        {
          "target": [
            "A",
            "v"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "精神",
      "code": "r>",
      "steps": [
        {
          "target": [
            "r",
            ">"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "随着",
      "code": "Ye",
      "steps": [
        {
          "target": [
            "Y",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "于是",
      "code": "fe",
      "steps": [
        {
          "target": [
            "f",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "经过",
      "code": "Rvzp",
      "steps": [
        {
          "target": [
            "R",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "吃饭",
      "code": "bK",
      "steps": [
        {
          "target": [
            "b",
            "K"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "食品",
      "code": "fsbm",
      "steps": [
        {
          "target": [
            "f",
            "s"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "时期",
      "code": "wzdH",
      "steps": [
        {
          "target": [
            "w",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "保证",
      "code": "abuf",
      "steps": [
        {
          "target": [
            "a",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "文件",
      "code": "vwam",
      "steps": [
        {
          "target": [
            "v",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "记录",
      "code": "uPCn",
      "steps": [
        {
          "target": [
            "u",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "C",
            "n"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "消费者",
      "code": "nP",
      "steps": [
        {
          "target": [
            "n",
            "P"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "女生",
      "code": "ZnGs",
      "steps": [
        {
          "target": [
            "Z",
            "n"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "人生",
      "code": "rrGs",
      "steps": [
        {
          "target": [
            "r",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "颜色",
      "code": "CyLT",
      "steps": [
        {
          "target": [
            "C",
            "y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "L",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "面积",
      "code": "cmxb",
      "steps": [
        {
          "target": [
            "c",
            "m"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "关键",
      "code": "Rgzl",
      "steps": [
        {
          "target": [
            "R",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "有关",
      "code": "eHRg",
      "steps": [
        {
          "target": [
            "e",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "R",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "特点",
      "code": "mVU;",
      "steps": [
        {
          "target": [
            "m",
            "V"
          ],
          "hand": "both"
        },
        {
          "target": [
            "U",
            ";"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "产业",
      "code": "Cy/y",
      "steps": [
        {
          "target": [
            "C",
            "y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "/",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "环保",
      "code": ",c",
      "steps": [
        {
          "target": [
            ",",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "总是",
      "code": "XbwC",
      "steps": [
        {
          "target": [
            "X",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "神经",
      "code": "Nw",
      "steps": [
        {
          "target": [
            "N",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "形成",
      "code": "fp;A",
      "steps": [
        {
          "target": [
            "f",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            ";",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "意义",
      "code": "S:",
      "steps": [
        {
          "target": [
            "S",
            ":"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "小时",
      "code": "Ex",
      "steps": [
        {
          "target": [
            "E",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "程序",
      "code": "xb",
      "steps": [
        {
          "target": [
            "x",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "优势",
      "code": "a:r<",
      "steps": [
        {
          "target": [
            "a",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "措施",
      "code": "iR",
      "steps": [
        {
          "target": [
            "i",
            "R"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "正式",
      "code": "fIUS",
      "steps": [
        {
          "target": [
            "f",
            "I"
          ],
          "hand": "both"
        },
        {
          "target": [
            "U",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "集团",
      "code": ",o",
      "steps": [
        {
          "target": [
            ",",
            "o"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "如此",
      "code": "ZbIh",
      "steps": [
        {
          "target": [
            "Z",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "而是",
      "code": "BewC",
      "steps": [
        {
          "target": [
            "B",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "美元",
      "code": "QT",
      "steps": [
        {
          "target": [
            "Q",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "成绩",
      "code": ";AR>",
      "steps": [
        {
          "target": [
            ";",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "R",
            ">"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "计算机",
      "code": "uc",
      "steps": [
        {
          "target": [
            "u",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "范围",
      "code": "/Y",
      "steps": [
        {
          "target": [
            "/",
            "Y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "电视",
      "code": "UdNe",
      "steps": [
        {
          "target": [
            "U",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "N",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "相对",
      "code": "oTvz",
      "steps": [
        {
          "target": [
            "o",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "v",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "综合",
      "code": "Rj",
      "steps": [
        {
          "target": [
            "R",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "本人",
      "code": "nb",
      "steps": [
        {
          "target": [
            "n",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "男人",
      "code": "D<",
      "steps": [
        {
          "target": [
            "D",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "相信",
      "code": "oTau",
      "steps": [
        {
          "target": [
            "o",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "u"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "申请",
      "code": "wcu>",
      "steps": [
        {
          "target": [
            "w",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            ">"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "决策",
      "code": "SWco",
      "steps": [
        {
          "target": [
            "S",
            "W"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c",
            "o"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "自由",
      "code": "giBy",
      "steps": [
        {
          "target": [
            "g",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "B",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "重点",
      "code": "kP",
      "steps": [
        {
          "target": [
            "k",
            "P"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "满足",
      "code": "npsu",
      "steps": [
        {
          "target": [
            "n",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s",
            "u"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "肯定",
      "code": "IH",
      "steps": [
        {
          "target": [
            "I",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "疾病",
      "code": "lD",
      "steps": [
        {
          "target": [
            "l",
            "D"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "证券",
      "code": "uf",
      "steps": [
        {
          "target": [
            "u",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "此外",
      "code": "Ih",
      "steps": [
        {
          "target": [
            "I",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "错误",
      "code": "zR",
      "steps": [
        {
          "target": [
            "z",
            "R"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "老板",
      "code": "qhoy",
      "steps": [
        {
          "target": [
            "q",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "程度",
      "code": "xbJR",
      "steps": [
        {
          "target": [
            "x",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J",
            "R"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "检测",
      "code": "oknG",
      "steps": [
        {
          "target": [
            "o",
            "k"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            "G"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "符合",
      "code": "ca",
      "steps": [
        {
          "target": [
            "c",
            "a"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "认识",
      "code": "urub",
      "steps": [
        {
          "target": [
            "u",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "德国",
      "code": "ge",
      "steps": [
        {
          "target": [
            "g",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "大概",
      "code": "Tdo;",
      "steps": [
        {
          "target": [
            "T",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o",
            ";"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "独立",
      "code": "KB",
      "steps": [
        {
          "target": [
            "K",
            "B"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "第二",
      "code": "cPEe",
      "steps": [
        {
          "target": [
            "c",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "E",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "积极",
      "code": "xbos",
      "steps": [
        {
          "target": [
            "x",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "几乎",
      "code": "qjtX",
      "steps": [
        {
          "target": [
            "q",
            "j"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "然而",
      "code": "HKBe",
      "steps": [
        {
          "target": [
            "H",
            "K"
          ],
          "hand": "both"
        },
        {
          "target": [
            "B",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "遇到",
      "code": "DB",
      "steps": [
        {
          "target": [
            "D",
            "B"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "官方",
      "code": "jm",
      "steps": [
        {
          "target": [
            "j",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "韩国",
      "code": "AD",
      "steps": [
        {
          "target": [
            "A",
            "D"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "到底",
      "code": ".WJZ",
      "steps": [
        {
          "target": [
            ".",
            "W"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J",
            "Z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "新的",
      "code": "Co",
      "steps": [
        {
          "target": [
            "C",
            "o"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "满意",
      "code": "np",
      "steps": [
        {
          "target": [
            "n",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "有没有",
      "code": "en",
      "steps": [
        {
          "target": [
            "e",
            "n"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "名字",
      "code": "Sb",
      "steps": [
        {
          "target": [
            "S",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "呵呵",
      "code": "bx",
      "steps": [
        {
          "target": [
            "b",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "竞争",
      "code": "CbLl",
      "steps": [
        {
          "target": [
            "C",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "L",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "消费",
      "code": "nE",
      "steps": [
        {
          "target": [
            "n",
            "E"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "提出",
      "code": "iwYF",
      "steps": [
        {
          "target": [
            "i",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "苹果",
      "code": "p?",
      "steps": [
        {
          "target": [
            "p",
            "?"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "长期",
      "code": "ucdH",
      "steps": [
        {
          "target": [
            "u",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "都有",
      "code": "qY",
      "steps": [
        {
          "target": [
            "q",
            "Y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "下午",
      "code": "fxKe",
      "steps": [
        {
          "target": [
            "f",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "K",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "欢迎",
      "code": "v:",
      "steps": [
        {
          "target": [
            "v",
            ":"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "阶段",
      "code": "Yrif",
      "steps": [
        {
          "target": [
            "Y",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "全部",
      "code": "r,Cb",
      "steps": [
        {
          "target": [
            "r",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "C",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "这次",
      "code": "vpEc",
      "steps": [
        {
          "target": [
            "v",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "E",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "课程",
      "code": "uD",
      "steps": [
        {
          "target": [
            "u",
            "D"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "调查",
      "code": "uFow",
      "steps": [
        {
          "target": [
            "u",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "角色",
      "code": "Lj",
      "steps": [
        {
          "target": [
            "L",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "数量",
      "code": "rZ",
      "steps": [
        {
          "target": [
            "r",
            "Z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "设置",
      "code": "uTOA",
      "steps": [
        {
          "target": [
            "u",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "O",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "年年",
      "code": "Kr",
      "steps": [
        {
          "target": [
            "K",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "驾驶",
      "code": "<b/b",
      "steps": [
        {
          "target": [
            "<",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "/",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "欧洲",
      "code": "Wl",
      "steps": [
        {
          "target": [
            "W",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "链接",
      "code": "zM",
      "steps": [
        {
          "target": [
            "z",
            "M"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "机器人",
      "code": "om",
      "steps": [
        {
          "target": [
            "o",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "一切",
      "code": "fitu",
      "steps": [
        {
          "target": [
            "f",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t",
            "u"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "咨询",
      "code": "Eb",
      "steps": [
        {
          "target": [
            "E",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "现实",
      "code": ",ejS",
      "steps": [
        {
          "target": [
            ",",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "核心",
      "code": "oL",
      "steps": [
        {
          "target": [
            "o",
            "L"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "尝试",
      "code": "MN",
      "steps": [
        {
          "target": [
            "M",
            "N"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "是一种",
      "code": "wf",
      "steps": [
        {
          "target": [
            "w",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "不仅",
      "code": "cbav",
      "steps": [
        {
          "target": [
            "c",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "v"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "看待",
      "code": "iTgV",
      "steps": [
        {
          "target": [
            "i",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g",
            "V"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "不同的",
      "code": "cF",
      "steps": [
        {
          "target": [
            "c",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "超级",
      "code": "duRs",
      "steps": [
        {
          "target": [
            "d",
            "u"
          ],
          "hand": "both"
        },
        {
          "target": [
            "R",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "创业",
      "code": "rY/y",
      "steps": [
        {
          "target": [
            "r",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "/",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "什么的",
      "code": "at",
      "steps": [
        {
          "target": [
            "a",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "最佳",
      "code": "wFaM",
      "steps": [
        {
          "target": [
            "w",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "M"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "背景",
      "code": "?h",
      "steps": [
        {
          "target": [
            "?",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "电子",
      "code": "UdFi",
      "steps": [
        {
          "target": [
            "U",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "F",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "节目",
      "code": "pY",
      "steps": [
        {
          "target": [
            "p",
            "Y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "分别",
      "code": "afb<",
      "steps": [
        {
          "target": [
            "a",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "行动",
      "code": "gxN<",
      "steps": [
        {
          "target": [
            "g",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "N",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "数字",
      "code": "rZjF",
      "steps": [
        {
          "target": [
            "r",
            "Z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "各位",
      "code": "YgaC",
      "steps": [
        {
          "target": [
            "Y",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "至少",
      "code": ".i",
      "steps": [
        {
          "target": [
            ".",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "办法",
      "code": "<X",
      "steps": [
        {
          "target": [
            "<",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "指标",
      "code": "ih",
      "steps": [
        {
          "target": [
            "i",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "特别是",
      "code": "mbw",
      "steps": [
        {
          "target": [
            "m",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w"
          ],
          "hand": "either"
        }
      ]
    },
    {
      "text": "财务",
      "code": "Ge",
      "steps": [
        {
          "target": [
            "G",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "突然",
      "code": "IK",
      "steps": [
        {
          "target": [
            "I",
            "K"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "车辆",
      "code": "Mc",
      "steps": [
        {
          "target": [
            "M",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "培训",
      "code": "VC",
      "steps": [
        {
          "target": [
            "V",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "绝对",
      "code": "RL",
      "steps": [
        {
          "target": [
            "R",
            "L"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "经营",
      "code": "RvKb",
      "steps": [
        {
          "target": [
            "R",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "K",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "整体",
      "code": "Caan",
      "steps": [
        {
          "target": [
            "C",
            "a"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "n"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "没什么",
      "code": "na",
      "steps": [
        {
          "target": [
            "n",
            "a"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "装修",
      "code": "?r",
      "steps": [
        {
          "target": [
            "?",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "即可",
      "code": ";Y",
      "steps": [
        {
          "target": [
            ";",
            "Y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "不够",
      "code": "cbGS",
      "steps": [
        {
          "target": [
            "c",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "旅行",
      "code": "<Kgx",
      "steps": [
        {
          "target": [
            "<",
            "K"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "公里",
      "code": "XBPl",
      "steps": [
        {
          "target": [
            "X",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "P",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "稳定",
      "code": "xL",
      "steps": [
        {
          "target": [
            "x",
            "L"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "提取",
      "code": "iwFv",
      "steps": [
        {
          "target": [
            "i",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "F",
            "v"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "并不是",
      "code": "Xc",
      "steps": [
        {
          "target": [
            "X",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "曾经",
      "code": "Xe",
      "steps": [
        {
          "target": [
            "X",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "消息",
      "code": "nEg:",
      "steps": [
        {
          "target": [
            "n",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g",
            ":"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "目的",
      "code": "Tmd.",
      "steps": [
        {
          "target": [
            "T",
            "m"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d",
            "."
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "以便",
      "code": "hrag",
      "steps": [
        {
          "target": [
            "h",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "生命",
      "code": "Gskb",
      "steps": [
        {
          "target": [
            "G",
            "s"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "结合",
      "code": "RJkh",
      "steps": [
        {
          "target": [
            "R",
            "J"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "费用",
      "code": "PG",
      "steps": [
        {
          "target": [
            "P",
            "G"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "享受",
      "code": "sF",
      "steps": [
        {
          "target": [
            "s",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "个月",
      "code": "rc",
      "steps": [
        {
          "target": [
            "r",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "上面",
      "code": "xfcm",
      "steps": [
        {
          "target": [
            "x",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "还不错",
      "code": "cc",
      "steps": [
        {
          "target": [
            "c",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "也有",
      "code": "zy",
      "steps": [
        {
          "target": [
            "z",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "现代",
      "code": ",eaU",
      "steps": [
        {
          "target": [
            ",",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "U"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "判断",
      "code": "Xi",
      "steps": [
        {
          "target": [
            "X",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "上市",
      "code": "xfZQ",
      "steps": [
        {
          "target": [
            "x",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Z",
            "Q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "意思",
      "code": "S:D:",
      "steps": [
        {
          "target": [
            "S",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "D",
            ":"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "美丽",
      "code": "QTfH",
      "steps": [
        {
          "target": [
            "Q",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "类似",
      "code": "rTah",
      "steps": [
        {
          "target": [
            "r",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "保险",
      "code": "abYk",
      "steps": [
        {
          "target": [
            "a",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y",
            "k"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "结束",
      "code": "RJCs",
      "steps": [
        {
          "target": [
            "R",
            "J"
          ],
          "hand": "both"
        },
        {
          "target": [
            "C",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "负责",
      "code": "LG",
      "steps": [
        {
          "target": [
            "L",
            "G"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "全面",
      "code": "r,cm",
      "steps": [
        {
          "target": [
            "r",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "c",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "小说",
      "code": "ExuX",
      "steps": [
        {
          "target": [
            "E",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "最高",
      "code": "wFsg",
      "steps": [
        {
          "target": [
            "w",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "准确",
      "code": "S,.L",
      "steps": [
        {
          "target": [
            "S",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            ".",
            "L"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "儿子",
      "code": "Je",
      "steps": [
        {
          "target": [
            "J",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "本身",
      "code": "nbIs",
      "steps": [
        {
          "target": [
            "n",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "观点",
      "code": "ve",
      "steps": [
        {
          "target": [
            "v",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "同事",
      "code": "Ftfb",
      "steps": [
        {
          "target": [
            "F",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "版本",
      "code": "Oy",
      "steps": [
        {
          "target": [
            "O",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "感谢",
      "code": ";fuI",
      "steps": [
        {
          "target": [
            ";",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "I"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "有什么",
      "code": "ea",
      "steps": [
        {
          "target": [
            "e",
            "a"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "总体",
      "code": "Xban",
      "steps": [
        {
          "target": [
            "X",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "n"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "家里",
      "code": "jQPl",
      "steps": [
        {
          "target": [
            "j",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "P",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "制度",
      "code": "mQJR",
      "steps": [
        {
          "target": [
            "m",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J",
            "R"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "在线",
      "code": "ecRf",
      "steps": [
        {
          "target": [
            "e",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "R",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "同样",
      "code": "FtoQ",
      "steps": [
        {
          "target": [
            "F",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o",
            "Q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "会议",
      "code": "rN",
      "steps": [
        {
          "target": [
            "r",
            "N"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "推广",
      "code": "i,",
      "steps": [
        {
          "target": [
            "i",
            ","
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "输入",
      "code": "Mk",
      "steps": [
        {
          "target": [
            "M",
            "k"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "打开",
      "code": "iG",
      "steps": [
        {
          "target": [
            "i",
            "G"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "支付",
      "code": ";iaz",
      "steps": [
        {
          "target": [
            ";",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "还要",
      "code": "cptZ",
      "steps": [
        {
          "target": [
            "c",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t",
            "Z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "合理",
      "code": "kh,P",
      "steps": [
        {
          "target": [
            "k",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            ",",
            "P"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "发行",
      "code": "Yvgx",
      "steps": [
        {
          "target": [
            "Y",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "移动",
      "code": "xS",
      "steps": [
        {
          "target": [
            "x",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "重新",
      "code": "kPCo",
      "steps": [
        {
          "target": [
            "k",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "C",
            "o"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "技巧",
      "code": "i;Sf",
      "steps": [
        {
          "target": [
            "i",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "引起",
      "code": "Pc",
      "steps": [
        {
          "target": [
            "P",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "如下",
      "code": "Zbfx",
      "steps": [
        {
          "target": [
            "Z",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "包装",
      "code": ".P",
      "steps": [
        {
          "target": [
            ".",
            "P"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "成立",
      "code": ";ACl",
      "steps": [
        {
          "target": [
            ";",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "C",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "专家",
      "code": "EA",
      "steps": [
        {
          "target": [
            "E",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "爱情",
      "code": "Ai:>",
      "steps": [
        {
          "target": [
            "A",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":",
            ">"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "执行",
      "code": "rz",
      "steps": [
        {
          "target": [
            "r",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "合适",
      "code": "khgp",
      "steps": [
        {
          "target": [
            "k",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "实施",
      "code": "jS<K",
      "steps": [
        {
          "target": [
            "j",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "<",
            "K"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "人民币",
      "code": "rw",
      "steps": [
        {
          "target": [
            "r",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "补充",
      "code": "?x",
      "steps": [
        {
          "target": [
            "?",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "能源",
      "code": "BHny",
      "steps": [
        {
          "target": [
            "B",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "思考",
      "code": "D:",
      "steps": [
        {
          "target": [
            "D",
            ":"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "垃圾",
      "code": "VCVs",
      "steps": [
        {
          "target": [
            "V",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "V",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "根本",
      "code": "o;",
      "steps": [
        {
          "target": [
            "o",
            ";"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "以为",
      "code": "hrO<",
      "steps": [
        {
          "target": [
            "h",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "O",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "终于",
      "code": "R/",
      "steps": [
        {
          "target": [
            "R",
            "/"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "共同",
      "code": "RX",
      "steps": [
        {
          "target": [
            "R",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "来看",
      "code": "zXiT",
      "steps": [
        {
          "target": [
            "z",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "讨论",
      "code": "uz",
      "steps": [
        {
          "target": [
            "u",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "沟通",
      "code": "n.",
      "steps": [
        {
          "target": [
            "n",
            "."
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "多个",
      "code": "SSrc",
      "steps": [
        {
          "target": [
            "S",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "想要",
      "code": "oTtZ",
      "steps": [
        {
          "target": [
            "o",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t",
            "Z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "意见",
      "code": "S:ej",
      "steps": [
        {
          "target": [
            "S",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "著名",
      "code": "pq",
      "steps": [
        {
          "target": [
            "p",
            "q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "家长",
      "code": "jQuc",
      "steps": [
        {
          "target": [
            "j",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "成员",
      "code": ";AbG",
      "steps": [
        {
          "target": [
            ";",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b",
            "G"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "结婚",
      "code": "RJZZ",
      "steps": [
        {
          "target": [
            "R",
            "J"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Z",
            "Z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "粉丝",
      "code": "ra",
      "steps": [
        {
          "target": [
            "r",
            "a"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "搜索",
      "code": "i?",
      "steps": [
        {
          "target": [
            "i",
            "?"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "投资者",
      "code": "iE",
      "steps": [
        {
          "target": [
            "i",
            "E"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "编辑",
      "code": "RQ",
      "steps": [
        {
          "target": [
            "R",
            "Q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "反应",
      "code": "yv",
      "steps": [
        {
          "target": [
            "y",
            "v"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "玩家",
      "code": ",E",
      "steps": [
        {
          "target": [
            ",",
            "E"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "改革",
      "code": "PaAg",
      "steps": [
        {
          "target": [
            "P",
            "a"
          ],
          "hand": "both"
        },
        {
          "target": [
            "A",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "针对",
      "code": "ze",
      "steps": [
        {
          "target": [
            "z",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "明确",
      "code": "wH.L",
      "steps": [
        {
          "target": [
            "w",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            ".",
            "L"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "水果",
      "code": "nsDo",
      "steps": [
        {
          "target": [
            "n",
            "s"
          ],
          "hand": "both"
        },
        {
          "target": [
            "D",
            "o"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "责任",
      "code": ">G",
      "steps": [
        {
          "target": [
            ">",
            "G"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "正确",
      "code": "fI.L",
      "steps": [
        {
          "target": [
            "f",
            "I"
          ],
          "hand": "both"
        },
        {
          "target": [
            ".",
            "L"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "公园",
      "code": "XBUE",
      "steps": [
        {
          "target": [
            "X",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "U",
            "E"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "文字",
      "code": "vwjF",
      "steps": [
        {
          "target": [
            "v",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "皮肤",
      "code": "Hp",
      "steps": [
        {
          "target": [
            "H",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "原来",
      "code": "ydzX",
      "steps": [
        {
          "target": [
            "y",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "搭配",
      "code": "ipUP",
      "steps": [
        {
          "target": [
            "i",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "U",
            "P"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "文献",
      "code": "vweF",
      "steps": [
        {
          "target": [
            "v",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "哪个",
      "code": "bArc",
      "steps": [
        {
          "target": [
            "b",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "促进",
      "code": "as",
      "steps": [
        {
          "target": [
            "a",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "形式",
      "code": "fpUS",
      "steps": [
        {
          "target": [
            "f",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "U",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "蔬菜",
      "code": "pC",
      "steps": [
        {
          "target": [
            "p",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "攻击",
      "code": "Sa",
      "steps": [
        {
          "target": [
            "S",
            "a"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "组合",
      "code": "Rqkh",
      "steps": [
        {
          "target": [
            "R",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "情绪",
      "code": ":>Rq",
      "steps": [
        {
          "target": [
            ":",
            ">"
          ],
          "hand": "both"
        },
        {
          "target": [
            "R",
            "q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "定期",
      "code": "jC",
      "steps": [
        {
          "target": [
            "j",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "采取",
      "code": ":oFv",
      "steps": [
        {
          "target": [
            ":",
            "o"
          ],
          "hand": "both"
        },
        {
          "target": [
            "F",
            "v"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "十分",
      "code": "es",
      "steps": [
        {
          "target": [
            "e",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "推出",
      "code": "i,YF",
      "steps": [
        {
          "target": [
            "i",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "昨天",
      "code": "wHfT",
      "steps": [
        {
          "target": [
            "w",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "广泛",
      "code": "Jgnt",
      "steps": [
        {
          "target": [
            "J",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "增强",
      "code": "VXPb",
      "steps": [
        {
          "target": [
            "V",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "P",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "让人",
      "code": "ux",
      "steps": [
        {
          "target": [
            "u",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "角度",
      "code": "LjJR",
      "steps": [
        {
          "target": [
            "L",
            "j"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J",
            "R"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "相当",
      "code": "oTEC",
      "steps": [
        {
          "target": [
            "o",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "E",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "进一步",
      "code": "hfI",
      "steps": [
        {
          "target": [
            "h",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I"
          ],
          "hand": "either"
        }
      ]
    },
    {
      "text": "公共",
      "code": "XBRX",
      "steps": [
        {
          "target": [
            "X",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "R",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "年度",
      "code": "KrJR",
      "steps": [
        {
          "target": [
            "K",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J",
            "R"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "不想",
      "code": "cboT",
      "steps": [
        {
          "target": [
            "c",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "详细",
      "code": "uQ",
      "steps": [
        {
          "target": [
            "u",
            "Q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "好看",
      "code": "ZFiT",
      "steps": [
        {
          "target": [
            "Z",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "练习",
      "code": "Rt",
      "steps": [
        {
          "target": [
            "R",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "平均",
      "code": "?X",
      "steps": [
        {
          "target": [
            "?",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "毕竟",
      "code": "hhSJ",
      "steps": [
        {
          "target": [
            "h",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S",
            "J"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "再次",
      "code": ",F",
      "steps": [
        {
          "target": [
            ",",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "运营",
      "code": "NpKb",
      "steps": [
        {
          "target": [
            "N",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "K",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "力量",
      "code": "<l",
      "steps": [
        {
          "target": [
            "<",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "去年",
      "code": "VB",
      "steps": [
        {
          "target": [
            "V",
            "B"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "距离",
      "code": "sW",
      "steps": [
        {
          "target": [
            "s",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "安排",
      "code": "jZ",
      "steps": [
        {
          "target": [
            "j",
            "Z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "运行",
      "code": "Np",
      "steps": [
        {
          "target": [
            "N",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "衣服",
      "code": "?i",
      "steps": [
        {
          "target": [
            "?",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "那里",
      "code": "AiPl",
      "steps": [
        {
          "target": [
            "A",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "P",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "生态",
      "code": "GsTO",
      "steps": [
        {
          "target": [
            "G",
            "s"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T",
            "O"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "性价比",
      "code": ":a",
      "steps": [
        {
          "target": [
            ":",
            "a"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "变成",
      "code": "Gv;A",
      "steps": [
        {
          "target": [
            "G",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            ";",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "理财",
      "code": ",PGe",
      "steps": [
        {
          "target": [
            ",",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "宣传",
      "code": "jf",
      "steps": [
        {
          "target": [
            "j",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "状况",
      "code": "?KSb",
      "steps": [
        {
          "target": [
            "?",
            "K"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "证明",
      "code": "ufwH",
      "steps": [
        {
          "target": [
            "u",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "代码",
      "code": "aU./",
      "steps": [
        {
          "target": [
            "a",
            "U"
          ],
          "hand": "both"
        },
        {
          "target": [
            ".",
            "/"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "才是",
      "code": "et",
      "steps": [
        {
          "target": [
            "e",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "回来",
      "code": "UbzX",
      "steps": [
        {
          "target": [
            "U",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "自我",
      "code": "giti",
      "steps": [
        {
          "target": [
            "g",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "差不多",
      "code": "Qc",
      "steps": [
        {
          "target": [
            "Q",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "比例",
      "code": "hhaJ",
      "steps": [
        {
          "target": [
            "h",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "J"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "声音",
      "code": "ry",
      "steps": [
        {
          "target": [
            "r",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "我们的",
      "code": "ta",
      "steps": [
        {
          "target": [
            "t",
            "a"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "新鲜",
      "code": "CoLQ",
      "steps": [
        {
          "target": [
            "C",
            "o"
          ],
          "hand": "both"
        },
        {
          "target": [
            "L",
            "Q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "好多",
      "code": "ZFSS",
      "steps": [
        {
          "target": [
            "Z",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "地址",
      "code": "VzVI",
      "steps": [
        {
          "target": [
            "V",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "V",
            "I"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "真实",
      "code": "eTjS",
      "steps": [
        {
          "target": [
            "e",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "车站",
      "code": "McCU",
      "steps": [
        {
          "target": [
            "M",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "C",
            "U"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "取得",
      "code": "Fv",
      "steps": [
        {
          "target": [
            "F",
            "v"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "区域",
      "code": "WlVU",
      "steps": [
        {
          "target": [
            "W",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            "V",
            "U"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "做出",
      "code": "a/YF",
      "steps": [
        {
          "target": [
            "a",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "面对",
      "code": "cmvz",
      "steps": [
        {
          "target": [
            "c",
            "m"
          ],
          "hand": "both"
        },
        {
          "target": [
            "v",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "景点",
      "code": "wsU;",
      "steps": [
        {
          "target": [
            "w",
            "s"
          ],
          "hand": "both"
        },
        {
          "target": [
            "U",
            ";"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "领导",
      "code": "kOPz",
      "steps": [
        {
          "target": [
            "k",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            "P",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "挑战",
      "code": "iJ",
      "steps": [
        {
          "target": [
            "i",
            "J"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "修改",
      "code": "ac",
      "steps": [
        {
          "target": [
            "a",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "算是",
      "code": "cTwC",
      "steps": [
        {
          "target": [
            "c",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "记得",
      "code": "uPgw",
      "steps": [
        {
          "target": [
            "u",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "平时",
      "code": "?Xwz",
      "steps": [
        {
          "target": [
            "?",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "清楚",
      "code": "n>",
      "steps": [
        {
          "target": [
            "n",
            ">"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "我觉得",
      "code": "tM",
      "steps": [
        {
          "target": [
            "t",
            "M"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "回复",
      "code": "UbKw",
      "steps": [
        {
          "target": [
            "U",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "K",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "大部分",
      "code": "TC",
      "steps": [
        {
          "target": [
            "T",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "指导",
      "code": "ihPz",
      "steps": [
        {
          "target": [
            "i",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "P",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "排名",
      "code": "it",
      "steps": [
        {
          "target": [
            "i",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "演员",
      "code": "nj",
      "steps": [
        {
          "target": [
            "n",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "优惠",
      "code": "a:fw",
      "steps": [
        {
          "target": [
            "a",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "下降",
      "code": "fxY/",
      "steps": [
        {
          "target": [
            "f",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y",
            "/"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "安装",
      "code": "jZ?r",
      "steps": [
        {
          "target": [
            "j",
            "Z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "?",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "想到",
      "code": "oT.W",
      "steps": [
        {
          "target": [
            "o",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            ".",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "女儿",
      "code": "ZnJe",
      "steps": [
        {
          "target": [
            "Z",
            "n"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "购物",
      "code": "G.",
      "steps": [
        {
          "target": [
            "G",
            "."
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "印象",
      "code": "Wf",
      "steps": [
        {
          "target": [
            "W",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "配置",
      "code": "UP",
      "steps": [
        {
          "target": [
            "U",
            "P"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "估计",
      "code": "a/",
      "steps": [
        {
          "target": [
            "a",
            "/"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "感到",
      "code": ";f.W",
      "steps": [
        {
          "target": [
            ";",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            ".",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "过来",
      "code": "zpzX",
      "steps": [
        {
          "target": [
            "z",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "牛肉",
      "code": "mn",
      "steps": [
        {
          "target": [
            "m",
            "n"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "儿童",
      "code": "JeCP",
      "steps": [
        {
          "target": [
            "J",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "C",
            "P"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "口感",
      "code": "bk;f",
      "steps": [
        {
          "target": [
            "b",
            "k"
          ],
          "hand": "both"
        },
        {
          "target": [
            ";",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "区别",
      "code": "Wlb<",
      "steps": [
        {
          "target": [
            "W",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "概念",
      "code": "o;k:",
      "steps": [
        {
          "target": [
            "o",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k",
            ":"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "接触",
      "code": "iCLB",
      "steps": [
        {
          "target": [
            "i",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "L",
            "B"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "收益",
      "code": "Wan;",
      "steps": [
        {
          "target": [
            "W",
            "a"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            ";"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "互动",
      "code": "fC",
      "steps": [
        {
          "target": [
            "f",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "英文",
      "code": "pFvw",
      "steps": [
        {
          "target": [
            "p",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "v",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "不如",
      "code": "cbZb",
      "steps": [
        {
          "target": [
            "c",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Z",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "体育",
      "code": "anNH",
      "steps": [
        {
          "target": [
            "a",
            "n"
          ],
          "hand": "both"
        },
        {
          "target": [
            "N",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "现象",
      "code": ",e,x",
      "steps": [
        {
          "target": [
            ",",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            ",",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "本来",
      "code": "nbzX",
      "steps": [
        {
          "target": [
            "n",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "老公",
      "code": "qhXB",
      "steps": [
        {
          "target": [
            "q",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "X",
            "B"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "营养",
      "code": "KbQO",
      "steps": [
        {
          "target": [
            "K",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Q",
            "O"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "战争",
      "code": "UU",
      "steps": [
        {
          "target": [
            "U",
            "U"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "进去",
      "code": "hpVB",
      "steps": [
        {
          "target": [
            "h",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "V",
            "B"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "电商",
      "code": "UdhX",
      "steps": [
        {
          "target": [
            "U",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "包含",
      "code": ".Pkb",
      "steps": [
        {
          "target": [
            ".",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "动作",
      "code": "N<",
      "steps": [
        {
          "target": [
            "N",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "教学",
      "code": "qFMF",
      "steps": [
        {
          "target": [
            "q",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "M",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "最新",
      "code": "wFCo",
      "steps": [
        {
          "target": [
            "w",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "C",
            "o"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "父亲",
      "code": "hfCo",
      "steps": [
        {
          "target": [
            "h",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "C",
            "o"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "回家",
      "code": "UbjQ",
      "steps": [
        {
          "target": [
            "U",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j",
            "Q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "幸福",
      "code": "VQ",
      "steps": [
        {
          "target": [
            "V",
            "Q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "天气",
      "code": "fT",
      "steps": [
        {
          "target": [
            "f",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "成长",
      "code": ";Auc",
      "steps": [
        {
          "target": [
            ";",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "数学",
      "code": "rZMF",
      "steps": [
        {
          "target": [
            "r",
            "Z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "M",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "变得",
      "code": "Gvgw",
      "steps": [
        {
          "target": [
            "G",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "保障",
      "code": "abYS",
      "steps": [
        {
          "target": [
            "a",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "漂亮",
      "code": "nt",
      "steps": [
        {
          "target": [
            "n",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "唯一",
      "code": "b,",
      "steps": [
        {
          "target": [
            "b",
            ","
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "理论",
      "code": ",PuS",
      "steps": [
        {
          "target": [
            ",",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "身边",
      "code": "Is",
      "steps": [
        {
          "target": [
            "I",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "人士",
      "code": "rrrs",
      "steps": [
        {
          "target": [
            "r",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "拍摄",
      "code": "id",
      "steps": [
        {
          "target": [
            "i",
            "d"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "咖啡",
      "code": "b<bt",
      "steps": [
        {
          "target": [
            "b",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "多种",
      "code": "SSxb",
      "steps": [
        {
          "target": [
            "S",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "规则",
      "code": "deGW",
      "steps": [
        {
          "target": [
            "d",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "培养",
      "code": "VCQO",
      "steps": [
        {
          "target": [
            "V",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Q",
            "O"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "高中",
      "code": "sg",
      "steps": [
        {
          "target": [
            "s",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "优秀",
      "code": "a:xT",
      "steps": [
        {
          "target": [
            "a",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "怎么办",
      "code": "Ht",
      "steps": [
        {
          "target": [
            "H",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "足球",
      "code": "su,f",
      "steps": [
        {
          "target": [
            "s",
            "u"
          ],
          "hand": "both"
        },
        {
          "target": [
            ",",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "蛋糕",
      "code": "CB",
      "steps": [
        {
          "target": [
            "C",
            "B"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "学院",
      "code": "MFYj",
      "steps": [
        {
          "target": [
            "M",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "也就是",
      "code": "zs",
      "steps": [
        {
          "target": [
            "z",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "时尚",
      "code": "wzMs",
      "steps": [
        {
          "target": [
            "w",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "M",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "指数",
      "code": "ihrZ",
      "steps": [
        {
          "target": [
            "i",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "Z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "干净",
      "code": "?g",
      "steps": [
        {
          "target": [
            "?",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "中央",
      "code": "bcFT",
      "steps": [
        {
          "target": [
            "b",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "F",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "下去",
      "code": "fxVB",
      "steps": [
        {
          "target": [
            "f",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "V",
            "B"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "过程中",
      "code": "zx",
      "steps": [
        {
          "target": [
            "z",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "恢复",
      "code": ":e",
      "steps": [
        {
          "target": [
            ":",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "获取",
      "code": "pK",
      "steps": [
        {
          "target": [
            "p",
            "K"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "愿意",
      "code": "ydS:",
      "steps": [
        {
          "target": [
            "y",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S",
            ":"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "感情",
      "code": ";f:>",
      "steps": [
        {
          "target": [
            ";",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":",
            ">"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "限制",
      "code": "Y;",
      "steps": [
        {
          "target": [
            "Y",
            ";"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "想法",
      "code": "oTnV",
      "steps": [
        {
          "target": [
            "o",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            "V"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "男子",
      "code": "D<Fi",
      "steps": [
        {
          "target": [
            "D",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "F",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "下载",
      "code": "fxLz",
      "steps": [
        {
          "target": [
            "f",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "L",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "收到",
      "code": "Wa.W",
      "steps": [
        {
          "target": [
            "W",
            "a"
          ],
          "hand": "both"
        },
        {
          "target": [
            ".",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "规模",
      "code": "deoP",
      "steps": [
        {
          "target": [
            "d",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o",
            "P"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "改善",
      "code": "PaQX",
      "steps": [
        {
          "target": [
            "P",
            "a"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Q",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "升级",
      "code": "tp",
      "steps": [
        {
          "target": [
            "t",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "异常",
      "code": "Pp",
      "steps": [
        {
          "target": [
            "P",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "报名",
      "code": "iYSb",
      "steps": [
        {
          "target": [
            "i",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "空气",
      "code": "ISDq",
      "steps": [
        {
          "target": [
            "I",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "D",
            "q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "实用",
      "code": "jSqy",
      "steps": [
        {
          "target": [
            "j",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "统计",
      "code": "RN",
      "steps": [
        {
          "target": [
            "R",
            "N"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "内部",
      "code": "Bn",
      "steps": [
        {
          "target": [
            "B",
            "n"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "细节",
      "code": "RD",
      "steps": [
        {
          "target": [
            "R",
            "D"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "都会",
      "code": "qYrN",
      "steps": [
        {
          "target": [
            "q",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "N"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "公布",
      "code": "XBAb",
      "steps": [
        {
          "target": [
            "X",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "A",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "体系",
      "code": "antR",
      "steps": [
        {
          "target": [
            "a",
            "n"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t",
            "R"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "动物",
      "code": "N<m.",
      "steps": [
        {
          "target": [
            "N",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m",
            "."
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "清晰",
      "code": "n>wo",
      "steps": [
        {
          "target": [
            "n",
            ">"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w",
            "o"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "良好",
      "code": "O;",
      "steps": [
        {
          "target": [
            "O",
            ";"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "买了",
      "code": "AS",
      "steps": [
        {
          "target": [
            "A",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "更多的",
      "code": "gS",
      "steps": [
        {
          "target": [
            "g",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "看了",
      "code": "iTsl",
      "steps": [
        {
          "target": [
            "i",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "不足",
      "code": "cbsu",
      "steps": [
        {
          "target": [
            "c",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s",
            "u"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "症状",
      "code": "lf",
      "steps": [
        {
          "target": [
            "l",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "复杂",
      "code": "Kw",
      "steps": [
        {
          "target": [
            "K",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "宣布",
      "code": "jfAb",
      "steps": [
        {
          "target": [
            "j",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "A",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "使得",
      "code": "aggw",
      "steps": [
        {
          "target": [
            "a",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "有着",
      "code": "eHQT",
      "steps": [
        {
          "target": [
            "e",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Q",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "逐渐",
      "code": "Qp",
      "steps": [
        {
          "target": [
            "Q",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "教师",
      "code": "qFWf",
      "steps": [
        {
          "target": [
            "q",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "公开",
      "code": "XBfp",
      "steps": [
        {
          "target": [
            "X",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "俄罗斯",
      "code": "aO",
      "steps": [
        {
          "target": [
            "a",
            "O"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "网友",
      "code": "Flev",
      "steps": [
        {
          "target": [
            "F",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e",
            "v"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "提前",
      "code": "iwXH",
      "steps": [
        {
          "target": [
            "i",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "X",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "展示",
      "code": "yR",
      "steps": [
        {
          "target": [
            "y",
            "R"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "别的",
      "code": "b<d.",
      "steps": [
        {
          "target": [
            "b",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d",
            "."
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "女孩",
      "code": "ZnFL",
      "steps": [
        {
          "target": [
            "Z",
            "n"
          ],
          "hand": "both"
        },
        {
          "target": [
            "F",
            "L"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "货币",
      "code": "ahtQ",
      "steps": [
        {
          "target": [
            "a",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t",
            "Q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "居然",
      "code": "y/",
      "steps": [
        {
          "target": [
            "y",
            "/"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "注册",
      "code": "nOFc",
      "steps": [
        {
          "target": [
            "n",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            "F",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "掌握",
      "code": "Mi",
      "steps": [
        {
          "target": [
            "M",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "参数",
      "code": "BTrZ",
      "steps": [
        {
          "target": [
            "B",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "Z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "中午",
      "code": "bcKe",
      "steps": [
        {
          "target": [
            "b",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "K",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "鼓励",
      "code": "J;",
      "steps": [
        {
          "target": [
            "J",
            ";"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "举行",
      "code": "nXgx",
      "steps": [
        {
          "target": [
            "n",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "歌曲",
      "code": "xx",
      "steps": [
        {
          "target": [
            "x",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "生物",
      "code": "Gsm.",
      "steps": [
        {
          "target": [
            "G",
            "s"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m",
            "."
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "哪里",
      "code": "bAPl",
      "steps": [
        {
          "target": [
            "b",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "P",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "设施",
      "code": "uT<K",
      "steps": [
        {
          "target": [
            "u",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "<",
            "K"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "年龄",
      "code": "KrDk",
      "steps": [
        {
          "target": [
            "K",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "D",
            "k"
          ],
          "hand": "both"
        }
      ]
    }
  ],
  [
    {
      "text": "添加",
      "code": "nf",
      "steps": [
        {
          "target": [
            "n",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "相比",
      "code": "oThh",
      "steps": [
        {
          "target": [
            "o",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "我国",
      "code": "ti",
      "steps": [
        {
          "target": [
            "t",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "似乎",
      "code": "ah",
      "steps": [
        {
          "target": [
            "a",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "心里",
      "code": ":xPl",
      "steps": [
        {
          "target": [
            ":",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "P",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "以来",
      "code": "hrzX",
      "steps": [
        {
          "target": [
            "h",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "做好",
      "code": "a/ZF",
      "steps": [
        {
          "target": [
            "a",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Z",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "年代",
      "code": "KraU",
      "steps": [
        {
          "target": [
            "K",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "U"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "让我",
      "code": "uxti",
      "steps": [
        {
          "target": [
            "u",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "动力",
      "code": "N<<l",
      "steps": [
        {
          "target": [
            "N",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "<",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "学会",
      "code": "MFrN",
      "steps": [
        {
          "target": [
            "M",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "N"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "观众",
      "code": "verm",
      "steps": [
        {
          "target": [
            "v",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "有个",
      "code": "eHrc",
      "steps": [
        {
          "target": [
            "e",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "车型",
      "code": "Mcfp",
      "steps": [
        {
          "target": [
            "M",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "中文",
      "code": "bcvw",
      "steps": [
        {
          "target": [
            "b",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "v",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "锻炼",
      "code": "zi",
      "steps": [
        {
          "target": [
            "z",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "改进",
      "code": "Pahp",
      "steps": [
        {
          "target": [
            "P",
            "a"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "大小",
      "code": "TdEx",
      "steps": [
        {
          "target": [
            "T",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "E",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "广州",
      "code": "JgYY",
      "steps": [
        {
          "target": [
            "J",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y",
            "Y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "机制",
      "code": "oqmQ",
      "steps": [
        {
          "target": [
            "o",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m",
            "Q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "完美",
      "code": "jEQT",
      "steps": [
        {
          "target": [
            "j",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Q",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "实惠",
      "code": "jSfw",
      "steps": [
        {
          "target": [
            "j",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "做到",
      "code": "a/.W",
      "steps": [
        {
          "target": [
            "a",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            ".",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "高度",
      "code": "sgJR",
      "steps": [
        {
          "target": [
            "s",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J",
            "R"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "深圳",
      "code": "nCVY",
      "steps": [
        {
          "target": [
            "n",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "V",
            "Y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "即使",
      "code": ";Yag",
      "steps": [
        {
          "target": [
            ";",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "还好",
      "code": "cpZF",
      "steps": [
        {
          "target": [
            "c",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Z",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "药物",
      "code": "pR",
      "steps": [
        {
          "target": [
            "p",
            "R"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "利润",
      "code": "xWnI",
      "steps": [
        {
          "target": [
            "x",
            "W"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            "I"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "思想",
      "code": "D:oT",
      "steps": [
        {
          "target": [
            "D",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "形象",
      "code": "fp,x",
      "steps": [
        {
          "target": [
            "f",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            ",",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "连接",
      "code": "Mp",
      "steps": [
        {
          "target": [
            "M",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "尽量",
      "code": "yO",
      "steps": [
        {
          "target": [
            "y",
            "O"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "在于",
      "code": "ecfe",
      "steps": [
        {
          "target": [
            "e",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "行政",
      "code": "gxfI",
      "steps": [
        {
          "target": [
            "g",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f",
            "I"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "加上",
      "code": "<bxf",
      "steps": [
        {
          "target": [
            "<",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "期待",
      "code": "dHgV",
      "steps": [
        {
          "target": [
            "d",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g",
            "V"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "战略",
      "code": "UUDY",
      "steps": [
        {
          "target": [
            "U",
            "U"
          ],
          "hand": "both"
        },
        {
          "target": [
            "D",
            "Y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "聊天",
      "code": "F:",
      "steps": [
        {
          "target": [
            "F",
            ":"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "不可",
      "code": "cbxk",
      "steps": [
        {
          "target": [
            "c",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x",
            "k"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "二维码",
      "code": "ER",
      "steps": [
        {
          "target": [
            "E",
            "R"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "母亲",
      "code": "Nm",
      "steps": [
        {
          "target": [
            "N",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "小编",
      "code": "ExRQ",
      "steps": [
        {
          "target": [
            "E",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "R",
            "Q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "思维",
      "code": "D:R,",
      "steps": [
        {
          "target": [
            "D",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "R",
            ","
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "函数",
      "code": "An",
      "steps": [
        {
          "target": [
            "A",
            "n"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "人家",
      "code": "rrjQ",
      "steps": [
        {
          "target": [
            "r",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j",
            "Q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "看起来",
      "code": "idz",
      "steps": [
        {
          "target": [
            "i",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z"
          ],
          "hand": "either"
        }
      ]
    },
    {
      "text": "监管",
      "code": "Wc",
      "steps": [
        {
          "target": [
            "W",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "死亡",
      "code": "Jh",
      "steps": [
        {
          "target": [
            "J",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "有限公司",
      "code": "eY",
      "steps": [
        {
          "target": [
            "e",
            "Y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "冠军",
      "code": "CE",
      "steps": [
        {
          "target": [
            "C",
            "E"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "睡眠",
      "code": "Tk",
      "steps": [
        {
          "target": [
            "T",
            "k"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "担任",
      "code": "iwaN",
      "steps": [
        {
          "target": [
            "i",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "N"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "快乐",
      "code": ":WWE",
      "steps": [
        {
          "target": [
            ":",
            "W"
          ],
          "hand": "both"
        },
        {
          "target": [
            "W",
            "E"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "主动",
      "code": "O,N<",
      "steps": [
        {
          "target": [
            "O",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "N",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "爸爸",
      "code": "hT",
      "steps": [
        {
          "target": [
            "h",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "开展",
      "code": "fpyR",
      "steps": [
        {
          "target": [
            "f",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y",
            "R"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "分为",
      "code": "afO<",
      "steps": [
        {
          "target": [
            "a",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "O",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "面试",
      "code": "cmuU",
      "steps": [
        {
          "target": [
            "c",
            "m"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "U"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "视觉",
      "code": "NeMe",
      "steps": [
        {
          "target": [
            "N",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "M",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "反馈",
      "code": "yvfB",
      "steps": [
        {
          "target": [
            "y",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f",
            "B"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "依然",
      "code": "a?",
      "steps": [
        {
          "target": [
            "a",
            "?"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "离开",
      "code": "Zl",
      "steps": [
        {
          "target": [
            "Z",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "男生",
      "code": "D<Gs",
      "steps": [
        {
          "target": [
            "D",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "样子",
      "code": "oQ",
      "steps": [
        {
          "target": [
            "o",
            "Q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "永远",
      "code": "On",
      "steps": [
        {
          "target": [
            "O",
            "n"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "也许",
      "code": "zyuK",
      "steps": [
        {
          "target": [
            "z",
            "y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "K"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "也可以",
      "code": "zxh",
      "steps": [
        {
          "target": [
            "z",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h"
          ],
          "hand": "either"
        }
      ]
    },
    {
      "text": "很少",
      "code": "g;Et",
      "steps": [
        {
          "target": [
            "g",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "E",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "诊断",
      "code": "urrA",
      "steps": [
        {
          "target": [
            "u",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "意大利",
      "code": "ST",
      "steps": [
        {
          "target": [
            "S",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "印度",
      "code": "WfJR",
      "steps": [
        {
          "target": [
            "W",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J",
            "R"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "常见",
      "code": "MQ",
      "steps": [
        {
          "target": [
            "M",
            "Q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "句子",
      "code": "Gj",
      "steps": [
        {
          "target": [
            "G",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "面包",
      "code": "cm.P",
      "steps": [
        {
          "target": [
            "c",
            "m"
          ],
          "hand": "both"
        },
        {
          "target": [
            ".",
            "P"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "开心",
      "code": "fp:x",
      "steps": [
        {
          "target": [
            "f",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "记忆",
      "code": "uP:j",
      "steps": [
        {
          "target": [
            "u",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "寻找",
      "code": "Cz",
      "steps": [
        {
          "target": [
            "C",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "家人",
      "code": "jQrr",
      "steps": [
        {
          "target": [
            "j",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "每年",
      "code": "KNKr",
      "steps": [
        {
          "target": [
            "K",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            "K",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "话题",
      "code": "ug",
      "steps": [
        {
          "target": [
            "u",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "房子",
      "code": "Q<",
      "steps": [
        {
          "target": [
            "Q",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "称为",
      "code": "xLO<",
      "steps": [
        {
          "target": [
            "x",
            "L"
          ],
          "hand": "both"
        },
        {
          "target": [
            "O",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "连续",
      "code": "MpRe",
      "steps": [
        {
          "target": [
            "M",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "R",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "传播",
      "code": "aEit",
      "steps": [
        {
          "target": [
            "a",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "个性化",
      "code": "r:",
      "steps": [
        {
          "target": [
            "r",
            ":"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "推动",
      "code": "i,N<",
      "steps": [
        {
          "target": [
            "i",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "N",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "流程",
      "code": "nN",
      "steps": [
        {
          "target": [
            "n",
            "N"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "慢慢",
      "code": ":w",
      "steps": [
        {
          "target": [
            ":",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "工业",
      "code": "Sg/y",
      "steps": [
        {
          "target": [
            "S",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "/",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "舒服",
      "code": "rg",
      "steps": [
        {
          "target": [
            "r",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "可能会",
      "code": "xB",
      "steps": [
        {
          "target": [
            "x",
            "B"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "一定要",
      "code": "fj",
      "steps": [
        {
          "target": [
            "f",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "涉及",
      "code": "nI",
      "steps": [
        {
          "target": [
            "n",
            "I"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "地球",
      "code": "Vz,f",
      "steps": [
        {
          "target": [
            "V",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            ",",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "出去",
      "code": "YFVB",
      "steps": [
        {
          "target": [
            "Y",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "V",
            "B"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "合同",
      "code": "khFt",
      "steps": [
        {
          "target": [
            "k",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "F",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "制造",
      "code": "mQmb",
      "steps": [
        {
          "target": [
            "m",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "好好",
      "code": "ZFZF",
      "steps": [
        {
          "target": [
            "Z",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Z",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "每个人",
      "code": "Krr",
      "steps": [
        {
          "target": [
            "K",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r"
          ],
          "hand": "either"
        }
      ]
    },
    {
      "text": "所谓",
      "code": "Q/uD",
      "steps": [
        {
          "target": [
            "Q",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "D"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "卫生",
      "code": "Yf",
      "steps": [
        {
          "target": [
            "Y",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "怎么样",
      "code": "Hto",
      "steps": [
        {
          "target": [
            "H",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o"
          ],
          "hand": "either"
        }
      ]
    },
    {
      "text": "大陆",
      "code": "TdYi",
      "steps": [
        {
          "target": [
            "T",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "有所",
      "code": "eHQ/",
      "steps": [
        {
          "target": [
            "e",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Q",
            "/"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "居民",
      "code": "y/wm",
      "steps": [
        {
          "target": [
            "y",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "追求",
      "code": "tm",
      "steps": [
        {
          "target": [
            "t",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "最大的",
      "code": "wT",
      "steps": [
        {
          "target": [
            "w",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "贷款",
      "code": "aUrN",
      "steps": [
        {
          "target": [
            "a",
            "U"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "N"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "后面",
      "code": "yfcm",
      "steps": [
        {
          "target": [
            "y",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "就要",
      "code": "sEtZ",
      "steps": [
        {
          "target": [
            "s",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t",
            "Z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "清洗",
      "code": "n>nm",
      "steps": [
        {
          "target": [
            "n",
            ">"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "无论",
      "code": "zuuS",
      "steps": [
        {
          "target": [
            "z",
            "u"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "仍然",
      "code": "aT",
      "steps": [
        {
          "target": [
            "a",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "精彩",
      "code": "r>:o",
      "steps": [
        {
          "target": [
            "r",
            ">"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":",
            "o"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "担心",
      "code": "iw:x",
      "steps": [
        {
          "target": [
            "i",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "随便",
      "code": "Yeag",
      "steps": [
        {
          "target": [
            "Y",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "火锅",
      "code": ";h",
      "steps": [
        {
          "target": [
            ";",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "开放",
      "code": "fp<a",
      "steps": [
        {
          "target": [
            "f",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "<",
            "a"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "股份",
      "code": "HTaa",
      "steps": [
        {
          "target": [
            "H",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "a"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "定义",
      "code": "jCOl",
      "steps": [
        {
          "target": [
            "j",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "O",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "认真",
      "code": "ureT",
      "steps": [
        {
          "target": [
            "u",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "医学",
      "code": "WDMF",
      "steps": [
        {
          "target": [
            "W",
            "D"
          ],
          "hand": "both"
        },
        {
          "target": [
            "M",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "意识",
      "code": "S:ub",
      "steps": [
        {
          "target": [
            "S",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "重复",
      "code": "kPKw",
      "steps": [
        {
          "target": [
            "k",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "K",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "物流",
      "code": "m.",
      "steps": [
        {
          "target": [
            "m",
            "."
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "集中",
      "code": ",obc",
      "steps": [
        {
          "target": [
            ",",
            "o"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "股东",
      "code": "HTtE",
      "steps": [
        {
          "target": [
            "H",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t",
            "E"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "女子",
      "code": "ZnFi",
      "steps": [
        {
          "target": [
            "Z",
            "n"
          ],
          "hand": "both"
        },
        {
          "target": [
            "F",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "实体",
      "code": "jSan",
      "steps": [
        {
          "target": [
            "j",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "n"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "就业",
      "code": "sE",
      "steps": [
        {
          "target": [
            "s",
            "E"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "工资",
      "code": "SgEG",
      "steps": [
        {
          "target": [
            "S",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "E",
            "G"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "动画",
      "code": "N<fD",
      "steps": [
        {
          "target": [
            "N",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f",
            "D"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "创造",
      "code": "rYmb",
      "steps": [
        {
          "target": [
            "r",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "利益",
      "code": "xWn;",
      "steps": [
        {
          "target": [
            "x",
            "W"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            ";"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "人民",
      "code": "rrwm",
      "steps": [
        {
          "target": [
            "r",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "前往",
      "code": "XH",
      "steps": [
        {
          "target": [
            "X",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "定位",
      "code": "jCaC",
      "steps": [
        {
          "target": [
            "j",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "舒适",
      "code": "rggp",
      "steps": [
        {
          "target": [
            "r",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "生意",
      "code": "GsS:",
      "steps": [
        {
          "target": [
            "G",
            "s"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S",
            ":"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "准确性",
      "code": "S.",
      "steps": [
        {
          "target": [
            "S",
            "."
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "铁路",
      "code": "zt",
      "steps": [
        {
          "target": [
            "z",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "直到",
      "code": "Az",
      "steps": [
        {
          "target": [
            "A",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "球队",
      "code": ",f",
      "steps": [
        {
          "target": [
            ",",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "资本",
      "code": "EGnb",
      "steps": [
        {
          "target": [
            "E",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "委员会",
      "code": "xbr",
      "steps": [
        {
          "target": [
            "x",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r"
          ],
          "hand": "either"
        }
      ]
    },
    {
      "text": "两种",
      "code": "Ylxb",
      "steps": [
        {
          "target": [
            "Y",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "市镇",
      "code": "ZQze",
      "steps": [
        {
          "target": [
            "Z",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "反正",
      "code": "yvfI",
      "steps": [
        {
          "target": [
            "y",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f",
            "I"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "重大",
      "code": "kPTd",
      "steps": [
        {
          "target": [
            "k",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T",
            "d"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "轻松",
      "code": "Mv",
      "steps": [
        {
          "target": [
            "M",
            "v"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "身份",
      "code": "Isaa",
      "steps": [
        {
          "target": [
            "I",
            "s"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "a"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "健身",
      "code": "alIs",
      "steps": [
        {
          "target": [
            "a",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "足够",
      "code": "su",
      "steps": [
        {
          "target": [
            "s",
            "u"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "手术",
      "code": "iooO",
      "steps": [
        {
          "target": [
            "i",
            "o"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o",
            "O"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "对象",
      "code": "vz,x",
      "steps": [
        {
          "target": [
            "v",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            ",",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "实践",
      "code": "jSsf",
      "steps": [
        {
          "target": [
            "j",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "连结",
      "code": "MpRJ",
      "steps": [
        {
          "target": [
            "M",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "R",
            "J"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "往往",
      "code": "gO",
      "steps": [
        {
          "target": [
            "g",
            "O"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "协议",
      "code": "e<",
      "steps": [
        {
          "target": [
            "e",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "游客",
      "code": "n<",
      "steps": [
        {
          "target": [
            "n",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "它的",
      "code": "jhd.",
      "steps": [
        {
          "target": [
            "j",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d",
            "."
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "看来",
      "code": "iTzX",
      "steps": [
        {
          "target": [
            "i",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "一个人",
      "code": "fr",
      "steps": [
        {
          "target": [
            "f",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "客服",
      "code": "jYHY",
      "steps": [
        {
          "target": [
            "j",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "H",
            "Y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "有时候",
      "code": "ew",
      "steps": [
        {
          "target": [
            "e",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "当年",
      "code": "ECKr",
      "steps": [
        {
          "target": [
            "E",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "K",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "较高",
      "code": "MZ",
      "steps": [
        {
          "target": [
            "M",
            "Z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "品质",
      "code": "bmye",
      "steps": [
        {
          "target": [
            "b",
            "m"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "年轻",
      "code": "KrMv",
      "steps": [
        {
          "target": [
            "K",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "M",
            "v"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "性格",
      "code": ":GoY",
      "steps": [
        {
          "target": [
            ":",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o",
            "Y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "必要",
      "code": ":t",
      "steps": [
        {
          "target": [
            ":",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "世纪",
      "code": "RA",
      "steps": [
        {
          "target": [
            "R",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "监测",
      "code": "WcnG",
      "steps": [
        {
          "target": [
            "W",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            "G"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "双方",
      "code": "ms",
      "steps": [
        {
          "target": [
            "m",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "列表",
      "code": "JW",
      "steps": [
        {
          "target": [
            "J",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "独特",
      "code": "KBmV",
      "steps": [
        {
          "target": [
            "K",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m",
            "V"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "道路",
      "code": "XgsY",
      "steps": [
        {
          "target": [
            "X",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s",
            "Y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "文学",
      "code": "vwMF",
      "steps": [
        {
          "target": [
            "v",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "M",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "失望",
      "code": "tduH",
      "steps": [
        {
          "target": [
            "t",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "大众",
      "code": "Tdrm",
      "steps": [
        {
          "target": [
            "T",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "当前",
      "code": "ECXH",
      "steps": [
        {
          "target": [
            "E",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "X",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "下次",
      "code": "fxEc",
      "steps": [
        {
          "target": [
            "f",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "E",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "渠道",
      "code": "nW",
      "steps": [
        {
          "target": [
            "n",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "自身",
      "code": "giIs",
      "steps": [
        {
          "target": [
            "g",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "点了",
      "code": "U;sl",
      "steps": [
        {
          "target": [
            "U",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "构建",
      "code": "o.",
      "steps": [
        {
          "target": [
            "o",
            "."
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "缺点",
      "code": "EW",
      "steps": [
        {
          "target": [
            "E",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "不再",
      "code": "cb,F",
      "steps": [
        {
          "target": [
            "c",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            ",",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "人才",
      "code": "rret",
      "steps": [
        {
          "target": [
            "r",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "眼睛",
      "code": "T;",
      "steps": [
        {
          "target": [
            "T",
            ";"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "物质",
      "code": "m.ye",
      "steps": [
        {
          "target": [
            "m",
            "."
          ],
          "hand": "both"
        },
        {
          "target": [
            "y",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "对手",
      "code": "vzio",
      "steps": [
        {
          "target": [
            "v",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i",
            "o"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "对话",
      "code": "vzug",
      "steps": [
        {
          "target": [
            "v",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "地点",
      "code": "VzU;",
      "steps": [
        {
          "target": [
            "V",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "U",
            ";"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "招聘",
      "code": "iu",
      "steps": [
        {
          "target": [
            "i",
            "u"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "发表",
      "code": "Yv>?",
      "steps": [
        {
          "target": [
            "Y",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            ">",
            "?"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "而言",
      "code": "Beuy",
      "steps": [
        {
          "target": [
            "B",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "放弃",
      "code": "<a",
      "steps": [
        {
          "target": [
            "<",
            "a"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "探索",
      "code": "iCER",
      "steps": [
        {
          "target": [
            "i",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "E",
            "R"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "上涨",
      "code": "xfnP",
      "steps": [
        {
          "target": [
            "x",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            "P"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "有助于",
      "code": "eq",
      "steps": [
        {
          "target": [
            "e",
            "q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "高效",
      "code": "sgZh",
      "steps": [
        {
          "target": [
            "s",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Z",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "为主",
      "code": "O<O,",
      "steps": [
        {
          "target": [
            "O",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "O",
            ","
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "事业",
      "code": "fb/y",
      "steps": [
        {
          "target": [
            "f",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "/",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "观察",
      "code": "vejI",
      "steps": [
        {
          "target": [
            "v",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j",
            "I"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "语法",
      "code": "uNnV",
      "steps": [
        {
          "target": [
            "u",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            "V"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "也会",
      "code": "zyrN",
      "steps": [
        {
          "target": [
            "z",
            "y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "N"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "元素",
      "code": "EJ",
      "steps": [
        {
          "target": [
            "E",
            "J"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "监督",
      "code": "Wcxf",
      "steps": [
        {
          "target": [
            "W",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "黄金",
      "code": "Rh",
      "steps": [
        {
          "target": [
            "R",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "导演",
      "code": "Pznj",
      "steps": [
        {
          "target": [
            "P",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "投入",
      "code": "iTVu",
      "steps": [
        {
          "target": [
            "i",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "V",
            "u"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "优点",
      "code": "a:U;",
      "steps": [
        {
          "target": [
            "a",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "U",
            ";"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "伤害",
      "code": "aK",
      "steps": [
        {
          "target": [
            "a",
            "K"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "不管",
      "code": "cbcj",
      "steps": [
        {
          "target": [
            "c",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "高考",
      "code": "sgqf",
      "steps": [
        {
          "target": [
            "s",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "出生",
      "code": "YFGs",
      "steps": [
        {
          "target": [
            "Y",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "成都",
      "code": ";AqY",
      "steps": [
        {
          "target": [
            ";",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q",
            "Y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "教授",
      "code": "qFiA",
      "steps": [
        {
          "target": [
            "q",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "查看",
      "code": "ow",
      "steps": [
        {
          "target": [
            "o",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "机场",
      "code": "oqVA",
      "steps": [
        {
          "target": [
            "o",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "V",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "同比",
      "code": "Fthh",
      "steps": [
        {
          "target": [
            "F",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "预防",
      "code": ">?Y<",
      "steps": [
        {
          "target": [
            ">",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "基本上",
      "code": "dn",
      "steps": [
        {
          "target": [
            "d",
            "n"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "百度",
      "code": "fd",
      "steps": [
        {
          "target": [
            "f",
            "d"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "参考资料",
      "code": "BqEr",
      "steps": [
        {
          "target": [
            "B",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "E",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "休息",
      "code": "ao",
      "steps": [
        {
          "target": [
            "a",
            "o"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "总统",
      "code": "XbRN",
      "steps": [
        {
          "target": [
            "X",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "R",
            "N"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "要是",
      "code": "tZwC",
      "steps": [
        {
          "target": [
            "t",
            "Z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "名称",
      "code": "SbxL",
      "steps": [
        {
          "target": [
            "S",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x",
            "L"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "心情",
      "code": ":x:>",
      "steps": [
        {
          "target": [
            ":",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":",
            ">"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "脂肪",
      "code": "Hh",
      "steps": [
        {
          "target": [
            "H",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "放松",
      "code": "<aoX",
      "steps": [
        {
          "target": [
            "<",
            "a"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "病毒",
      "code": "lf>N",
      "steps": [
        {
          "target": [
            "l",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            ">",
            "N"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "明白",
      "code": "wHdb",
      "steps": [
        {
          "target": [
            "w",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "至于",
      "code": ".ife",
      "steps": [
        {
          "target": [
            ".",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "飞机",
      "code": "kf",
      "steps": [
        {
          "target": [
            "k",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "安全性",
      "code": "jr",
      "steps": [
        {
          "target": [
            "j",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "损失",
      "code": "ibtd",
      "steps": [
        {
          "target": [
            "i",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t",
            "d"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "吃了",
      "code": "bKsl",
      "steps": [
        {
          "target": [
            "b",
            "K"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "书籍",
      "code": "AA",
      "steps": [
        {
          "target": [
            "A",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "发动机",
      "code": "YN",
      "steps": [
        {
          "target": [
            "Y",
            "N"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "适应",
      "code": "gpJn",
      "steps": [
        {
          "target": [
            "g",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J",
            "n"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "海鲜",
      "code": "nK",
      "steps": [
        {
          "target": [
            "n",
            "K"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "尊重",
      "code": ",z",
      "steps": [
        {
          "target": [
            ",",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "某些",
      "code": "oo",
      "steps": [
        {
          "target": [
            "o",
            "o"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "路线",
      "code": "sY",
      "steps": [
        {
          "target": [
            "s",
            "Y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "实验",
      "code": "jS/k",
      "steps": [
        {
          "target": [
            "j",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "/",
            "k"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "完善",
      "code": "jEQX",
      "steps": [
        {
          "target": [
            "j",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Q",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "想象",
      "code": "oT,x",
      "steps": [
        {
          "target": [
            "o",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            ",",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "提示",
      "code": "iwNs",
      "steps": [
        {
          "target": [
            "i",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "N",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "南京",
      "code": "eF",
      "steps": [
        {
          "target": [
            "e",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "原油",
      "code": "ydnB",
      "steps": [
        {
          "target": [
            "y",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            "B"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "推进",
      "code": "i,hp",
      "steps": [
        {
          "target": [
            "i",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "h",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "研发",
      "code": ".f",
      "steps": [
        {
          "target": [
            ".",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "给我",
      "code": "Rk",
      "steps": [
        {
          "target": [
            "R",
            "k"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "总结",
      "code": "XbRJ",
      "steps": [
        {
          "target": [
            "X",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "R",
            "J"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "注重",
      "code": "nOkP",
      "steps": [
        {
          "target": [
            "n",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k",
            "P"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "说话",
      "code": "uXug",
      "steps": [
        {
          "target": [
            "u",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "g"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "温度",
      "code": "nw",
      "steps": [
        {
          "target": [
            "n",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "启动",
      "code": "Qb",
      "steps": [
        {
          "target": [
            "Q",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "另一个",
      "code": "bf",
      "steps": [
        {
          "target": [
            "b",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "物品",
      "code": "m.bm",
      "steps": [
        {
          "target": [
            "m",
            "."
          ],
          "hand": "both"
        },
        {
          "target": [
            "b",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "例子",
      "code": "aJFi",
      "steps": [
        {
          "target": [
            "a",
            "J"
          ],
          "hand": "both"
        },
        {
          "target": [
            "F",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "逻辑",
      "code": "OS",
      "steps": [
        {
          "target": [
            "O",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "充分",
      "code": "NJ",
      "steps": [
        {
          "target": [
            "N",
            "J"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "有了",
      "code": "eHsl",
      "steps": [
        {
          "target": [
            "e",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "刚刚",
      "code": "FlFl",
      "steps": [
        {
          "target": [
            "F",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            "F",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "小学",
      "code": "ExMF",
      "steps": [
        {
          "target": [
            "E",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "M",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "打造",
      "code": "iGmb",
      "steps": [
        {
          "target": [
            "i",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "令人",
      "code": "kOrr",
      "steps": [
        {
          "target": [
            "k",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "球员",
      "code": ",fbG",
      "steps": [
        {
          "target": [
            ",",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b",
            "G"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "提醒",
      "code": "iwUw",
      "steps": [
        {
          "target": [
            "i",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "U",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "处于",
      "code": "/x",
      "steps": [
        {
          "target": [
            "/",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "用来",
      "code": "qyzX",
      "steps": [
        {
          "target": [
            "q",
            "y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "常用",
      "code": "MQqy",
      "steps": [
        {
          "target": [
            "M",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "信号",
      "code": "aubf",
      "steps": [
        {
          "target": [
            "a",
            "u"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "维护",
      "code": "R,",
      "steps": [
        {
          "target": [
            "R",
            ","
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "房地产",
      "code": "QV",
      "steps": [
        {
          "target": [
            "Q",
            "V"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "严格",
      "code": "f;oY",
      "steps": [
        {
          "target": [
            "f",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o",
            "Y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "充满",
      "code": "NJnp",
      "steps": [
        {
          "target": [
            "N",
            "J"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "日常",
      "code": "wrMQ",
      "steps": [
        {
          "target": [
            "w",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "M",
            "Q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "身上",
      "code": "Isxf",
      "steps": [
        {
          "target": [
            "I",
            "s"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "平衡",
      "code": "?XgL",
      "steps": [
        {
          "target": [
            "?",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g",
            "L"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "联盟",
      "code": "FRwH",
      "steps": [
        {
          "target": [
            "F",
            "R"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "资格",
      "code": "EGoY",
      "steps": [
        {
          "target": [
            "E",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o",
            "Y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "各个",
      "code": "Ygrc",
      "steps": [
        {
          "target": [
            "Y",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "绿色",
      "code": "RC",
      "steps": [
        {
          "target": [
            "R",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "读者",
      "code": "ueqz",
      "steps": [
        {
          "target": [
            "u",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "q",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "肌肉",
      "code": "Hq",
      "steps": [
        {
          "target": [
            "H",
            "q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "她的",
      "code": "Zz",
      "steps": [
        {
          "target": [
            "Z",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "电池",
      "code": "Udnz",
      "steps": [
        {
          "target": [
            "U",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "还行",
      "code": "cpgx",
      "steps": [
        {
          "target": [
            "c",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "验证",
      "code": "/k",
      "steps": [
        {
          "target": [
            "/",
            "k"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "深刻",
      "code": "nCLW",
      "steps": [
        {
          "target": [
            "n",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "L",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "第一个",
      "code": "cfr",
      "steps": [
        {
          "target": [
            "c",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r"
          ],
          "hand": "either"
        }
      ]
    },
    {
      "text": "协会",
      "code": "e<rN",
      "steps": [
        {
          "target": [
            "e",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "N"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "人体",
      "code": "rran",
      "steps": [
        {
          "target": [
            "r",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "n"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "专辑",
      "code": "EAMb",
      "steps": [
        {
          "target": [
            "E",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "M",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "明星",
      "code": "wHwG",
      "steps": [
        {
          "target": [
            "w",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w",
            "G"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "创作",
      "code": "rYaH",
      "steps": [
        {
          "target": [
            "r",
            "Y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "统一",
      "code": "RNfi",
      "steps": [
        {
          "target": [
            "R",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "其它",
      "code": "dqjh",
      "steps": [
        {
          "target": [
            "d",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "旁边",
      "code": "h<",
      "steps": [
        {
          "target": [
            "h",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "理由",
      "code": ",PBy",
      "steps": [
        {
          "target": [
            ",",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "B",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "强调",
      "code": "PbuF",
      "steps": [
        {
          "target": [
            "P",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "联合",
      "code": "FRkh",
      "steps": [
        {
          "target": [
            "F",
            "R"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "地铁",
      "code": "Vzzt",
      "steps": [
        {
          "target": [
            "V",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "具备",
      "code": "TX/D",
      "steps": [
        {
          "target": [
            "T",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "/",
            "D"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "预计",
      "code": ">?ue",
      "steps": [
        {
          "target": [
            ">",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "今日",
      "code": "kjwr",
      "steps": [
        {
          "target": [
            "k",
            "j"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "减肥",
      "code": "S;HT",
      "steps": [
        {
          "target": [
            "S",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "H",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "污染",
      "code": "nEnA",
      "steps": [
        {
          "target": [
            "n",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "竟然",
      "code": "SJ",
      "steps": [
        {
          "target": [
            "S",
            "J"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "发挥",
      "code": "YviC",
      "steps": [
        {
          "target": [
            "Y",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "困难",
      "code": "Uo",
      "steps": [
        {
          "target": [
            "U",
            "o"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "输出",
      "code": "MkYF",
      "steps": [
        {
          "target": [
            "M",
            "k"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "公告",
      "code": "XBmb",
      "steps": [
        {
          "target": [
            "X",
            "B"
          ],
          "hand": "both"
        },
        {
          "target": [
            "m",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "首次",
      "code": "XgEc",
      "steps": [
        {
          "target": [
            "X",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "E",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "隐私",
      "code": "YL",
      "steps": [
        {
          "target": [
            "Y",
            "L"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "分布",
      "code": "afAb",
      "steps": [
        {
          "target": [
            "a",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "A",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "热情",
      "code": "r;",
      "steps": [
        {
          "target": [
            "r",
            ";"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "应对",
      "code": "Jnvz",
      "steps": [
        {
          "target": [
            "J",
            "n"
          ],
          "hand": "both"
        },
        {
          "target": [
            "v",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "深入",
      "code": "nCVu",
      "steps": [
        {
          "target": [
            "n",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "V",
            "u"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "融资",
      "code": ">B",
      "steps": [
        {
          "target": [
            ">",
            "B"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "预期",
      "code": ">?dH",
      "steps": [
        {
          "target": [
            ">",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "会计",
      "code": "rNue",
      "steps": [
        {
          "target": [
            "r",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "房间",
      "code": "Q<Iw",
      "steps": [
        {
          "target": [
            "Q",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "气候",
      "code": "Dq",
      "steps": [
        {
          "target": [
            "D",
            "q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "实力",
      "code": "jS<l",
      "steps": [
        {
          "target": [
            "j",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "<",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "亚马逊",
      "code": "f/F",
      "steps": [
        {
          "target": [
            "f",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "F"
          ],
          "hand": "either"
        }
      ]
    },
    {
      "text": "论文",
      "code": "uS",
      "steps": [
        {
          "target": [
            "u",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "品种",
      "code": "bmxb",
      "steps": [
        {
          "target": [
            "b",
            "m"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "讲述",
      "code": "uh",
      "steps": [
        {
          "target": [
            "u",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "确认",
      "code": ".Lur",
      "steps": [
        {
          "target": [
            ".",
            "L"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "行情",
      "code": "gx:>",
      "steps": [
        {
          "target": [
            "g",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":",
            ">"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "地位",
      "code": "VzaC",
      "steps": [
        {
          "target": [
            "V",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "夏天",
      "code": "?/",
      "steps": [
        {
          "target": [
            "?",
            "/"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "做法",
      "code": "a/nV",
      "steps": [
        {
          "target": [
            "a",
            "/"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            "V"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "有趣",
      "code": "eHdF",
      "steps": [
        {
          "target": [
            "e",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "那样",
      "code": "AioQ",
      "steps": [
        {
          "target": [
            "A",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o",
            "Q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "鸡蛋",
      "code": "vX",
      "steps": [
        {
          "target": [
            "v",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "外观",
      "code": "Sxve",
      "steps": [
        {
          "target": [
            "S",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "v",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "上来",
      "code": "xfzX",
      "steps": [
        {
          "target": [
            "x",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "z",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "中国人",
      "code": "bU",
      "steps": [
        {
          "target": [
            "b",
            "U"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "周围",
      "code": "FJ",
      "steps": [
        {
          "target": [
            "F",
            "J"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "本科",
      "code": "nbxD",
      "steps": [
        {
          "target": [
            "n",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x",
            "D"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "最多",
      "code": "wFSS",
      "steps": [
        {
          "target": [
            "w",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "单词",
      "code": "Xw",
      "steps": [
        {
          "target": [
            "X",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "屏幕",
      "code": "yX",
      "steps": [
        {
          "target": [
            "y",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "债券",
      "code": "a>",
      "steps": [
        {
          "target": [
            "a",
            ">"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "小米",
      "code": "Exrm",
      "steps": [
        {
          "target": [
            "E",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "读书",
      "code": "ueAA",
      "steps": [
        {
          "target": [
            "u",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "A",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "饮料",
      "code": "f:rD",
      "steps": [
        {
          "target": [
            "f",
            ":"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "D"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "分配",
      "code": "afUP",
      "steps": [
        {
          "target": [
            "a",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "U",
            "P"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "点评",
      "code": "U;u?",
      "steps": [
        {
          "target": [
            "U",
            ";"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "?"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "转换",
      "code": "ME",
      "steps": [
        {
          "target": [
            "M",
            "E"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "也不",
      "code": "zycb",
      "steps": [
        {
          "target": [
            "z",
            "y"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "有时",
      "code": "eHwz",
      "steps": [
        {
          "target": [
            "e",
            "H"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "大型",
      "code": "Tdfp",
      "steps": [
        {
          "target": [
            "T",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "周末",
      "code": "FJfo",
      "steps": [
        {
          "target": [
            "F",
            "J"
          ],
          "hand": "both"
        },
        {
          "target": [
            "f",
            "o"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "适量",
      "code": "gpwf",
      "steps": [
        {
          "target": [
            "g",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "植物",
      "code": "oA",
      "steps": [
        {
          "target": [
            "o",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "亚洲",
      "code": "f/",
      "steps": [
        {
          "target": [
            "f",
            "/"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "回到",
      "code": "Ub.W",
      "steps": [
        {
          "target": [
            "U",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            ".",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "美味",
      "code": "QTbz",
      "steps": [
        {
          "target": [
            "Q",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "过度",
      "code": "zpJR",
      "steps": [
        {
          "target": [
            "z",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J",
            "R"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "缺乏",
      "code": "EWtL",
      "steps": [
        {
          "target": [
            "E",
            "W"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t",
            "L"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "办理",
      "code": "<X,P",
      "steps": [
        {
          "target": [
            "<",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            ",",
            "P"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "两年",
      "code": "YlKr",
      "steps": [
        {
          "target": [
            "Y",
            "l"
          ],
          "hand": "both"
        },
        {
          "target": [
            "K",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "流行",
      "code": "nNgx",
      "steps": [
        {
          "target": [
            "n",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "失败",
      "code": "td",
      "steps": [
        {
          "target": [
            "t",
            "d"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "装备",
      "code": "?r/D",
      "steps": [
        {
          "target": [
            "?",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "/",
            "D"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "他人",
      "code": "azrr",
      "steps": [
        {
          "target": [
            "a",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "预算",
      "code": ">?cT",
      "steps": [
        {
          "target": [
            ">",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "经理",
      "code": "Rv,P",
      "steps": [
        {
          "target": [
            "R",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            ",",
            "P"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "高级",
      "code": "sgRs",
      "steps": [
        {
          "target": [
            "s",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "R",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "太阳",
      "code": "TOYw",
      "steps": [
        {
          "target": [
            "T",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "拒绝",
      "code": "iW",
      "steps": [
        {
          "target": [
            "i",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "太空",
      "code": "TOIS",
      "steps": [
        {
          "target": [
            "T",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "不可能",
      "code": "cxB",
      "steps": [
        {
          "target": [
            "c",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "B"
          ],
          "hand": "either"
        }
      ]
    },
    {
      "text": "表演",
      "code": ">?nj",
      "steps": [
        {
          "target": [
            ">",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "农业",
      "code": "C?",
      "steps": [
        {
          "target": [
            "C",
            "?"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "难以",
      "code": "v,",
      "steps": [
        {
          "target": [
            "v",
            ","
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "强大",
      "code": "Pb",
      "steps": [
        {
          "target": [
            "P",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "重要的",
      "code": "kt",
      "steps": [
        {
          "target": [
            "k",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "第三",
      "code": "cPds",
      "steps": [
        {
          "target": [
            "c",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "让你",
      "code": "uxaL",
      "steps": [
        {
          "target": [
            "u",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "L"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "早上",
      "code": "we",
      "steps": [
        {
          "target": [
            "w",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "摄影",
      "code": "iF",
      "steps": [
        {
          "target": [
            "i",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "如今",
      "code": "Zbkj",
      "steps": [
        {
          "target": [
            "Z",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "k",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "刺激",
      "code": "oF",
      "steps": [
        {
          "target": [
            "o",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "土地",
      "code": "Vt",
      "steps": [
        {
          "target": [
            "V",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "一部分",
      "code": "fCa",
      "steps": [
        {
          "target": [
            "f",
            "C"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a"
          ],
          "hand": "either"
        }
      ]
    },
    {
      "text": "组成",
      "code": "Rq;A",
      "steps": [
        {
          "target": [
            "R",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            ";",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "规范",
      "code": "de/Y",
      "steps": [
        {
          "target": [
            "d",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "/",
            "Y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "卓越",
      "code": "xwd;",
      "steps": [
        {
          "target": [
            "x",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "d",
            ";"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "月份",
      "code": "Hy",
      "steps": [
        {
          "target": [
            "H",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "我想",
      "code": "tioT",
      "steps": [
        {
          "target": [
            "t",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "同意",
      "code": "FtS:",
      "steps": [
        {
          "target": [
            "F",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S",
            ":"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "直播",
      "code": "Azit",
      "steps": [
        {
          "target": [
            "A",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "防止",
      "code": "Y<",
      "steps": [
        {
          "target": [
            "Y",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "出了",
      "code": "YFsl",
      "steps": [
        {
          "target": [
            "Y",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s",
            "l"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "可爱",
      "code": "xkAi",
      "steps": [
        {
          "target": [
            "x",
            "k"
          ],
          "hand": "both"
        },
        {
          "target": [
            "A",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "倒是",
      "code": "a.",
      "steps": [
        {
          "target": [
            "a",
            "."
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "访问",
      "code": "u<",
      "steps": [
        {
          "target": [
            "u",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "男性",
      "code": "D<:G",
      "steps": [
        {
          "target": [
            "D",
            "<"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":",
            "G"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "智慧",
      "code": "Db>>",
      "steps": [
        {
          "target": [
            "D",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            ">",
            ">"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "不行",
      "code": "cbgx",
      "steps": [
        {
          "target": [
            "c",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "g",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "就可以",
      "code": "sx",
      "steps": [
        {
          "target": [
            "s",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "更多",
      "code": "gwSS",
      "steps": [
        {
          "target": [
            "g",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "门口",
      "code": "Im",
      "steps": [
        {
          "target": [
            "I",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "群体",
      "code": "lt",
      "steps": [
        {
          "target": [
            "l",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "又是",
      "code": "vy",
      "steps": [
        {
          "target": [
            "v",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "维生素",
      "code": "RG",
      "steps": [
        {
          "target": [
            "R",
            "G"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "份额",
      "code": "aa",
      "steps": [
        {
          "target": [
            "a",
            "a"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "感染",
      "code": ";fnA",
      "steps": [
        {
          "target": [
            ";",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "n",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "巨大",
      "code": "WW",
      "steps": [
        {
          "target": [
            "W",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "文明",
      "code": "vwwH",
      "steps": [
        {
          "target": [
            "v",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "电视剧",
      "code": "UN",
      "steps": [
        {
          "target": [
            "U",
            "N"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "人数",
      "code": "rrrZ",
      "steps": [
        {
          "target": [
            "r",
            "r"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "Z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "老人",
      "code": "qhrr",
      "steps": [
        {
          "target": [
            "q",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "r"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "差异",
      "code": "QS",
      "steps": [
        {
          "target": [
            "Q",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "标题",
      "code": "oNwC",
      "steps": [
        {
          "target": [
            "o",
            "N"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "学科",
      "code": "MFxD",
      "steps": [
        {
          "target": [
            "M",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x",
            "D"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "而已",
      "code": "BePi",
      "steps": [
        {
          "target": [
            "B",
            "e"
          ],
          "hand": "both"
        },
        {
          "target": [
            "P",
            "i"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "突破",
      "code": "IK.H",
      "steps": [
        {
          "target": [
            "I",
            "K"
          ],
          "hand": "both"
        },
        {
          "target": [
            ".",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "资讯",
      "code": "EGuA",
      "steps": [
        {
          "target": [
            "E",
            "G"
          ],
          "hand": "both"
        },
        {
          "target": [
            "u",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "英雄",
      "code": "pFeB",
      "steps": [
        {
          "target": [
            "p",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e",
            "B"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "考研",
      "code": "qf.f",
      "steps": [
        {
          "target": [
            "q",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            ".",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "对比",
      "code": "vzhh",
      "steps": [
        {
          "target": [
            "v",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "h",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "举办",
      "code": "nX<X",
      "steps": [
        {
          "target": [
            "n",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            "<",
            "X"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "特殊",
      "code": "mVJt",
      "steps": [
        {
          "target": [
            "m",
            "V"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J",
            "t"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "才能",
      "code": "etBH",
      "steps": [
        {
          "target": [
            "e",
            "t"
          ],
          "hand": "both"
        },
        {
          "target": [
            "B",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "浪费",
      "code": "nOPG",
      "steps": [
        {
          "target": [
            "n",
            "O"
          ],
          "hand": "both"
        },
        {
          "target": [
            "P",
            "G"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "指出",
      "code": "ihYF",
      "steps": [
        {
          "target": [
            "i",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "写作",
      "code": "Cf",
      "steps": [
        {
          "target": [
            "C",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "广场",
      "code": "JgVA",
      "steps": [
        {
          "target": [
            "J",
            "g"
          ],
          "hand": "both"
        },
        {
          "target": [
            "V",
            "A"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "外面",
      "code": "Sxcm",
      "steps": [
        {
          "target": [
            "S",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "c",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "印刷",
      "code": "WfyQ",
      "steps": [
        {
          "target": [
            "W",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y",
            "Q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "家居",
      "code": "jQy/",
      "steps": [
        {
          "target": [
            "j",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "y",
            "/"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "博物馆",
      "code": "em",
      "steps": [
        {
          "target": [
            "e",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "存储",
      "code": "ecau",
      "steps": [
        {
          "target": [
            "e",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "u"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "听说",
      "code": "b/",
      "steps": [
        {
          "target": [
            "b",
            "/"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "事故",
      "code": "fb/a",
      "steps": [
        {
          "target": [
            "f",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "/",
            "a"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "收藏",
      "code": "Wap;",
      "steps": [
        {
          "target": [
            "W",
            "a"
          ],
          "hand": "both"
        },
        {
          "target": [
            "p",
            ";"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "类别",
      "code": "rTb<",
      "steps": [
        {
          "target": [
            "r",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "b",
            "<"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "东京",
      "code": "tEsE",
      "steps": [
        {
          "target": [
            "t",
            "E"
          ],
          "hand": "both"
        },
        {
          "target": [
            "s",
            "E"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "重庆",
      "code": "kPJT",
      "steps": [
        {
          "target": [
            "k",
            "P"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J",
            "T"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "金额",
      "code": "zjjY",
      "steps": [
        {
          "target": [
            "z",
            "j"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j",
            "Y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "豆腐",
      "code": ">d",
      "steps": [
        {
          "target": [
            ">",
            "d"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "出版",
      "code": "YFOy",
      "steps": [
        {
          "target": [
            "Y",
            "F"
          ],
          "hand": "both"
        },
        {
          "target": [
            "O",
            "y"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "中间",
      "code": "bcIw",
      "steps": [
        {
          "target": [
            "b",
            "c"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "心态",
      "code": ":xTO",
      "steps": [
        {
          "target": [
            ":",
            "x"
          ],
          "hand": "both"
        },
        {
          "target": [
            "T",
            "O"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "编程",
      "code": "RQxb",
      "steps": [
        {
          "target": [
            "R",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "x",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "进步",
      "code": "hpII",
      "steps": [
        {
          "target": [
            "h",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I",
            "I"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "上午",
      "code": "xfKe",
      "steps": [
        {
          "target": [
            "x",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "K",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "手段",
      "code": "ioif",
      "steps": [
        {
          "target": [
            "i",
            "o"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i",
            "f"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "摘要",
      "code": "ihtZ",
      "steps": [
        {
          "target": [
            "i",
            "h"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t",
            "Z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "考生",
      "code": "qfGs",
      "steps": [
        {
          "target": [
            "q",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "联赛",
      "code": "FRjh",
      "steps": [
        {
          "target": [
            "F",
            "R"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j",
            "h"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "女士",
      "code": "Znrs",
      "steps": [
        {
          "target": [
            "Z",
            "n"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r",
            "s"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "男朋友",
      "code": "DH",
      "steps": [
        {
          "target": [
            "D",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "不敢",
      "code": "cbAF",
      "steps": [
        {
          "target": [
            "c",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "A",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "适当",
      "code": "gpEC",
      "steps": [
        {
          "target": [
            "g",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "E",
            "C"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "紧张",
      "code": "WvPu",
      "steps": [
        {
          "target": [
            "W",
            "v"
          ],
          "hand": "both"
        },
        {
          "target": [
            "P",
            "u"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "红色",
      "code": "RS",
      "steps": [
        {
          "target": [
            "R",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "美好",
      "code": "QTZF",
      "steps": [
        {
          "target": [
            "Q",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Z",
            "F"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "专门",
      "code": "EAIm",
      "steps": [
        {
          "target": [
            "E",
            "A"
          ],
          "hand": "both"
        },
        {
          "target": [
            "I",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "梦想",
      "code": "mS",
      "steps": [
        {
          "target": [
            "m",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "实时",
      "code": "jSwz",
      "steps": [
        {
          "target": [
            "j",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "维持",
      "code": "R,iV",
      "steps": [
        {
          "target": [
            "R",
            ","
          ],
          "hand": "both"
        },
        {
          "target": [
            "i",
            "V"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "可惜",
      "code": "xk:R",
      "steps": [
        {
          "target": [
            "x",
            "k"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":",
            "R"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "上升",
      "code": "xftp",
      "steps": [
        {
          "target": [
            "x",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "t",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "提到",
      "code": "iw.W",
      "steps": [
        {
          "target": [
            "i",
            "w"
          ],
          "hand": "both"
        },
        {
          "target": [
            ".",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "支撑",
      "code": ";iiM",
      "steps": [
        {
          "target": [
            ";",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "i",
            "M"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "来到",
      "code": "zX.W",
      "steps": [
        {
          "target": [
            "z",
            "X"
          ],
          "hand": "both"
        },
        {
          "target": [
            ".",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "头发",
      "code": "STYv",
      "steps": [
        {
          "target": [
            "S",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "Y",
            "v"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "原则",
      "code": "ydGW",
      "steps": [
        {
          "target": [
            "y",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "G",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "她们",
      "code": "ZzaI",
      "steps": [
        {
          "target": [
            "Z",
            "z"
          ],
          "hand": "both"
        },
        {
          "target": [
            "a",
            "I"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "近期",
      "code": "/p",
      "steps": [
        {
          "target": [
            "/",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "看见",
      "code": "iTej",
      "steps": [
        {
          "target": [
            "i",
            "T"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e",
            "j"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "通知",
      "code": "BqDb",
      "steps": [
        {
          "target": [
            "B",
            "q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "D",
            "b"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "持有",
      "code": "iVeH",
      "steps": [
        {
          "target": [
            "i",
            "V"
          ],
          "hand": "both"
        },
        {
          "target": [
            "e",
            "H"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "千万",
      "code": "kq",
      "steps": [
        {
          "target": [
            "k",
            "q"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "市民",
      "code": "ZQwm",
      "steps": [
        {
          "target": [
            "Z",
            "Q"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w",
            "m"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "农村",
      "code": "C?oz",
      "steps": [
        {
          "target": [
            "C",
            "?"
          ],
          "hand": "both"
        },
        {
          "target": [
            "o",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "迅速",
      "code": "Ae",
      "steps": [
        {
          "target": [
            "A",
            "e"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "多次",
      "code": "SSEc",
      "steps": [
        {
          "target": [
            "S",
            "S"
          ],
          "hand": "both"
        },
        {
          "target": [
            "E",
            "c"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "强烈",
      "code": "PbJW",
      "steps": [
        {
          "target": [
            "P",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "J",
            "W"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "一边",
      "code": "fi<p",
      "steps": [
        {
          "target": [
            "f",
            "i"
          ],
          "hand": "both"
        },
        {
          "target": [
            "<",
            "p"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "原文",
      "code": "ydvw",
      "steps": [
        {
          "target": [
            "y",
            "d"
          ],
          "hand": "both"
        },
        {
          "target": [
            "v",
            "w"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "事实",
      "code": "fbjS",
      "steps": [
        {
          "target": [
            "f",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "j",
            "S"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "关键词",
      "code": "Rz",
      "steps": [
        {
          "target": [
            "R",
            "z"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "内心",
      "code": "Bn:x",
      "steps": [
        {
          "target": [
            "B",
            "n"
          ],
          "hand": "both"
        },
        {
          "target": [
            ":",
            "x"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "有一个",
      "code": "efr",
      "steps": [
        {
          "target": [
            "e",
            "f"
          ],
          "hand": "both"
        },
        {
          "target": [
            "r"
          ],
          "hand": "either"
        }
      ]
    },
    {
      "text": "事项",
      "code": "fbS?",
      "steps": [
        {
          "target": [
            "f",
            "b"
          ],
          "hand": "both"
        },
        {
          "target": [
            "S",
            "?"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "自动化",
      "code": "gN",
      "steps": [
        {
          "target": [
            "g",
            "N"
          ],
          "hand": "both"
        }
      ]
    },
    {
      "text": "近日",
      "code": "/pwr",
      "steps": [
        {
          "target": [
            "/",
            "p"
          ],
          "hand": "both"
        },
        {
          "target": [
            "w",
            "r"
          ],
          "hand": "both"
        }
      ]
    }
  ]
];

// 一简字词（240 个，按词频降序）
const KM_JIAN = [
  {
    "text": "的",
    "code": "_d",
    "steps": [
      {
        "target": [
          "d"
        ],
        "hand": "left"
      }
    ],
    "weight": 92123018,
    "is_char": true
  },
  {
    "text": "是",
    "code": "_w",
    "steps": [
      {
        "target": [
          "w"
        ],
        "hand": "left"
      }
    ],
    "weight": 60632202,
    "is_char": true
  },
  {
    "text": "了",
    "code": "_s",
    "steps": [
      {
        "target": [
          "s"
        ],
        "hand": "left"
      }
    ],
    "weight": 59562863,
    "is_char": true
  },
  {
    "text": "在",
    "code": "_e",
    "steps": [
      {
        "target": [
          "e"
        ],
        "hand": "left"
      }
    ],
    "weight": 57072466,
    "is_char": true
  },
  {
    "text": "和",
    "code": "_x",
    "steps": [
      {
        "target": [
          "x"
        ],
        "hand": "left"
      }
    ],
    "weight": 46836227,
    "is_char": true
  },
  {
    "text": "我",
    "code": "_t",
    "steps": [
      {
        "target": [
          "t"
        ],
        "hand": "left"
      }
    ],
    "weight": 41082993,
    "is_char": true
  },
  {
    "text": "有",
    "code": "+e",
    "steps": [
      {
        "target": [
          "e"
        ],
        "hand": "right"
      }
    ],
    "weight": 33869044,
    "is_char": true
  },
  {
    "text": "不",
    "code": "_c",
    "steps": [
      {
        "target": [
          "c"
        ],
        "hand": "left"
      }
    ],
    "weight": 32331838,
    "is_char": true
  },
  {
    "text": "一",
    "code": "_f",
    "steps": [
      {
        "target": [
          "f"
        ],
        "hand": "left"
      }
    ],
    "weight": 27356423,
    "is_char": true
  },
  {
    "text": "就",
    "code": "+s",
    "steps": [
      {
        "target": [
          "s"
        ],
        "hand": "right"
      }
    ],
    "weight": 26406172,
    "is_char": true
  },
  {
    "text": "中",
    "code": "_b",
    "steps": [
      {
        "target": [
          "b"
        ],
        "hand": "left"
      }
    ],
    "weight": 22318111,
    "is_char": true
  },
  {
    "text": "人",
    "code": "_r",
    "steps": [
      {
        "target": [
          "r"
        ],
        "hand": "left"
      }
    ],
    "weight": 22310236,
    "is_char": true
  },
  {
    "text": "也",
    "code": "_z",
    "steps": [
      {
        "target": [
          "z"
        ],
        "hand": "left"
      }
    ],
    "weight": 22136145,
    "is_char": true
  },
  {
    "text": "很",
    "code": "_g",
    "steps": [
      {
        "target": [
          "g"
        ],
        "hand": "left"
      }
    ],
    "weight": 21847963,
    "is_char": true
  },
  {
    "text": "你",
    "code": "_a",
    "steps": [
      {
        "target": [
          "a"
        ],
        "hand": "left"
      }
    ],
    "weight": 20296787,
    "is_char": true
  },
  {
    "text": "可以",
    "code": "_x",
    "steps": [
      {
        "target": [
          "x"
        ],
        "hand": "left"
      }
    ],
    "weight": 20283603,
    "is_char": false
  },
  {
    "text": "都",
    "code": "_q",
    "steps": [
      {
        "target": [
          "q"
        ],
        "hand": "left"
      }
    ],
    "weight": 18779556,
    "is_char": true
  },
  {
    "text": "上",
    "code": "+x",
    "steps": [
      {
        "target": [
          "x"
        ],
        "hand": "right"
      }
    ],
    "weight": 17672983,
    "is_char": true
  },
  {
    "text": "会",
    "code": "+r",
    "steps": [
      {
        "target": [
          "r"
        ],
        "hand": "right"
      }
    ],
    "weight": 17543962,
    "is_char": true
  },
  {
    "text": "为",
    "code": "_O",
    "steps": [
      {
        "target": [
          "O"
        ],
        "hand": "left"
      }
    ],
    "weight": 17035133,
    "is_char": true
  },
  {
    "text": "这",
    "code": "_v",
    "steps": [
      {
        "target": [
          "v"
        ],
        "hand": "left"
      }
    ],
    "weight": 16995923,
    "is_char": true
  },
  {
    "text": "一个",
    "code": "_f",
    "steps": [
      {
        "target": [
          "f"
        ],
        "hand": "left"
      }
    ],
    "weight": 16335779,
    "is_char": false
  },
  {
    "text": "好",
    "code": "_Z",
    "steps": [
      {
        "target": [
          "Z"
        ],
        "hand": "left"
      }
    ],
    "weight": 16282831,
    "is_char": true
  },
  {
    "text": "到",
    "code": "_.",
    "steps": [
      {
        "target": [
          "."
        ],
        "hand": "left"
      }
    ],
    "weight": 14948468,
    "is_char": true
  },
  {
    "text": "对",
    "code": "+v",
    "steps": [
      {
        "target": [
          "v"
        ],
        "hand": "right"
      }
    ],
    "weight": 14880376,
    "is_char": true
  },
  {
    "text": "大",
    "code": "_T",
    "steps": [
      {
        "target": [
          "T"
        ],
        "hand": "left"
      }
    ],
    "weight": 14749051,
    "is_char": true
  },
  {
    "text": "他",
    "code": "+a",
    "steps": [
      {
        "target": [
          "a"
        ],
        "hand": "right"
      }
    ],
    "weight": 14507163,
    "is_char": true
  },
  {
    "text": "要",
    "code": "+t",
    "steps": [
      {
        "target": [
          "t"
        ],
        "hand": "right"
      }
    ],
    "weight": 13943971,
    "is_char": true
  },
  {
    "text": "多",
    "code": "_S",
    "steps": [
      {
        "target": [
          "S"
        ],
        "hand": "left"
      }
    ],
    "weight": 13521988,
    "is_char": true
  },
  {
    "text": "还",
    "code": "+c",
    "steps": [
      {
        "target": [
          "c"
        ],
        "hand": "right"
      }
    ],
    "weight": 13505104,
    "is_char": true
  },
  {
    "text": "年",
    "code": "_K",
    "steps": [
      {
        "target": [
          "K"
        ],
        "hand": "left"
      }
    ],
    "weight": 12349408,
    "is_char": true
  },
  {
    "text": "说",
    "code": "_u",
    "steps": [
      {
        "target": [
          "u"
        ],
        "hand": "left"
      }
    ],
    "weight": 12236910,
    "is_char": true
  },
  {
    "text": "去",
    "code": "_V",
    "steps": [
      {
        "target": [
          "V"
        ],
        "hand": "left"
      }
    ],
    "weight": 12095319,
    "is_char": true
  },
  {
    "text": "来",
    "code": "+z",
    "steps": [
      {
        "target": [
          "z"
        ],
        "hand": "right"
      }
    ],
    "weight": 12023272,
    "is_char": true
  },
  {
    "text": "与",
    "code": "+f",
    "steps": [
      {
        "target": [
          "f"
        ],
        "hand": "right"
      }
    ],
    "weight": 11869898,
    "is_char": true
  },
  {
    "text": "能",
    "code": "_B",
    "steps": [
      {
        "target": [
          "B"
        ],
        "hand": "left"
      }
    ],
    "weight": 11093126,
    "is_char": true
  },
  {
    "text": "自己",
    "code": "_g",
    "steps": [
      {
        "target": [
          "g"
        ],
        "hand": "left"
      }
    ],
    "weight": 10928418,
    "is_char": false
  },
  {
    "text": "后",
    "code": "_y",
    "steps": [
      {
        "target": [
          "y"
        ],
        "hand": "left"
      }
    ],
    "weight": 10787364,
    "is_char": true
  },
  {
    "text": "被",
    "code": "_?",
    "steps": [
      {
        "target": [
          "?"
        ],
        "hand": "left"
      }
    ],
    "weight": 10735161,
    "is_char": true
  },
  {
    "text": "以",
    "code": "_h",
    "steps": [
      {
        "target": [
          "h"
        ],
        "hand": "left"
      }
    ],
    "weight": 10294298,
    "is_char": true
  },
  {
    "text": "没有",
    "code": "_n",
    "steps": [
      {
        "target": [
          "n"
        ],
        "hand": "left"
      }
    ],
    "weight": 10148614,
    "is_char": false
  },
  {
    "text": "更",
    "code": "+g",
    "steps": [
      {
        "target": [
          "g"
        ],
        "hand": "right"
      }
    ],
    "weight": 10117320,
    "is_char": true
  },
  {
    "text": "将",
    "code": "+?",
    "steps": [
      {
        "target": [
          "?"
        ],
        "hand": "right"
      }
    ],
    "weight": 9976310,
    "is_char": true
  },
  {
    "text": "小",
    "code": "_E",
    "steps": [
      {
        "target": [
          "E"
        ],
        "hand": "left"
      }
    ],
    "weight": 9678711,
    "is_char": true
  },
  {
    "text": "我们",
    "code": "_t",
    "steps": [
      {
        "target": [
          "t"
        ],
        "hand": "left"
      }
    ],
    "weight": 9668711,
    "is_char": false
  },
  {
    "text": "而",
    "code": "+B",
    "steps": [
      {
        "target": [
          "B"
        ],
        "hand": "right"
      }
    ],
    "weight": 9619021,
    "is_char": true
  },
  {
    "text": "看",
    "code": "_i",
    "steps": [
      {
        "target": [
          "i"
        ],
        "hand": "left"
      }
    ],
    "weight": 9448537,
    "is_char": true
  },
  {
    "text": "这个",
    "code": "_v",
    "steps": [
      {
        "target": [
          "v"
        ],
        "hand": "left"
      }
    ],
    "weight": 9010578,
    "is_char": false
  },
  {
    "text": "问题",
    "code": "_I",
    "steps": [
      {
        "target": [
          "I"
        ],
        "hand": "left"
      }
    ],
    "weight": 8523902,
    "is_char": false
  },
  {
    "text": "用",
    "code": "+q",
    "steps": [
      {
        "target": [
          "q"
        ],
        "hand": "right"
      }
    ],
    "weight": 8356257,
    "is_char": true
  },
  {
    "text": "吃",
    "code": "+b",
    "steps": [
      {
        "target": [
          "b"
        ],
        "hand": "right"
      }
    ],
    "weight": 8181885,
    "is_char": true
  },
  {
    "text": "让",
    "code": "+u",
    "steps": [
      {
        "target": [
          "u"
        ],
        "hand": "right"
      }
    ],
    "weight": 7873961,
    "is_char": true
  },
  {
    "text": "中国",
    "code": "_b",
    "steps": [
      {
        "target": [
          "b"
        ],
        "hand": "left"
      }
    ],
    "weight": 7864575,
    "is_char": false
  },
  {
    "text": "并",
    "code": "_X",
    "steps": [
      {
        "target": [
          "X"
        ],
        "hand": "left"
      }
    ],
    "weight": 7754066,
    "is_char": true
  },
  {
    "text": "日",
    "code": "+w",
    "steps": [
      {
        "target": [
          "w"
        ],
        "hand": "right"
      }
    ],
    "weight": 7707449,
    "is_char": true
  },
  {
    "text": "不错",
    "code": "_c",
    "steps": [
      {
        "target": [
          "c"
        ],
        "hand": "left"
      }
    ],
    "weight": 7572179,
    "is_char": false
  },
  {
    "text": "什么",
    "code": "_a",
    "steps": [
      {
        "target": [
          "a"
        ],
        "hand": "left"
      }
    ],
    "weight": 7548615,
    "is_char": false
  },
  {
    "text": "地",
    "code": "+V",
    "steps": [
      {
        "target": [
          "V"
        ],
        "hand": "right"
      }
    ],
    "weight": 7522530,
    "is_char": true
  },
  {
    "text": "进行",
    "code": "_h",
    "steps": [
      {
        "target": [
          "h"
        ],
        "hand": "left"
      }
    ],
    "weight": 7405210,
    "is_char": false
  },
  {
    "text": "从",
    "code": "_m",
    "steps": [
      {
        "target": [
          "m"
        ],
        "hand": "left"
      }
    ],
    "weight": 7402629,
    "is_char": true
  },
  {
    "text": "还是",
    "code": "+c",
    "steps": [
      {
        "target": [
          "c"
        ],
        "hand": "right"
      }
    ],
    "weight": 7365741,
    "is_char": false
  },
  {
    "text": "使用",
    "code": "+a",
    "steps": [
      {
        "target": [
          "a"
        ],
        "hand": "right"
      }
    ],
    "weight": 7342956,
    "is_char": false
  },
  {
    "text": "数据",
    "code": "_r",
    "steps": [
      {
        "target": [
          "r"
        ],
        "hand": "left"
      }
    ],
    "weight": 7209667,
    "is_char": false
  },
  {
    "text": "没",
    "code": "_n",
    "steps": [
      {
        "target": [
          "n"
        ],
        "hand": "left"
      }
    ],
    "weight": 7198338,
    "is_char": true
  },
  {
    "text": "需要",
    "code": "_k",
    "steps": [
      {
        "target": [
          "k"
        ],
        "hand": "left"
      }
    ],
    "weight": 7192580,
    "is_char": false
  },
  {
    "text": "新",
    "code": "_C",
    "steps": [
      {
        "target": [
          "C"
        ],
        "hand": "left"
      }
    ],
    "weight": 7075049,
    "is_char": true
  },
  {
    "text": "里",
    "code": "_P",
    "steps": [
      {
        "target": [
          "P"
        ],
        "hand": "left"
      }
    ],
    "weight": 7046887,
    "is_char": true
  },
  {
    "text": "给",
    "code": "_R",
    "steps": [
      {
        "target": [
          "R"
        ],
        "hand": "left"
      }
    ],
    "weight": 6985613,
    "is_char": true
  },
  {
    "text": "着",
    "code": "_Q",
    "steps": [
      {
        "target": [
          "Q"
        ],
        "hand": "left"
      }
    ],
    "weight": 6919927,
    "is_char": true
  },
  {
    "text": "公司",
    "code": "_X",
    "steps": [
      {
        "target": [
          "X"
        ],
        "hand": "left"
      }
    ],
    "weight": 6807455,
    "is_char": false
  },
  {
    "text": "家",
    "code": "_j",
    "steps": [
      {
        "target": [
          "j"
        ],
        "hand": "left"
      }
    ],
    "weight": 6785887,
    "is_char": true
  },
  {
    "text": "想",
    "code": "_o",
    "steps": [
      {
        "target": [
          "o"
        ],
        "hand": "left"
      }
    ],
    "weight": 6774355,
    "is_char": true
  },
  {
    "text": "学习",
    "code": "_M",
    "steps": [
      {
        "target": [
          "M"
        ],
        "hand": "left"
      }
    ],
    "weight": 6676248,
    "is_char": false
  },
  {
    "text": "都是",
    "code": "_q",
    "steps": [
      {
        "target": [
          "q"
        ],
        "hand": "left"
      }
    ],
    "weight": 6555540,
    "is_char": false
  },
  {
    "text": "如果",
    "code": "_Z",
    "steps": [
      {
        "target": [
          "Z"
        ],
        "hand": "left"
      }
    ],
    "weight": 6548816,
    "is_char": false
  },
  {
    "text": "如何",
    "code": "+Z",
    "steps": [
      {
        "target": [
          "Z"
        ],
        "hand": "right"
      }
    ],
    "weight": 6482695,
    "is_char": false
  },
  {
    "text": "点",
    "code": "_U",
    "steps": [
      {
        "target": [
          "U"
        ],
        "hand": "left"
      }
    ],
    "weight": 6473870,
    "is_char": true
  },
  {
    "text": "时间",
    "code": "_w",
    "steps": [
      {
        "target": [
          "w"
        ],
        "hand": "left"
      }
    ],
    "weight": 6469521,
    "is_char": false
  },
  {
    "text": "出",
    "code": "_Y",
    "steps": [
      {
        "target": [
          "Y"
        ],
        "hand": "left"
      }
    ],
    "weight": 6387187,
    "is_char": true
  },
  {
    "text": "喜欢",
    "code": "_J",
    "steps": [
      {
        "target": [
          "J"
        ],
        "hand": "left"
      }
    ],
    "weight": 6240180,
    "is_char": false
  },
  {
    "text": "或",
    "code": "+U",
    "steps": [
      {
        "target": [
          "U"
        ],
        "hand": "right"
      }
    ],
    "weight": 6169701,
    "is_char": true
  },
  {
    "text": "因为",
    "code": "_U",
    "steps": [
      {
        "target": [
          "U"
        ],
        "hand": "left"
      }
    ],
    "weight": 6165763,
    "is_char": false
  },
  {
    "text": "她",
    "code": "+Z",
    "steps": [
      {
        "target": [
          "Z"
        ],
        "hand": "right"
      }
    ],
    "weight": 6159034,
    "is_char": true
  },
  {
    "text": "之",
    "code": "_L",
    "steps": [
      {
        "target": [
          "L"
        ],
        "hand": "left"
      }
    ],
    "weight": 6062185,
    "is_char": true
  },
  {
    "text": "技术",
    "code": "_i",
    "steps": [
      {
        "target": [
          "i"
        ],
        "hand": "left"
      }
    ],
    "weight": 6030657,
    "is_char": false
  },
  {
    "text": "太",
    "code": "+T",
    "steps": [
      {
        "target": [
          "T"
        ],
        "hand": "right"
      }
    ],
    "weight": 5983780,
    "is_char": true
  },
  {
    "text": "时候",
    "code": "+w",
    "steps": [
      {
        "target": [
          "w"
        ],
        "hand": "right"
      }
    ],
    "weight": 5896955,
    "is_char": false
  },
  {
    "text": "本",
    "code": "+n",
    "steps": [
      {
        "target": [
          "n"
        ],
        "hand": "right"
      }
    ],
    "weight": 5789736,
    "is_char": true
  },
  {
    "text": "年月",
    "code": "_K",
    "steps": [
      {
        "target": [
          "K"
        ],
        "hand": "left"
      }
    ],
    "weight": 5768321,
    "is_char": false
  },
  {
    "text": "把",
    "code": "+i",
    "steps": [
      {
        "target": [
          "i"
        ],
        "hand": "right"
      }
    ],
    "weight": 5538031,
    "is_char": true
  },
  {
    "text": "很多",
    "code": "+g",
    "steps": [
      {
        "target": [
          "g"
        ],
        "hand": "right"
      }
    ],
    "weight": 5401033,
    "is_char": false
  },
  {
    "text": "一些",
    "code": "+f",
    "steps": [
      {
        "target": [
          "f"
        ],
        "hand": "right"
      }
    ],
    "weight": 5318098,
    "is_char": false
  },
  {
    "text": "比较",
    "code": "+h",
    "steps": [
      {
        "target": [
          "h"
        ],
        "hand": "right"
      }
    ],
    "weight": 5311941,
    "is_char": false
  },
  {
    "text": "感觉",
    "code": "_;",
    "steps": [
      {
        "target": [
          ";"
        ],
        "hand": "left"
      }
    ],
    "weight": 5245417,
    "is_char": false
  },
  {
    "text": "通过",
    "code": "_B",
    "steps": [
      {
        "target": [
          "B"
        ],
        "hand": "left"
      }
    ],
    "weight": 5140993,
    "is_char": false
  },
  {
    "text": "选择",
    "code": "_m",
    "steps": [
      {
        "target": [
          "m"
        ],
        "hand": "left"
      }
    ],
    "weight": 5132905,
    "is_char": false
  },
  {
    "text": "比",
    "code": "+h",
    "steps": [
      {
        "target": [
          "h"
        ],
        "hand": "right"
      }
    ],
    "weight": 5115851,
    "is_char": true
  },
  {
    "text": "再",
    "code": "_,",
    "steps": [
      {
        "target": [
          ","
        ],
        "hand": "left"
      }
    ],
    "weight": 5113828,
    "is_char": true
  },
  {
    "text": "前",
    "code": "+X",
    "steps": [
      {
        "target": [
          "X"
        ],
        "hand": "right"
      }
    ],
    "weight": 5084175,
    "is_char": true
  },
  {
    "text": "现在",
    "code": "_,",
    "steps": [
      {
        "target": [
          ","
        ],
        "hand": "left"
      }
    ],
    "weight": 5066698,
    "is_char": false
  },
  {
    "text": "买",
    "code": "_A",
    "steps": [
      {
        "target": [
          "A"
        ],
        "hand": "left"
      }
    ],
    "weight": 4978201,
    "is_char": true
  },
  {
    "text": "非常",
    "code": "+t",
    "steps": [
      {
        "target": [
          "t"
        ],
        "hand": "right"
      }
    ],
    "weight": 4964668,
    "is_char": false
  },
  {
    "text": "所以",
    "code": "_Q",
    "steps": [
      {
        "target": [
          "Q"
        ],
        "hand": "left"
      }
    ],
    "weight": 4964151,
    "is_char": false
  },
  {
    "text": "也是",
    "code": "_z",
    "steps": [
      {
        "target": [
          "z"
        ],
        "hand": "left"
      }
    ],
    "weight": 4901548,
    "is_char": false
  },
  {
    "text": "那",
    "code": "+A",
    "steps": [
      {
        "target": [
          "A"
        ],
        "hand": "right"
      }
    ],
    "weight": 4881987,
    "is_char": true
  },
  {
    "text": "模型",
    "code": "_o",
    "steps": [
      {
        "target": [
          "o"
        ],
        "hand": "left"
      }
    ],
    "weight": 4841834,
    "is_char": false
  },
  {
    "text": "用户",
    "code": "+q",
    "steps": [
      {
        "target": [
          "q"
        ],
        "hand": "right"
      }
    ],
    "weight": 4809862,
    "is_char": false
  },
  {
    "text": "成",
    "code": "_;",
    "steps": [
      {
        "target": [
          ";"
        ],
        "hand": "left"
      }
    ],
    "weight": 4742894,
    "is_char": true
  },
  {
    "text": "工作",
    "code": "_S",
    "steps": [
      {
        "target": [
          "S"
        ],
        "hand": "left"
      }
    ],
    "weight": 4668059,
    "is_char": false
  },
  {
    "text": "服务",
    "code": "_H",
    "steps": [
      {
        "target": [
          "H"
        ],
        "hand": "left"
      }
    ],
    "weight": 4637118,
    "is_char": false
  },
  {
    "text": "可能",
    "code": "+x",
    "steps": [
      {
        "target": [
          "x"
        ],
        "hand": "right"
      }
    ],
    "weight": 4618850,
    "is_char": false
  },
  {
    "text": "所",
    "code": "+Q",
    "steps": [
      {
        "target": [
          "Q"
        ],
        "hand": "right"
      }
    ],
    "weight": 4498811,
    "is_char": true
  },
  {
    "text": "觉得",
    "code": "+M",
    "steps": [
      {
        "target": [
          "M"
        ],
        "hand": "right"
      }
    ],
    "weight": 4434973,
    "is_char": false
  },
  {
    "text": "元",
    "code": "+E",
    "steps": [
      {
        "target": [
          "E"
        ],
        "hand": "right"
      }
    ],
    "weight": 4430163,
    "is_char": true
  },
  {
    "text": "推荐",
    "code": "+i",
    "steps": [
      {
        "target": [
          "i"
        ],
        "hand": "right"
      }
    ],
    "weight": 4383297,
    "is_char": false
  },
  {
    "text": "发展",
    "code": "_Y",
    "steps": [
      {
        "target": [
          "Y"
        ],
        "hand": "left"
      }
    ],
    "weight": 4247505,
    "is_char": false
  },
  {
    "text": "其他",
    "code": "_d",
    "steps": [
      {
        "target": [
          "d"
        ],
        "hand": "left"
      }
    ],
    "weight": 4232475,
    "is_char": false
  },
  {
    "text": "已经",
    "code": "_P",
    "steps": [
      {
        "target": [
          "P"
        ],
        "hand": "left"
      }
    ],
    "weight": 4213416,
    "is_char": false
  },
  {
    "text": "味道",
    "code": "+b",
    "steps": [
      {
        "target": [
          "b"
        ],
        "hand": "right"
      }
    ],
    "weight": 4198857,
    "is_char": false
  },
  {
    "text": "孩子",
    "code": "_F",
    "steps": [
      {
        "target": [
          "F"
        ],
        "hand": "left"
      }
    ],
    "weight": 4181138,
    "is_char": false
  },
  {
    "text": "知道",
    "code": "_D",
    "steps": [
      {
        "target": [
          "D"
        ],
        "hand": "left"
      }
    ],
    "weight": 4137449,
    "is_char": false
  },
  {
    "text": "美国",
    "code": "+Q",
    "steps": [
      {
        "target": [
          "Q"
        ],
        "hand": "right"
      }
    ],
    "weight": 4046037,
    "is_char": false
  },
  {
    "text": "应该",
    "code": "+J",
    "steps": [
      {
        "target": [
          "J"
        ],
        "hand": "right"
      }
    ],
    "weight": 4040287,
    "is_char": false
  },
  {
    "text": "包括",
    "code": "_.",
    "steps": [
      {
        "target": [
          "."
        ],
        "hand": "left"
      }
    ],
    "weight": 3953579,
    "is_char": false
  },
  {
    "text": "这样",
    "code": "+v",
    "steps": [
      {
        "target": [
          "v"
        ],
        "hand": "right"
      }
    ],
    "weight": 3947930,
    "is_char": false
  },
  {
    "text": "产品",
    "code": "_C",
    "steps": [
      {
        "target": [
          "C"
        ],
        "hand": "left"
      }
    ],
    "weight": 3933476,
    "is_char": false
  },
  {
    "text": "大家",
    "code": "_T",
    "steps": [
      {
        "target": [
          "T"
        ],
        "hand": "left"
      }
    ],
    "weight": 3911639,
    "is_char": false
  },
  {
    "text": "月",
    "code": "_H",
    "steps": [
      {
        "target": [
          "H"
        ],
        "hand": "left"
      }
    ],
    "weight": 3827112,
    "is_char": true
  },
  {
    "text": "三",
    "code": "+d",
    "steps": [
      {
        "target": [
          "d"
        ],
        "hand": "right"
      }
    ],
    "weight": 3822743,
    "is_char": true
  },
  {
    "text": "性",
    "code": "_:",
    "steps": [
      {
        "target": [
          ":"
        ],
        "hand": "left"
      }
    ],
    "weight": 3815784,
    "is_char": true
  },
  {
    "text": "内容",
    "code": "+B",
    "steps": [
      {
        "target": [
          "B"
        ],
        "hand": "right"
      }
    ],
    "weight": 3815710,
    "is_char": false
  },
  {
    "text": "游戏",
    "code": "+n",
    "steps": [
      {
        "target": [
          "n"
        ],
        "hand": "right"
      }
    ],
    "weight": 3798262,
    "is_char": false
  },
  {
    "text": "它",
    "code": "+j",
    "steps": [
      {
        "target": [
          "j"
        ],
        "hand": "right"
      }
    ],
    "weight": 3796699,
    "is_char": true
  },
  {
    "text": "发",
    "code": "+Y",
    "steps": [
      {
        "target": [
          "Y"
        ],
        "hand": "right"
      }
    ],
    "weight": 3729106,
    "is_char": true
  },
  {
    "text": "学",
    "code": "_M",
    "steps": [
      {
        "target": [
          "M"
        ],
        "hand": "left"
      }
    ],
    "weight": 3726674,
    "is_char": true
  },
  {
    "text": "环境",
    "code": "+,",
    "steps": [
      {
        "target": [
          ","
        ],
        "hand": "right"
      }
    ],
    "weight": 3676233,
    "is_char": false
  },
  {
    "text": "车",
    "code": "+M",
    "steps": [
      {
        "target": [
          "M"
        ],
        "hand": "right"
      }
    ],
    "weight": 3637604,
    "is_char": true
  },
  {
    "text": "方法",
    "code": "_<",
    "steps": [
      {
        "target": [
          "<"
        ],
        "hand": "left"
      }
    ],
    "weight": 3614772,
    "is_char": false
  },
  {
    "text": "生活",
    "code": "_G",
    "steps": [
      {
        "target": [
          "G"
        ],
        "hand": "left"
      }
    ],
    "weight": 3596642,
    "is_char": false
  },
  {
    "text": "语言",
    "code": "_u",
    "steps": [
      {
        "target": [
          "u"
        ],
        "hand": "left"
      }
    ],
    "weight": 3505047,
    "is_char": false
  },
  {
    "text": "就是",
    "code": "_s",
    "steps": [
      {
        "target": [
          "s"
        ],
        "hand": "left"
      }
    ],
    "weight": 3487812,
    "is_char": false
  },
  {
    "text": "生",
    "code": "_G",
    "steps": [
      {
        "target": [
          "G"
        ],
        "hand": "left"
      }
    ],
    "weight": 3485393,
    "is_char": true
  },
  {
    "text": "怎么",
    "code": "+H",
    "steps": [
      {
        "target": [
          "H"
        ],
        "hand": "right"
      }
    ],
    "weight": 3384045,
    "is_char": false
  },
  {
    "text": "情况",
    "code": "_:",
    "steps": [
      {
        "target": [
          ":"
        ],
        "hand": "left"
      }
    ],
    "weight": 3369616,
    "is_char": false
  },
  {
    "text": "店",
    "code": "_J",
    "steps": [
      {
        "target": [
          "J"
        ],
        "hand": "left"
      }
    ],
    "weight": 3323107,
    "is_char": true
  },
  {
    "text": "网络",
    "code": "+F",
    "steps": [
      {
        "target": [
          "F"
        ],
        "hand": "right"
      }
    ],
    "weight": 3263266,
    "is_char": false
  },
  {
    "text": "根据",
    "code": "+o",
    "steps": [
      {
        "target": [
          "o"
        ],
        "hand": "right"
      }
    ],
    "weight": 3262367,
    "is_char": false
  },
  {
    "text": "至",
    "code": "+.",
    "steps": [
      {
        "target": [
          "."
        ],
        "hand": "right"
      }
    ],
    "weight": 3258212,
    "is_char": true
  },
  {
    "text": "真的",
    "code": "_e",
    "steps": [
      {
        "target": [
          "e"
        ],
        "hand": "left"
      }
    ],
    "weight": 3255744,
    "is_char": false
  },
  {
    "text": "设计",
    "code": "+u",
    "steps": [
      {
        "target": [
          "u"
        ],
        "hand": "right"
      }
    ],
    "weight": 3245935,
    "is_char": false
  },
  {
    "text": "发现",
    "code": "+Y",
    "steps": [
      {
        "target": [
          "Y"
        ],
        "hand": "right"
      }
    ],
    "weight": 3211778,
    "is_char": false
  },
  {
    "text": "电影",
    "code": "+U",
    "steps": [
      {
        "target": [
          "U"
        ],
        "hand": "right"
      }
    ],
    "weight": 3188492,
    "is_char": false
  },
  {
    "text": "建议",
    "code": "_l",
    "steps": [
      {
        "target": [
          "l"
        ],
        "hand": "left"
      }
    ],
    "weight": 3171878,
    "is_char": false
  },
  {
    "text": "个人",
    "code": "+r",
    "steps": [
      {
        "target": [
          "r"
        ],
        "hand": "right"
      }
    ],
    "weight": 3160814,
    "is_char": false
  },
  {
    "text": "加",
    "code": "_<",
    "steps": [
      {
        "target": [
          "<"
        ],
        "hand": "left"
      }
    ],
    "weight": 3142678,
    "is_char": true
  },
  {
    "text": "为什么",
    "code": "_O",
    "steps": [
      {
        "target": [
          "O"
        ],
        "hand": "left"
      }
    ],
    "weight": 3140065,
    "is_char": false
  },
  {
    "text": "区",
    "code": "_W",
    "steps": [
      {
        "target": [
          "W"
        ],
        "hand": "left"
      }
    ],
    "weight": 3131397,
    "is_char": true
  },
  {
    "text": "帮助",
    "code": "_>",
    "steps": [
      {
        "target": [
          ">"
        ],
        "hand": "left"
      }
    ],
    "weight": 3113612,
    "is_char": false
  },
  {
    "text": "质量",
    "code": "_y",
    "steps": [
      {
        "target": [
          "y"
        ],
        "hand": "left"
      }
    ],
    "weight": 3105983,
    "is_char": false
  },
  {
    "text": "那么",
    "code": "_A",
    "steps": [
      {
        "target": [
          "A"
        ],
        "hand": "left"
      }
    ],
    "weight": 3076658,
    "is_char": false
  },
  {
    "text": "处理",
    "code": "_/",
    "steps": [
      {
        "target": [
          "/"
        ],
        "hand": "left"
      }
    ],
    "weight": 3038446,
    "is_char": false
  },
  {
    "text": "张",
    "code": "+P",
    "steps": [
      {
        "target": [
          "P"
        ],
        "hand": "right"
      }
    ],
    "weight": 3033180,
    "is_char": true
  },
  {
    "text": "关注",
    "code": "_R",
    "steps": [
      {
        "target": [
          "R"
        ],
        "hand": "left"
      }
    ],
    "weight": 3032170,
    "is_char": false
  },
  {
    "text": "方式",
    "code": "+<",
    "steps": [
      {
        "target": [
          "<"
        ],
        "hand": "right"
      }
    ],
    "weight": 3030662,
    "is_char": false
  },
  {
    "text": "名",
    "code": "+S",
    "steps": [
      {
        "target": [
          "S"
        ],
        "hand": "right"
      }
    ],
    "weight": 2999469,
    "is_char": true
  },
  {
    "text": "主要",
    "code": "+O",
    "steps": [
      {
        "target": [
          "O"
        ],
        "hand": "right"
      }
    ],
    "weight": 2990140,
    "is_char": false
  },
  {
    "text": "了解",
    "code": "+s",
    "steps": [
      {
        "target": [
          "s"
        ],
        "hand": "right"
      }
    ],
    "weight": 2930469,
    "is_char": false
  },
  {
    "text": "世界",
    "code": "+R",
    "steps": [
      {
        "target": [
          "R"
        ],
        "hand": "right"
      }
    ],
    "weight": 2900733,
    "is_char": false
  },
  {
    "text": "部",
    "code": "+C",
    "steps": [
      {
        "target": [
          "C"
        ],
        "hand": "right"
      }
    ],
    "weight": 2869486,
    "is_char": true
  },
  {
    "text": "其实",
    "code": "+d",
    "steps": [
      {
        "target": [
          "d"
        ],
        "hand": "right"
      }
    ],
    "weight": 2851639,
    "is_char": false
  },
  {
    "text": "有点",
    "code": "+e",
    "steps": [
      {
        "target": [
          "e"
        ],
        "hand": "right"
      }
    ],
    "weight": 2732127,
    "is_char": false
  },
  {
    "text": "地方",
    "code": "_V",
    "steps": [
      {
        "target": [
          "V"
        ],
        "hand": "left"
      }
    ],
    "weight": 2723838,
    "is_char": false
  },
  {
    "text": "成为",
    "code": "+;",
    "steps": [
      {
        "target": [
          ";"
        ],
        "hand": "right"
      }
    ],
    "weight": 2704106,
    "is_char": false
  },
  {
    "text": "王",
    "code": "+,",
    "steps": [
      {
        "target": [
          ","
        ],
        "hand": "right"
      }
    ],
    "weight": 2671599,
    "is_char": true
  },
  {
    "text": "子",
    "code": "_F",
    "steps": [
      {
        "target": [
          "F"
        ],
        "hand": "left"
      }
    ],
    "weight": 2656853,
    "is_char": true
  },
  {
    "text": "专业",
    "code": "_E",
    "steps": [
      {
        "target": [
          "E"
        ],
        "hand": "left"
      }
    ],
    "weight": 2636496,
    "is_char": false
  },
  {
    "text": "重要",
    "code": "+k",
    "steps": [
      {
        "target": [
          "k"
        ],
        "hand": "right"
      }
    ],
    "weight": 2634392,
    "is_char": false
  },
  {
    "text": "此",
    "code": "_I",
    "steps": [
      {
        "target": [
          "I"
        ],
        "hand": "left"
      }
    ],
    "weight": 2595522,
    "is_char": true
  },
  {
    "text": "每",
    "code": "+K",
    "steps": [
      {
        "target": [
          "K"
        ],
        "hand": "right"
      }
    ],
    "weight": 2592394,
    "is_char": true
  },
  {
    "text": "城市",
    "code": "+V",
    "steps": [
      {
        "target": [
          "V"
        ],
        "hand": "right"
      }
    ],
    "weight": 2580552,
    "is_char": false
  },
  {
    "text": "安全",
    "code": "_j",
    "steps": [
      {
        "target": [
          "j"
        ],
        "hand": "left"
      }
    ],
    "weight": 2578914,
    "is_char": false
  },
  {
    "text": "之后",
    "code": "_L",
    "steps": [
      {
        "target": [
          "L"
        ],
        "hand": "left"
      }
    ],
    "weight": 2549017,
    "is_char": false
  },
  {
    "text": "历史",
    "code": "+y",
    "steps": [
      {
        "target": [
          "y"
        ],
        "hand": "right"
      }
    ],
    "weight": 2525336,
    "is_char": false
  },
  {
    "text": "希望",
    "code": "+l",
    "steps": [
      {
        "target": [
          "l"
        ],
        "hand": "right"
      }
    ],
    "weight": 2510322,
    "is_char": false
  },
  {
    "text": "方",
    "code": "+<",
    "steps": [
      {
        "target": [
          "<"
        ],
        "hand": "right"
      }
    ],
    "weight": 2500808,
    "is_char": true
  },
  {
    "text": "社会",
    "code": "_N",
    "steps": [
      {
        "target": [
          "N"
        ],
        "hand": "left"
      }
    ],
    "weight": 2388104,
    "is_char": false
  },
  {
    "text": "则",
    "code": "+G",
    "steps": [
      {
        "target": [
          "G"
        ],
        "hand": "right"
      }
    ],
    "weight": 2381542,
    "is_char": true
  },
  {
    "text": "菜",
    "code": "_p",
    "steps": [
      {
        "target": [
          "p"
        ],
        "hand": "left"
      }
    ],
    "weight": 2375182,
    "is_char": true
  },
  {
    "text": "网",
    "code": "+F",
    "steps": [
      {
        "target": [
          "F"
        ],
        "hand": "right"
      }
    ],
    "weight": 2368698,
    "is_char": true
  },
  {
    "text": "研究",
    "code": "+.",
    "steps": [
      {
        "target": [
          "."
        ],
        "hand": "right"
      }
    ],
    "weight": 2364278,
    "is_char": false
  },
  {
    "text": "平台",
    "code": "_?",
    "steps": [
      {
        "target": [
          "?"
        ],
        "hand": "left"
      }
    ],
    "weight": 2346342,
    "is_char": false
  },
  {
    "text": "心",
    "code": "+:",
    "steps": [
      {
        "target": [
          ":"
        ],
        "hand": "right"
      }
    ],
    "weight": 2320372,
    "is_char": true
  },
  {
    "text": "问",
    "code": "+I",
    "steps": [
      {
        "target": [
          "I"
        ],
        "hand": "right"
      }
    ],
    "weight": 2261859,
    "is_char": true
  },
  {
    "text": "实现",
    "code": "+j",
    "steps": [
      {
        "target": [
          "j"
        ],
        "hand": "right"
      }
    ],
    "weight": 2259697,
    "is_char": false
  },
  {
    "text": "线",
    "code": "+R",
    "steps": [
      {
        "target": [
          "R"
        ],
        "hand": "right"
      }
    ],
    "weight": 2245409,
    "is_char": true
  },
  {
    "text": "大学",
    "code": "+T",
    "steps": [
      {
        "target": [
          "T"
        ],
        "hand": "right"
      }
    ],
    "weight": 2239795,
    "is_char": false
  },
  {
    "text": "里面",
    "code": "+P",
    "steps": [
      {
        "target": [
          "P"
        ],
        "hand": "right"
      }
    ],
    "weight": 2209667,
    "is_char": false
  },
  {
    "text": "表示",
    "code": "+>",
    "steps": [
      {
        "target": [
          ">"
        ],
        "hand": "right"
      }
    ],
    "weight": 2205759,
    "is_char": false
  },
  {
    "text": "项目",
    "code": "+S",
    "steps": [
      {
        "target": [
          "S"
        ],
        "hand": "right"
      }
    ],
    "weight": 2172142,
    "is_char": false
  },
  {
    "text": "度",
    "code": "+J",
    "steps": [
      {
        "target": [
          "J"
        ],
        "hand": "right"
      }
    ],
    "weight": 2151683,
    "is_char": true
  },
  {
    "text": "未来",
    "code": "+z",
    "steps": [
      {
        "target": [
          "z"
        ],
        "hand": "right"
      }
    ],
    "weight": 2125156,
    "is_char": false
  },
  {
    "text": "北京",
    "code": "+?",
    "steps": [
      {
        "target": [
          "?"
        ],
        "hand": "right"
      }
    ],
    "weight": 2106604,
    "is_char": false
  },
  {
    "text": "智能",
    "code": "+D",
    "steps": [
      {
        "target": [
          "D"
        ],
        "hand": "right"
      }
    ],
    "weight": 2066939,
    "is_char": false
  },
  {
    "text": "李",
    "code": "+o",
    "steps": [
      {
        "target": [
          "o"
        ],
        "hand": "right"
      }
    ],
    "weight": 2060026,
    "is_char": true
  },
  {
    "text": "直接",
    "code": "+A",
    "steps": [
      {
        "target": [
          "A"
        ],
        "hand": "right"
      }
    ],
    "weight": 2033822,
    "is_char": false
  },
  {
    "text": "特别",
    "code": "+m",
    "steps": [
      {
        "target": [
          "m"
        ],
        "hand": "right"
      }
    ],
    "weight": 2016053,
    "is_char": false
  },
  {
    "text": "特",
    "code": "+m",
    "steps": [
      {
        "target": [
          "m"
        ],
        "hand": "right"
      }
    ],
    "weight": 1994820,
    "is_char": true
  },
  {
    "text": "重",
    "code": "_k",
    "steps": [
      {
        "target": [
          "k"
        ],
        "hand": "left"
      }
    ],
    "weight": 1985501,
    "is_char": true
  },
  {
    "text": "四",
    "code": "+O",
    "steps": [
      {
        "target": [
          "O"
        ],
        "hand": "right"
      }
    ],
    "weight": 1969564,
    "is_char": true
  },
  {
    "text": "动",
    "code": "_N",
    "steps": [
      {
        "target": [
          "N"
        ],
        "hand": "left"
      }
    ],
    "weight": 1936470,
    "is_char": true
  },
  {
    "text": "马",
    "code": "_/",
    "steps": [
      {
        "target": [
          "/"
        ],
        "hand": "left"
      }
    ],
    "weight": 1932861,
    "is_char": true
  },
  {
    "text": "故事",
    "code": "+/",
    "steps": [
      {
        "target": [
          "/"
        ],
        "hand": "right"
      }
    ],
    "weight": 1914736,
    "is_char": false
  },
  {
    "text": "获得",
    "code": "_p",
    "steps": [
      {
        "target": [
          "p"
        ],
        "hand": "left"
      }
    ],
    "weight": 1914085,
    "is_char": false
  },
  {
    "text": "原",
    "code": "+y",
    "steps": [
      {
        "target": [
          "y"
        ],
        "hand": "right"
      }
    ],
    "weight": 1885079,
    "is_char": true
  },
  {
    "text": "股",
    "code": "+H",
    "steps": [
      {
        "target": [
          "H"
        ],
        "hand": "right"
      }
    ],
    "weight": 1849177,
    "is_char": true
  },
  {
    "text": "花",
    "code": "+p",
    "steps": [
      {
        "target": [
          "p"
        ],
        "hand": "right"
      }
    ],
    "weight": 1841183,
    "is_char": true
  },
  {
    "text": "当时",
    "code": "+E",
    "steps": [
      {
        "target": [
          "E"
        ],
        "hand": "right"
      }
    ],
    "weight": 1788078,
    "is_char": false
  },
  {
    "text": "运动",
    "code": "+N",
    "steps": [
      {
        "target": [
          "N"
        ],
        "hand": "right"
      }
    ],
    "weight": 1776499,
    "is_char": false
  },
  {
    "text": "身体",
    "code": "+I",
    "steps": [
      {
        "target": [
          "I"
        ],
        "hand": "right"
      }
    ],
    "weight": 1751304,
    "is_char": false
  },
  {
    "text": "每天",
    "code": "+K",
    "steps": [
      {
        "target": [
          "K"
        ],
        "hand": "right"
      }
    ],
    "weight": 1742511,
    "is_char": false
  },
  {
    "text": "避免",
    "code": "_W",
    "steps": [
      {
        "target": [
          "W"
        ],
        "hand": "left"
      }
    ],
    "weight": 1722683,
    "is_char": false
  },
  {
    "text": "尔",
    "code": "+L",
    "steps": [
      {
        "target": [
          "L"
        ],
        "hand": "right"
      }
    ],
    "weight": 1694086,
    "is_char": true
  },
  {
    "text": "购买",
    "code": "+G",
    "steps": [
      {
        "target": [
          "G"
        ],
        "hand": "right"
      }
    ],
    "weight": 1680217,
    "is_char": false
  },
  {
    "text": "克",
    "code": "+/",
    "steps": [
      {
        "target": [
          "/"
        ],
        "hand": "right"
      }
    ],
    "weight": 1653059,
    "is_char": true
  },
  {
    "text": "新闻",
    "code": "+C",
    "steps": [
      {
        "target": [
          "C"
        ],
        "hand": "right"
      }
    ],
    "weight": 1605176,
    "is_char": false
  },
  {
    "text": "五",
    "code": "+N",
    "steps": [
      {
        "target": [
          "N"
        ],
        "hand": "right"
      }
    ],
    "weight": 1603314,
    "is_char": true
  },
  {
    "text": "合",
    "code": "+k",
    "steps": [
      {
        "target": [
          "k"
        ],
        "hand": "right"
      }
    ],
    "weight": 1601610,
    "is_char": true
  },
  {
    "text": "医疗",
    "code": "+W",
    "steps": [
      {
        "target": [
          "W"
        ],
        "hand": "right"
      }
    ],
    "weight": 1598639,
    "is_char": false
  },
  {
    "text": "之间",
    "code": "+L",
    "steps": [
      {
        "target": [
          "L"
        ],
        "hand": "right"
      }
    ],
    "weight": 1596218,
    "is_char": false
  },
  {
    "text": "感",
    "code": "+;",
    "steps": [
      {
        "target": [
          ";"
        ],
        "hand": "right"
      }
    ],
    "weight": 1497221,
    "is_char": true
  },
  {
    "text": "表",
    "code": "_>",
    "steps": [
      {
        "target": [
          ">"
        ],
        "hand": "left"
      }
    ],
    "weight": 1463941,
    "is_char": true
  },
  {
    "text": "建",
    "code": "_l",
    "steps": [
      {
        "target": [
          "l"
        ],
        "hand": "left"
      }
    ],
    "weight": 1454729,
    "is_char": true
  },
  {
    "text": "英语",
    "code": "+p",
    "steps": [
      {
        "target": [
          "p"
        ],
        "hand": "right"
      }
    ],
    "weight": 1400956,
    "is_char": false
  },
  {
    "text": "帮",
    "code": "+>",
    "steps": [
      {
        "target": [
          ">"
        ],
        "hand": "right"
      }
    ],
    "weight": 1391613,
    "is_char": true
  },
  {
    "text": "单位",
    "code": "+X",
    "steps": [
      {
        "target": [
          "X"
        ],
        "hand": "right"
      }
    ],
    "weight": 1346717,
    "is_char": false
  },
  {
    "text": "必须",
    "code": "+:",
    "steps": [
      {
        "target": [
          ":"
        ],
        "hand": "right"
      }
    ],
    "weight": 1331535,
    "is_char": false
  },
  {
    "text": "知",
    "code": "_D",
    "steps": [
      {
        "target": [
          "D"
        ],
        "hand": "left"
      }
    ],
    "weight": 1271711,
    "is_char": true
  },
  {
    "text": "男",
    "code": "+D",
    "steps": [
      {
        "target": [
          "D"
        ],
        "hand": "right"
      }
    ],
    "weight": 1263110,
    "is_char": true
  },
  {
    "text": "师",
    "code": "+W",
    "steps": [
      {
        "target": [
          "W"
        ],
        "hand": "right"
      }
    ],
    "weight": 1145106,
    "is_char": true
  },
  {
    "text": "群",
    "code": "+l",
    "steps": [
      {
        "target": [
          "l"
        ],
        "hand": "right"
      }
    ],
    "weight": 833480,
    "is_char": true
  }
];

if (typeof module !== 'undefined') {
  module.exports = { KM_CHARS, KM_WORDS, KM_JIAN };
}
