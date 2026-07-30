import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const websiteRoot = resolve(here, "..");
const repoRoot = resolve(websiteRoot, "..");

const snapshotPath = resolve(here, "data", "yinxing-collision-benchmark.json");
const outputPath = resolve(
  websiteRoot,
  "client",
  "src",
  "data",
  "collision-benchmark.json",
);

const SINGLE_TIERS = [300, 500, 1500, 3000, 4500, 6000];
const MULTI_TIERS = [2000, 5000, 10000, 20000, 40000, 60000];

function argumentValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function readJsonLines(path) {
  const records = new Map();
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    if (!line.trim()) continue;
    const data = JSON.parse(line);
    if (!data.name) continue;
    const full = data.full_code ?? "";
    records.set(data.name, {
      text: data.name,
      full,
      simple: data.short_code || full,
      prefix4: full.slice(0, 8),
      weight: Number(data.weight) || 0,
    });
  }
  return records;
}

function loadYinxingRecords(directory) {
  const records = new Map();
  for (const filename of ["zi.jsonl", "word.jsonl"]) {
    const path = resolve(directory, filename);
    if (!existsSync(path)) {
      throw new Error(`缺少音形测评输入：${path}`);
    }
    for (const [text, record] of readJsonLines(path)) {
      records.set(text, record);
    }
  }
  return [...records.values()];
}

function loadChunxingRecords(path) {
  const entries = new Map();
  let inBody = false;

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    if (!inBody) {
      if (line.trim() === "...") inBody = true;
      continue;
    }
    if (!line || line.startsWith("#")) continue;

    const [text, code, rawWeight] = line.split("\t");
    if (!text || !code || rawWeight === undefined) continue;

    const weight = Number.parseInt(rawWeight, 10);
    if (!Number.isFinite(weight)) continue;

    const entry = entries.get(text) ?? { text, codes: [], weight: 0 };
    entry.codes.push(code);
    entry.weight = Math.max(entry.weight, weight);
    entries.set(text, entry);
  }

  return [...entries.values()].map((entry) => ({
    text: entry.text,
    simple: entry.codes[0],
    full: entry.codes.at(-1),
    weight: entry.weight,
  }));
}

function chunxingHitCount(code, text) {
  if (code && "_+".includes(code[0])) return 1;
  if (characterLength(text) === 1) {
    return /^\[[^\]]+\]$/.test(code) ? 1 : 2;
  }
  return code.length <= 2 ? 1 : 2;
}

function yinxingHitCount(code, text) {
  if (code && "_+<>".includes(code[0])) return 1;
  if (/^![A-Za-z]{4}@$/.test(code)) return 1;

  const alphabeticLength = [...code].filter((character) =>
    /[A-Za-z]/.test(character),
  ).length;
  if (characterLength(text) === 1) {
    return alphabeticLength <= 4 ? 1 : 2;
  }
  if (alphabeticLength <= 4) return 1;
  if (alphabeticLength <= 8) return 2;
  return 3;
}

function loadYinxingPerformanceFile(path, includeZeroWeight) {
  const entries = new Map();
  let inBody = false;

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    if (!inBody) {
      if (line.trim() === "...") inBody = true;
      continue;
    }
    if (!line || line.startsWith("#")) continue;

    const [text, code, rawWeight] = line.split("\t");
    if (!text || !code || rawWeight === undefined) continue;

    const weight = Number.parseInt(rawWeight, 10);
    if (!Number.isFinite(weight)) continue;
    if (!includeZeroWeight && weight <= 0) continue;

    const entry = entries.get(text) ?? {
      text,
      fallbackHit: yinxingHitCount(code, text),
      positiveHits: [],
      weight: 0,
    };
    if (weight > 0) {
      entry.positiveHits.push(yinxingHitCount(code, text));
      entry.weight = Math.max(entry.weight, weight);
    }
    entries.set(text, entry);
  }

  return [...entries.values()].map((entry) => ({
    text: entry.text,
    weight: entry.weight,
    hit: Math.min(
      ...(entry.positiveHits.length ? entry.positiveHits : [entry.fallbackHit]),
    ),
  }));
}

