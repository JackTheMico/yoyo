import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import rawBenchmark from "@/data/collision-benchmark.json";
import { Info } from "lucide-react";
import { useState } from "react";

type Branch = "chunxing" | "yinxing";
type BenchmarkColumn = Branch | "yinxingPrefix4";

type Metric = {
  count: number;
  rate: number | null;
};

type CollisionEntry = {
  text: string;
  weight: number;
  rank: number;
};

type CollisionGroup = {
  code: string;
  entries: CollisionEntry[];
  weightRate: number;
};

type BenchmarkSection = {
  id: string;
  label: string;
  population: Record<Branch, number>;
  groups: Record<Branch, CollisionGroup[]> & {
    yinxingPrefix4?: CollisionGroup[];
  };
  rows: Array<{
    tier: string;
    chunxing: Metric;
    yinxing: Metric;
    yinxingPrefix4: Metric | null;
  }>;
};

type HitDistribution = Record<"1" | "2" | "3", number>;
type HitColumn = "chunxing" | "yinxingChai" | "yinxing";

type HitPerformanceSection = {
  id: string;
  label: string;
  population: Record<Branch, number> & { yinxingChai?: number };
  rows: Array<{
    tier: string;
    weighted: boolean;
    chunxing: HitDistribution;
    yinxingChai?: HitDistribution;
    yinxing: HitDistribution;
  }>;
};

type BenchmarkData = {
  unit: string;
  population: Record<Branch, { single: number; multi: number }>;
  hitPerformance: {
    sections: HitPerformanceSection[];
  };
  sections: BenchmarkSection[];
};

const benchmark = rawBenchmark as BenchmarkData;
const numberFormatter = new Intl.NumberFormat("zh-CN");

function formatHitValue(value: number, weighted: boolean) {
  return weighted ? `${value.toFixed(2)}%` : numberFormatter.format(value);
}

