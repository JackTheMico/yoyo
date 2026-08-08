import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const websiteRoot = resolve(here, "..");
const repoRoot = resolve(websiteRoot, "..");
const publicRoot = resolve(websiteRoot, "client", "public");
const publicYx = resolve(publicRoot, "yx");

const practiceRoot = resolve(repoRoot, "practice_tool");
const zigenRoot = resolve(repoRoot, "zigen_table");

const sourceRequirements = [
  resolve(practiceRoot, "practice-yx.html"),
  resolve(practiceRoot, "style.css"),
  resolve(practiceRoot, "yx_data_module.js"),
  resolve(practiceRoot, "yx_practice.js"),
  resolve(zigenRoot, "zigen_table-yx.html"),
  resolve(zigenRoot, "ChaiPUA-0.2.7.ttf"),
  resolve(zigenRoot, "char_images"),
];

if (sourceRequirements.some((path) => !existsSync(path))) {
  const bundledRequirements = [
    resolve(publicYx, "practice.html"),
    resolve(publicYx, "yx_data_module.js"),
    resolve(publicYx, "yx_practice.js"),
    resolve(publicYx, "zigen-table.html"),
    resolve(publicYx, "ChaiPUA-0.2.7.ttf"),
    resolve(publicRoot, "char_images"),
  ];
  if (bundledRequirements.every((path) => existsSync(path))) {
    console.log("未找到仓库上游目录，继续使用已打包的音形静态资源。");
    process.exit(0);
  }
  throw new Error("音形源文件与已打包资源均不完整，无法启动网站。");
}

mkdirSync(publicYx, { recursive: true });
mkdirSync(resolve(publicRoot, "char_images"), { recursive: true });

function copy(source, target) {
  copyFileSync(resolve(source), resolve(target));
}

function replaceRequired(text, search, replacement, sourceName) {
  if (!text.includes(search)) {
    throw new Error(`${sourceName} 中缺少预期路径：${search}`);
  }
  return text.replaceAll(search, replacement);
}

const practiceResizeBridge = `
<script>
  function sendYxPracticeHeight() {
    window.parent.postMessage(
      { type: "yx-practice-height", height: document.documentElement.scrollHeight },
      "*"
    );
  }
  window.addEventListener("load", sendYxPracticeHeight);
  window.addEventListener("resize", sendYxPracticeHeight);
  new ResizeObserver(sendYxPracticeHeight).observe(document.body);
</script>
`;

let practiceHtml = readFileSync(
  resolve(practiceRoot, "practice-yx.html"),
  "utf8",
);
practiceHtml = practiceHtml.replace(
  "</body>",
  `${practiceResizeBridge}</body>`,
);
writeFileSync(resolve(publicYx, "practice.html"), practiceHtml);

copy(
  resolve(practiceRoot, "yx_practice.js"),
  resolve(publicYx, "yx_practice.js"),
);

copy(
  resolve(practiceRoot, "yx_data_module.js"),
  resolve(publicYx, "yx_data_module.js"),
);
copy(resolve(practiceRoot, "style.css"), resolve(publicYx, "style.css"));

const zigenResizeBridge = `
<script>
  function sendYxZigenHeight() {
    window.parent.postMessage(
      { type: "yx-zigen-height", height: document.documentElement.scrollHeight },
      "*"
    );
  }
  window.addEventListener("load", sendYxZigenHeight);
  window.addEventListener("resize", sendYxZigenHeight);
  new ResizeObserver(sendYxZigenHeight).observe(document.body);
</script>
`;

let zigenHtml = readFileSync(
  resolve(zigenRoot, "zigen_table-yx.html"),
  "utf8",
);
zigenHtml = replaceRequired(
  zigenHtml,
  'src="char_images/',
  'src="../char_images/',
  "zigen_table-yx.html",
);
zigenHtml = zigenHtml.replace("</body>", `${zigenResizeBridge}</body>`);
writeFileSync(resolve(publicYx, "zigen-table.html"), zigenHtml);

copy(
  resolve(zigenRoot, "ChaiPUA-0.2.7.ttf"),
  resolve(publicYx, "ChaiPUA-0.2.7.ttf"),
);

const sourceImages = resolve(zigenRoot, "char_images");
const publicImages = resolve(publicRoot, "char_images");
for (const filename of readdirSync(sourceImages)) {
  if (filename.endsWith(".png")) {
    copy(resolve(sourceImages, filename), resolve(publicImages, filename));
  }
}

console.log("已同步音形字根表、并击练习与共用字根图片。");