function buildHitCategory(records, wordType) {
  const isSingle = wordType === "single";
  const tiers = isSingle ? SINGLE_TIERS : MULTI_TIERS;
  const ranked = records
    .filter((record) => (characterLength(record.text) === 1) === isSingle)
    .sort((left, right) => right.weight - left.weight);
  const totalWeight = ranked.reduce((sum, record) => sum + record.weight, 0);

  const countHits = (subset) => ({
    1: subset.filter((record) => record.hit === 1).length,
    2: subset.filter((record) => record.hit === 2).length,
    3: subset.filter((record) => record.hit === 3).length,
  });
  const weightedHits = {
    1: totalWeight
      ? (ranked
          .filter((record) => record.hit === 1)
          .reduce((sum, record) => sum + record.weight, 0) /
          totalWeight) *
        100
      : 0,
    2: totalWeight
      ? (ranked
          .filter((record) => record.hit === 2)
          .reduce((sum, record) => sum + record.weight, 0) /
          totalWeight) *
        100
      : 0,
    3: totalWeight
      ? (ranked
          .filter((record) => record.hit === 3)
          .reduce((sum, record) => sum + record.weight, 0) /
          totalWeight) *
        100
      : 0,
  };

  return {
    id: `${wordType}-simple`,
    label: `${isSingle ? "单字" : "多字"}·简码`,
    population: ranked.length,
    rows: [
      ...tiers.map((tier) => ({
        tier: `前${tier}`,
        weighted: false,
        hits: countHits(ranked.slice(0, tier)),
      })),
      {
        tier: "全部",
        weighted: false,
        hits: countHits(ranked),
      },
      {
        tier: "加权",
        weighted: true,
        hits: weightedHits,
      },
    ],
  };
}

function buildHitPerformance(
  chunxingRecords,
  yinxingRecords,
  yinxingChaiCategory,
) {
  const pureRecords = chunxingRecords.map((record) => ({
    text: record.text,
    weight: record.weight,
    hit: chunxingHitCount(record.simple, record.text),
  }));
  const pureCategories = [
    buildHitCategory(pureRecords, "single"),
    buildHitCategory(pureRecords, "multi"),
  ];
  const yinxingCategories = [
    buildHitCategory(yinxingRecords, "single"),
    buildHitCategory(yinxingRecords, "multi"),
  ];

  return {
    sections: pureCategories.map((pureCategory) => {
      const yinxingCategory = yinxingCategories.find(
        (category) => category.id === pureCategory.id,
      );
      if (!yinxingCategory) {
        throw new Error(`音形击数统计缺少分类：${pureCategory.id}`);
      }
      return {
        id: pureCategory.id,
        label: pureCategory.label,
        population: {
          chunxing: pureCategory.population,
          ...(pureCategory.id === "multi-simple"
            ? { yinxingChai: yinxingChaiCategory.population }
            : {}),
          yinxing: yinxingCategory.population,
        },
        rows: pureCategory.rows.map((pureRow) => {
          const yinxingRow = yinxingCategory.rows.find(
            (row) => row.tier === pureRow.tier,
          );
          if (!yinxingRow) {
            throw new Error(
              `音形击数统计缺少层级：${pureCategory.id}/${pureRow.tier}`,
            );
          }
          const yinxingChaiRow =
            pureCategory.id === "multi-simple"
              ? yinxingChaiCategory.rows.find(
                  (row) => row.tier === pureRow.tier,
                )
              : undefined;
          if (pureCategory.id === "multi-simple" && !yinxingChaiRow) {
            throw new Error(`音形 Chai 击数统计缺少层级：${pureRow.tier}`);
          }
          return {
            tier: pureRow.tier,
            weighted: pureRow.weighted,
            chunxing: pureRow.hits,
            ...(yinxingChaiRow ? { yinxingChai: yinxingChaiRow.hits } : {}),
            yinxing: yinxingRow.hits,
          };
        }),
      };
    }),
  };
}