function HitPerformanceTable({ section }: { section: HitPerformanceSection }) {
  const single = section.id === "single-simple";
  const columns: Array<{
    id: HitColumn;
    label: string;
    source?: string;
    hits: Array<"1" | "2" | "3">;
  }> = single
    ? [
        { id: "chunxing", label: "纯形·麓鸣", hits: ["1", "2"] },
        { id: "yinxing", label: "音形·呦呦", hits: ["1", "2"] },
      ]
    : [
        {
          id: "chunxing",
          label: "纯形·麓鸣",
          source: "Chai词库",
          hits: ["1", "2"],
        },
        {
          id: "yinxingChai",
          label: "音形·呦呦",
          source: "Chai词库",
          hits: ["1", "2", "3"],
        },
        {
          id: "yinxing",
          label: "音形·呦呦",
          source: "白霜词库",
          hits: ["1", "2", "3"],
        },
      ];

  return (
    <div>
      <h3 className="mb-4 px-2 font-serif text-xl font-semibold">
        {section.label}
      </h3>
      <Table
        className={`${single ? "min-w-[900px]" : "min-w-[1220px]"} border border-border`}
      >
        <TableHeader>
          <TableRow className="bg-secondary/70 hover:bg-secondary/70">
            <TableHead
              rowSpan={2}
              className="w-44 border-r border-border px-4 text-center font-semibold"
            >
              类型
            </TableHead>
            <TableHead
              rowSpan={2}
              className="w-28 border-r border-border px-4 text-center font-semibold"
            >
              层级
            </TableHead>
            {columns.map((column, columnIndex) => (
              <TableHead
                key={column.id}
                colSpan={column.hits.length}
                className={`border-b border-border text-center font-semibold ${
                  columnIndex < columns.length - 1
                    ? "border-r border-border"
                    : ""
                } ${column.id === "yinxingChai" ? "bg-foreground/[0.035]" : ""}`}
              >
                <span className="block">{column.label}</span>
                {column.source && (
                  <span className="block text-xs font-normal text-muted-foreground">
                    {column.source}
                  </span>
                )}
              </TableHead>
            ))}
          </TableRow>
          <TableRow className="bg-secondary/40 hover:bg-secondary/40">
            {columns.flatMap((column, columnIndex) =>
              column.hits.map((hit, hitIndex) => (
                <TableHead
                  key={`${column.id}-${hit}`}
                  className={`w-28 text-center ${
                    hitIndex === column.hits.length - 1 &&
                    columnIndex < columns.length - 1
                      ? "border-r border-border"
                      : ""
                  } ${
                    column.id === "yinxingChai" ? "bg-foreground/[0.035]" : ""
                  }`}
                >
                  {hit} 击
                </TableHead>
              )),
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {section.rows.map((row, rowIndex) => (
            <TableRow
              key={`hits-${section.id}-${row.tier}`}
              className={
                row.weighted ? "border-t-2 border-t-foreground/20" : ""
              }
            >
              {rowIndex === 0 && (
                <TableCell
                  rowSpan={section.rows.length}
                  className="border-r border-border px-4 align-top"
                >
                  <div className="pt-2 font-serif text-base font-semibold">
                    {section.label}
                  </div>
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {columns.map((column) => (
                      <div key={`population-${section.id}-${column.id}`}>
                        {column.label.replace(/·/g, "")}
                        {column.source ? `·${column.source}` : ""}{" "}
                        {numberFormatter.format(
                          section.population[column.id] ?? 0,
                        )}
                      </div>
                    ))}
                  </div>
                </TableCell>
              )}
              <TableCell className="border-r border-border px-4 text-center">
                {row.tier}
              </TableCell>
              {columns.flatMap((column, columnIndex) =>
                column.hits.map((hit, hitIndex) => {
                  const distribution = row[column.id];
                  const highlightChaiWeightedOneHit =
                    !single &&
                    row.weighted &&
                    column.id === "yinxingChai" &&
                    hit === "1";
                  return (
                    <TableCell
                      key={`${section.id}-${row.tier}-${column.id}-${hit}`}
                      className={`text-center font-mono ${
                        hit === "1" ? "font-semibold" : ""
                      } ${
                        hitIndex === column.hits.length - 1 &&
                        columnIndex < columns.length - 1
                          ? "border-r border-border"
                          : ""
                      } ${
                        column.id === "yinxingChai"
                          ? "bg-foreground/[0.025]"
                          : ""
                      } ${
                        highlightChaiWeightedOneHit
                          ? "font-bold text-red-600 dark:text-red-400"
                          : ""
                      }`}
                    >
                      {distribution
                        ? formatHitValue(distribution[hit], row.weighted)
                        : "—"}
                    </TableCell>
                  );
                }),
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function tierLimit(tier: string) {
  if (!tier.startsWith("前")) return Number.POSITIVE_INFINITY;
  return Number.parseInt(tier.slice(1), 10);
}

function detailsFor(
  section: BenchmarkSection,
  column: BenchmarkColumn,
  tier: string,
) {
  const limit = tierLimit(tier);
  const groups = (section.groups[column] ?? [])
    .map((group) => ({
      ...group,
      entries: group.entries.filter((entry) => entry.rank <= limit),
    }))
    .filter((group) => group.entries.length > 1);

  if (tier === "加权") {
    groups.sort((left, right) => right.weightRate - left.weightRate);
  }
  return groups;
}

function MetricCell({
  column,
  metric,
  section,
  tier,
  isLower,
}: {
  column: BenchmarkColumn;
  metric: Metric;
  section: BenchmarkSection;
  tier: string;
  isLower: boolean;
}) {
  const [open, setOpen] = useState(false);
  const weighted = tier === "加权";
  const details = open ? detailsFor(section, column, tier) : [];
  const branchName =
    column === "chunxing"
      ? "纯形·麓鸣"
      : column === "yinxing"
        ? "音形·呦呦"
        : "音形·呦呦前四码";
  const display = weighted
    ? `${(metric.rate ?? 0).toFixed(2)}%`
    : numberFormatter.format(metric.count);

  return (
    <TableCell className="text-center px-4 py-3">
      <HoverCard
        open={open}
        onOpenChange={setOpen}
        openDelay={100}
        closeDelay={120}
      >
        <HoverCardTrigger asChild>
          <button
            type="button"
            className={`group inline-flex min-w-16 items-center justify-center gap-1 border-b border-dashed border-foreground/35 py-1 font-mono text-base transition-colors hover:border-foreground ${
              isLower ? "font-bold text-foreground" : "text-foreground/70"
            }`}
            aria-label={`${branchName} ${section.label} ${tier}：${display}，查看重码详情`}
          >
            {display}
            <Info
              className="h-3.5 w-3.5 opacity-45 group-hover:opacity-80"
              aria-hidden="true"
            />
          </button>
        </HoverCardTrigger>
        <HoverCardContent
          align="center"
          sideOffset={8}
          className="w-[min(34rem,calc(100vw-2rem))] p-0"
        >
          <div className="border-b border-border p-4">
            <div className="font-serif text-lg font-semibold">
              {branchName} · {section.label} · {tier}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {weighted
                ? `加权重码率 ${display}，涉及 ${metric.count} 个重码组`
                : `${metric.count} 个重码组；同一码挂两个或更多字词计为一组`}
            </p>
          </div>

          {details.length === 0 ? (
            <p className="p-5 text-center text-sm text-muted-foreground">
              此层级没有重码。
            </p>
          ) : (
            <div className="max-h-96 overflow-y-auto overscroll-contain">
              {details.map((group) => (
                <div
                  key={group.code}
                  className="border-b border-border/70 p-4 last:border-0"
                >
                  <div className="mb-2 flex items-baseline justify-between gap-3">
                    <code className="break-all text-sm font-semibold">
                      {group.code}
                    </code>
                    {weighted && (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        权重占比 {group.weightRate.toFixed(4)}%
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {group.entries.map((entry) => (
                      <span
                        key={`${group.code}-${entry.text}`}
                        className="text-sm"
                      >
                        {entry.text}
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({numberFormatter.format(entry.weight)})
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </HoverCardContent>
      </HoverCard>
    </TableCell>
  );
}

export default function CollisionBenchmark() {
  return (
    <>
      <section
        id="collision-table"
        className="scroll-mt-20 pb-24 md:pb-32 bg-background"
      >
        <div className="container">
          <div className="ink-card p-3 md:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 px-2">
              <p className="text-sm text-muted-foreground">
                单位：重码组；加权行显示加权重码率
              </p>
              <p className="text-sm text-muted-foreground">
                数字可悬停或聚焦查看详情 · 较低值加粗 · 前四码列仅用于多字简码
              </p>
            </div>

            <Table className="min-w-[900px] border border-border">
              <TableHeader>
                <TableRow className="bg-secondary/70 hover:bg-secondary/70">
                  <TableHead
                    rowSpan={2}
                    className="w-40 border-r border-border px-4 text-center font-semibold"
                  >
                    类型
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className="w-28 border-r border-border px-4 text-center font-semibold"
                  >
                    层级
                  </TableHead>
                  <TableHead
                    colSpan={3}
                    className="border-b border-border text-center font-semibold"
                  >
                    重码
                  </TableHead>
                </TableRow>
                <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                  <TableHead className="w-48 border-r border-border text-center">
                    纯形·麓鸣
                  </TableHead>
                  <TableHead className="w-48 border-r border-border text-center">
                    音形·呦呦
                  </TableHead>
                  <TableHead className="w-52 bg-foreground/[0.03] text-center">
                    <span className="block">音形·呦呦</span>
                    <span className="block text-xs font-normal text-muted-foreground">
                      统一取前四码
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {benchmark.sections.flatMap((section, sectionIndex) =>
                  section.rows.map((row, rowIndex) => {
                    const weighted = row.tier === "加权";
                    const pureValue = weighted
                      ? (row.chunxing.rate ?? 0)
                      : row.chunxing.count;
                    const yinxingValue = weighted
                      ? (row.yinxing.rate ?? 0)
                      : row.yinxing.count;
                    const prefix4Value = row.yinxingPrefix4
                      ? weighted
                        ? (row.yinxingPrefix4.rate ?? 0)
                        : row.yinxingPrefix4.count
                      : null;
                    const lowestValue = Math.min(
                      pureValue,
                      yinxingValue,
                      ...(prefix4Value === null ? [] : [prefix4Value]),
                    );

                    return (
                      <TableRow
                        key={`${section.id}-${row.tier}`}
                        className={`${
                          sectionIndex % 2 === 0
                            ? "bg-background"
                            : "bg-secondary/20"
                        } ${weighted ? "border-t-2 border-t-foreground/20" : ""}`}
                      >
                        {rowIndex === 0 && (
                          <TableCell
                            rowSpan={section.rows.length}
                            className="border-r border-border px-4 align-top"
                          >
                            <div className="pt-2 font-serif text-base font-semibold">
                              {section.label}
                            </div>
                            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                              <div>
                                纯形{" "}
                                {numberFormatter.format(
                                  section.population.chunxing,
                                )}
                              </div>
                              <div>
                                音形{" "}
                                {numberFormatter.format(
                                  section.population.yinxing,
                                )}
                              </div>
                            </div>
                          </TableCell>
                        )}
                        <TableCell className="border-r border-border px-4 text-center">
                          {row.tier}
                        </TableCell>
                        <MetricCell
                          column="chunxing"
                          metric={row.chunxing}
                          section={section}
                          tier={row.tier}
                          isLower={pureValue === lowestValue}
                        />
                        <MetricCell
                          column="yinxing"
                          metric={row.yinxing}
                          section={section}
                          tier={row.tier}
                          isLower={yinxingValue === lowestValue}
                        />
                        {row.yinxingPrefix4 ? (
                          <MetricCell
                            column="yinxingPrefix4"
                            metric={row.yinxingPrefix4}
                            section={section}
                            tier={row.tier}
                            isLower={prefix4Value === lowestValue}
                          />
                        ) : (
                          <TableCell className="bg-foreground/[0.02] text-center text-muted-foreground">
                            —
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  }),
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <section
        id="stroke-performance"
        className="scroll-mt-20 py-24 md:py-32 bg-muted/20"
      >
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="ink-title mb-4 text-3xl sm:text-4xl md:text-5xl">
              简码击数性能
            </h2>
            <p className="mx-auto max-w-3xl leading-relaxed text-muted-foreground">
              单字统计一击、二击；词统计一击、二击、三击。普通层级显示字词数量，
              “加权”行显示对应击数覆盖的词频占比。
            </p>
          </div>

          <div className="ink-card p-3 md:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 px-2 text-sm text-muted-foreground">
              <span>Chai 组使用同一测评词库；白霜组保留发布词库结果</span>
              <span>一击列越高，表示高频内容越容易打出</span>
            </div>

            <div className="space-y-10">
              {benchmark.hitPerformance.sections.map((section) => (
                <HitPerformanceTable key={section.id} section={section} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="methodology"
        className="scroll-mt-20 py-24 md:py-28 bg-muted/30"
      >
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <h2 className="ink-title mb-8 text-center text-3xl md:text-4xl">
              测评口径
            </h2>
            <div className="ink-card space-y-4 p-6 text-sm leading-relaxed text-muted-foreground md:p-8">
              <p>
                <strong className="text-foreground">
                  重码数按编码组计算：
                </strong>
                同一个编码挂两个或更多字词，记作 1
                个重码组；悬停详情中的括号数字是词频权重。
              </p>
              <p>
                <strong className="text-foreground">音形数据：</strong>
                由“编码生成和重码可视化”脚本使用柴词库测评集生成，共
                {numberFormatter.format(
                  benchmark.population.yinxing.single,
                )}{" "}
                个单字、
                {numberFormatter.format(
                  benchmark.population.yinxing.multi,
                )}{" "}
                个多字词。
              </p>
              <p>
                <strong className="text-foreground">纯形数据：</strong>
                直接解析发布版 <code>yoyo-bm.dict.yaml</code> 的编码与权重，共
                {numberFormatter.format(
                  benchmark.population.chunxing.single,
                )}{" "}
                个单字、
                {numberFormatter.format(
                  benchmark.population.chunxing.multi,
                )}{" "}
                个多字词。
              </p>
              <p>
                <strong className="text-foreground">音形前四码：</strong>
                每个多字词都统一截取六码全码的前 4 个码元（即前 8
                个字母）再统计重码，
                不使用“只给唯一候选挂四码简码”的筛选。它衡量的是输入到第四码时，
                编码本身已经区分出多少词。
              </p>
              <p>
                <strong className="text-foreground">击数表：</strong>
                单字沿用两套发布字典。多字同时给出同一 Chai
                测评词库上的纯形与音形结果，以及发布版白霜音形词库结果：Chai
                音形共
                {numberFormatter.format(
                  benchmark.hitPerformance.sections.find(
                    (section) => section.id === "multi-simple",
                  )?.population.yinxingChai ?? 0,
                )}{" "}
                词，白霜音形仅统计带正权重、实际参与简码排序的
                {numberFormatter.format(
                  benchmark.hitPerformance.sections.find(
                    (section) => section.id === "multi-simple",
                  )?.population.yinxing ?? 0,
                )}{" "}
                词。纯形的 <code>_</code>/<code>+</code>、完整 <code>[..]</code>{" "}
                编码以及词的前两码算一击，其余最多二击；音形的 <code>_</code>/
                <code>+</code>/<code>&lt;</code>/<code>&gt;</code>、完整{" "}
                <code>!....@</code> 编码算一击，普通词编码前 4 / 8 / 12
                个字母分别对应第一 / 二 / 三击。
              </p>
              <p>
                <strong className="text-foreground">加权重码率：</strong>
                所有重码组内字词的权重之和 ÷
                当前类别全部字词的权重之和。“全部”行因两套字典覆盖量不同，
                应结合左侧样本量阅读；各“前
                N”行更适合直接横向比较。该定义沿用终端测评脚本，
                与首页只计算非首选候选负担的词重码率不是同一口径。
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