function collectDuplicateGroups(
  records,
  codeType,
  totalWeight,
  weighted = false,
) {
  const groups = new Map();

  for (const record of records) {
    const code = record[codeType];
    if (!code) continue;
    if (
      codeType === "simple" &&
      record.branch === "yinxing" &&
      code.length < 6
    ) {
      continue;
    }
    const entries = groups.get(code) ?? [];
    entries.push(record);
    groups.set(code, entries);
  }

  const duplicates = [...groups.entries()]
    .filter(([, entries]) => entries.length > 1)
    .map(([code, entries]) => {
      const groupWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
      return {
        code,
        entries: entries.map(({ text, weight, rank }) => ({
          text,
          weight,
          rank,
        })),
        maxWeight: Math.max(...entries.map((entry) => entry.weight)),
        weightRate: totalWeight > 0 ? (groupWeight / totalWeight) * 100 : 0,
      };
    })
    .sort((left, right) =>
      weighted
        ? right.weightRate - left.weightRate
        : right.maxWeight - left.maxWeight,
    );

  return duplicates;
}

function duplicateMetric(records, codeType, totalWeight, weighted = false) {
  const duplicates = collectDuplicateGroups(
    records,
    codeType,
    totalWeight,
    weighted,
  );
  return {
    count: duplicates.length,
    rate: weighted
      ? duplicates.reduce((sum, group) => sum + group.weightRate, 0)
      : null,
  };
}

function characterLength(text) {
  return [...text].length;
}

function buildCategory(records, branch, codeType, wordType) {
  const isSingle = wordType === "single";
  const tiers = isSingle ? SINGLE_TIERS : MULTI_TIERS;
  const ranked = records
    .filter((record) => (characterLength(record.text) === 1) === isSingle)
    .sort((left, right) => right.weight - left.weight)
    .map((record, index) => ({ ...record, branch, rank: index + 1 }));
  const totalWeight = ranked.reduce((sum, record) => sum + record.weight, 0);

  const rows = tiers.map((tier) => ({
    tier: `前${tier}`,
    metric: duplicateMetric(ranked.slice(0, tier), codeType, totalWeight),
  }));
  rows.push({
    tier: "全部",
    metric: duplicateMetric(ranked, codeType, totalWeight),
  });
  rows.push({
    tier: "加权",
    metric: duplicateMetric(ranked, codeType, totalWeight, true),
  });

  return {
    id: `${wordType}-${codeType}`,
    label: `${isSingle ? "单字" : "多字"}·${
      codeType === "full" ? "全码" : codeType === "simple" ? "简码" : "前四码"
    }`,
    population: ranked.length,
    groups: collectDuplicateGroups(ranked, codeType, totalWeight).map(
      ({ maxWeight: _maxWeight, ...group }) => group,
    ),
    rows,
  };
}

function buildBranch(records, branch) {
  return {
    population: {
      single: records.filter((record) => characterLength(record.text) === 1)
        .length,
      multi: records.filter((record) => characterLength(record.text) > 1)
        .length,
    },
    categories: [
      buildCategory(records, branch, "full", "single"),
      buildCategory(records, branch, "full", "multi"),
      buildCategory(records, branch, "simple", "single"),
      buildCategory(records, branch, "simple", "multi"),
      ...(branch === "yinxing"
        ? [buildCategory(records, branch, "prefix4", "multi")]
        : []),
    ],
  };
}

const pureDictionaryPath = resolve(
  argumentValue("--pure-dict") ??
    resolve(repoRoot, "rime", "yoyo-bm.dict.yaml"),
);
if (!existsSync(pureDictionaryPath)) {
  if (existsSync(outputPath)) {
    console.log("未找到纯形字典，继续使用已打包的测评数据。");
    process.exit(0);
  }
  throw new Error(`缺少纯形字典：${pureDictionaryPath}`);
}

const yinxingJsonlDirectory = argumentValue("--yinxing-jsonl-dir");
if (yinxingJsonlDirectory) {
  const yinxingRecords = loadYinxingRecords(resolve(yinxingJsonlDirectory));
  const pureChaiWords = new Set(
    loadChunxingRecords(pureDictionaryPath)
      .filter((record) => characterLength(record.text) > 1)
      .map((record) => record.text),
  );
  const yinxingChaiWords = new Set(
    yinxingRecords
      .filter((record) => characterLength(record.text) > 1)
      .map((record) => record.text),
  );
  const missingYinxingWords = [...pureChaiWords].filter(
    (word) => !yinxingChaiWords.has(word),
  );
  if (missingYinxingWords.length) {
    throw new Error(
      `音形 Chai 数据缺少 ${missingYinxingWords.length} 个纯形测评词：${missingYinxingWords
        .slice(0, 10)
        .join("、")}`,
    );
  }
  const alignedYinxingWords = yinxingRecords.filter(
    (record) =>
      characterLength(record.text) > 1 && pureChaiWords.has(record.text),
  );
  const yinxingSnapshot = {
    ...buildBranch(yinxingRecords, "yinxing"),
    hitPerformance: {
      multi: buildHitCategory(
        alignedYinxingWords.map((record) => ({
          text: record.text,
          weight: record.weight,
          hit: yinxingHitCount(record.simple, record.text),
        })),
        "multi",
      ),
    },
  };
  mkdirSync(dirname(snapshotPath), { recursive: true });
  writeFileSync(snapshotPath, `${JSON.stringify(yinxingSnapshot, null, 2)}\n`);
  console.log("已从 JSONL 更新音形重码测评快照。");
}

if (!existsSync(snapshotPath)) {
  if (existsSync(outputPath)) {
    console.log("未找到音形测评快照，继续使用已打包的测评数据。");
    process.exit(0);
  }
  throw new Error("缺少音形重码测评快照。");
}

const yinxingCharDictionaryPath = resolve(
  argumentValue("--yinxing-char-dict") ??
    resolve(repoRoot, "rime", "yoyo-yx-char.dict.yaml"),
);
const yinxingWordDictionaryPath = resolve(
  argumentValue("--yinxing-word-dict") ??
    resolve(repoRoot, "rime", "yoyo-yx-word.dict.yaml"),
);
for (const path of [yinxingCharDictionaryPath, yinxingWordDictionaryPath]) {
  if (!existsSync(path)) {
    throw new Error(`缺少音形字典：${path}`);
  }
}

const chunxingRecords = loadChunxingRecords(pureDictionaryPath);
const chunxing = buildBranch(chunxingRecords, "chunxing");
const yinxing = JSON.parse(readFileSync(snapshotPath, "utf8"));
if (!yinxing.hitPerformance?.multi) {
  throw new Error(
    "音形测评快照缺少 Chai 击数统计，请用 --yinxing-jsonl-dir 重新生成。",
  );
}
const hitPerformance = buildHitPerformance(
  chunxingRecords,
  [
    ...loadYinxingPerformanceFile(yinxingCharDictionaryPath, true),
    ...loadYinxingPerformanceFile(yinxingWordDictionaryPath, false),
  ],
  yinxing.hitPerformance.multi,
);

const sections = chunxing.categories.map((pureCategory) => {
  const yinxingCategory = yinxing.categories.find(
    (category) => category.id === pureCategory.id,
  );
  if (!yinxingCategory) {
    throw new Error(`音形快照缺少分类：${pureCategory.id}`);
  }
  const yinxingPrefix4Category =
    pureCategory.id === "multi-simple"
      ? yinxing.categories.find((category) => category.id === "multi-prefix4")
      : null;

  return {
    id: pureCategory.id,
    label: pureCategory.label,
    population: {
      chunxing: pureCategory.population,
      yinxing: yinxingCategory.population,
    },
    groups: {
      chunxing: pureCategory.groups,
      yinxing: yinxingCategory.groups,
      ...(yinxingPrefix4Category
        ? { yinxingPrefix4: yinxingPrefix4Category.groups }
        : {}),
    },
    rows: pureCategory.rows.map((pureRow) => {
      const yinxingRow = yinxingCategory.rows.find(
        (row) => row.tier === pureRow.tier,
      );
      if (!yinxingRow) {
        throw new Error(`音形快照缺少层级：${pureCategory.id}/${pureRow.tier}`);
      }
      const yinxingPrefix4Row = yinxingPrefix4Category?.rows.find(
        (row) => row.tier === pureRow.tier,
      );
      return {
        tier: pureRow.tier,
        chunxing: pureRow.metric,
        yinxing: yinxingRow.metric,
        yinxingPrefix4: yinxingPrefix4Row?.metric ?? null,
      };
    }),
  };
});

const output = {
  schemaVersion: 1,
  unit: "重码组",
  population: {
    chunxing: chunxing.population,
    yinxing: yinxing.population,
  },
  hitPerformance,
  sections,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log("已生成纯形 / 音形重码对照数据。");
