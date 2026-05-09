import fs from "fs";
import path from "path";
import crypto from "crypto";
import { spawnSync } from "child_process";

type Message = {
  date: string;
  sender: string;
  text: string;
};

const args = process.argv.slice(2);

function argValue(name: string): string | null {
  const index = args.indexOf(name);
  if (index === -1) return null;
  return args[index + 1] || null;
}

function usage(): never {
  console.error([
    "Usage:",
    "  npm run whatsapp:debrief -- --input <chat.txt|folder|export.zip> [--out <file.md>] [--force]",
    "",
    "WhatsApp .zip exports are supported.",
  ].join("\n"));
  process.exit(1);
}

function hasFlag(name: string): boolean {
  return args.includes(name);
}

function safeName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "whatsapp-export";
}

function unzipExport(zipPath: string): string {
  const label = safeName(path.basename(zipPath, path.extname(zipPath)));
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outDir = path.resolve("docs/communications/debriefs/_whatsapp-exports", `${stamp}-${label}`);

  fs.mkdirSync(outDir, { recursive: true });

  const child = spawnSync("unzip", ["-oq", zipPath, "-d", outDir], { encoding: "utf8" });
  if (child.status !== 0) {
    throw new Error(`Failed to unzip export into ${outDir}`);
  }

  return outDir;
}

function findExportTextFile(inputPath: string): string {
  const resolved = path.resolve(inputPath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Input not found: ${resolved}`);
  }

  const stat = fs.statSync(resolved);
  if (stat.isFile()) {
    if (resolved.toLowerCase().endsWith(".zip")) {
      return findExportTextFile(unzipExport(resolved));
    }
    if (!resolved.toLowerCase().endsWith(".txt")) {
      throw new Error("Input file must be a WhatsApp .txt or .zip export.");
    }
    return resolved;
  }

  const txtFiles = fs.readdirSync(resolved)
    .filter((file) => file.toLowerCase().endsWith(".txt"))
    .map((file) => path.join(resolved, file));

  if (txtFiles.length === 0) {
    throw new Error(`No .txt export found in folder: ${resolved}`);
  }

  return txtFiles[0];
}

function cleanWhatsAppText(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/[\u200e\u200f\u202a-\u202e]/g, "")
    .replace(/\u00a0|\u202f/g, " ")
    .trim();
}

function parseLine(line: string): Omit<Message, "text"> & { text: string } | null {
  const cleanLine = cleanWhatsAppText(line);
  const patterns = [
    /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(.+?)\]\s([^:]+):\s*([\s\S]*)$/,
    /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(.+?)\s-\s([^:]+):\s*([\s\S]*)$/,
  ];

  for (const pattern of patterns) {
    const match = cleanLine.match(pattern);
    if (!match) continue;
    return {
      date: `${match[1]} ${match[2]}`,
      sender: cleanWhatsAppText(match[3]),
      text: cleanWhatsAppText(match[4]),
    };
  }

  return null;
}

function parseMessages(raw: string): Message[] {
  const messages: Message[] = [];
  const normalizedRaw = raw
    .normalize("NFKC")
    .replace(/[\u200e\u200f\u202a-\u202e]/g, "")
    .replace(/\u00a0|\u202f/g, " ")
    .replace(/(\S)\s*(?=\[\d{1,2}\/\d{1,2}\/\d{2,4},\s)/g, "$1\n");

  for (const line of normalizedRaw.split(/\r?\n/)) {
    const parsed = parseLine(line);
    if (parsed) {
      messages.push(parsed);
      continue;
    }

    const last = messages[messages.length - 1];
    const cleanLine = cleanWhatsAppText(line);
    if (last && cleanLine) {
      last.text = `${last.text}\n${cleanLine}`.trim();
    }
  }

  return messages;
}

function countBy<T extends string>(values: T[]): Map<T, number> {
  const counts = new Map<T, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return counts;
}

function topEntries<T extends string>(counts: Map<T, number>, limit: number): Array<[T, number]> {
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, limit);
}

function isMediaMessage(text: string): boolean {
  const normalized = text.toLowerCase();
  return normalized.includes("media omitted")
    || normalized.includes("attached:")
    || /\.(jpg|jpeg|png|webp|gif|mp4|mov|m4a|opus|pdf)\b/i.test(text);
}

function isMediaOnlyMessage(text: string): boolean {
  const normalized = text.toLowerCase().trim();
  return /^<?attached: .+>?$/i.test(normalized)
    || normalized === "image omitted"
    || normalized === "video omitted"
    || normalized === "audio omitted";
}

function isSignalMessage(text: string): boolean {
  const normalized = text.toLowerCase();
  return [
    "help",
    "need",
    "can bring",
    "i have",
    "photo",
    "video",
    "idea",
    "working bee",
    "garden",
    "kitchen",
    "art",
    "table",
    "chairs",
    "timber",
    "plants",
    "next",
    "weekend",
  ].some((term) => normalized.includes(term));
}

function markdownList(items: string[]): string {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : "- ";
}

function contentHash(value: string | Buffer): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function findExistingImport(hash: string, debriefDir: string): string | null {
  if (!fs.existsSync(debriefDir)) return null;

  const files = fs.readdirSync(debriefDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join(debriefDir, file));

  const matches: string[] = [];
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    if (content.includes(`Source hash: \`${hash}\``) || content.includes(`Input hash: \`${hash}\``)) {
      matches.push(file);
    }
  }

  if (matches.length === 0) return null;

  return matches.find((file) => {
    const basename = path.basename(file);
    return !/\d{4}-\d{2}-\d{2}t\d{2}-\d{2}-\d{2}/i.test(basename) && !/-debrief-seed-\d+\.md$/.test(basename);
  })
    || matches.find((file) => !/\d{4}-\d{2}-\d{2}t\d{2}-\d{2}-\d{2}/i.test(path.basename(file)))
    || matches[0];
}

function defaultOutputPath(inputFile: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const parentLabel = safeName(path.basename(path.dirname(inputFile)));
  const fileLabel = safeName(path.basename(inputFile, path.extname(inputFile)));
  const label = (fileLabel === "chat" || fileLabel === "_chat" ? parentLabel : fileLabel)
    .replace(/^\d{4}-\d{2}-\d{2}t\d{2}-\d{2}-\d{2}-\d{3}z-/, "");
  return path.join("docs/communications/debriefs", `${today}-${label}-debrief-seed.md`);
}

function nextAvailablePath(target: string): string {
  if (!fs.existsSync(target)) return target;

  const extension = path.extname(target);
  const base = target.slice(0, -extension.length);
  let index = 2;
  while (fs.existsSync(`${base}-${index}${extension}`)) {
    index += 1;
  }
  return `${base}-${index}${extension}`;
}

function buildDebrief(inputFile: string, hash: string, inputHash: string | null, messages: Message[]): string {
  const senderCounts = countBy(messages.map((message) => message.sender));
  const mediaMessages = messages.filter((message) => isMediaMessage(message.text));
  const signalMessages = messages
    .filter((message) => isSignalMessage(message.text) && !isMediaOnlyMessage(message.text))
    .slice(-25);
  const recentMessages = messages.slice(-30);
  const today = new Date().toISOString().slice(0, 10);

  return `# WhatsApp Weekend Debrief Seed - ${today}

Source export:

\`\`\`text
${inputFile}
\`\`\`

Source hash: \`${hash}\`
${inputHash && inputHash !== hash ? `Input hash: \`${inputHash}\`\n` : ""}

## Quick Read

- Messages parsed: ${messages.length}
- Media-like messages found: ${mediaMessages.length}
- First message: ${messages[0]?.date || ""}
- Last message: ${messages[messages.length - 1]?.date || ""}

## Main Voices

${topEntries(senderCounts, 10).map(([sender, count]) => `- ${sender}: ${count}`).join("\n") || "- "}

## WhatsApp Notes

Paste this section into the weekend debrief and edit it down.

### Possible Story Sparks

${markdownList(signalMessages.map((message) => `${message.sender}: ${message.text.replace(/\n/g, " ")}`))}

### Media To Check

${markdownList(mediaMessages.map((message) => `${message.date} - ${message.sender}: ${message.text.replace(/\n/g, " ")}`))}

### Recent Conversation Tail

${markdownList(recentMessages.map((message) => `${message.sender}: ${message.text.replace(/\n/g, " ")}`))}

## Permission Status

- Internal only:
- Paraphrase only:
- Quote approved:
- Image approved:
- Needs follow-up:

## Agent Instructions

Turn this into:

1. The center of the week.
2. Three to five post ideas.
3. One first reel to edit.
4. Any permission risks.
5. What to repeat next week.
`;
}

const input = argValue("--input");
if (!input) usage();

const requestedInput = path.resolve(input);
const debriefDir = path.resolve("docs/communications/debriefs");
const inputHash = fs.existsSync(requestedInput) && fs.statSync(requestedInput).isFile()
  ? contentHash(fs.readFileSync(requestedInput))
  : null;
const existingInput = inputHash ? findExistingImport(inputHash, debriefDir) : null;

if (existingInput && !hasFlag("--force")) {
  console.log(JSON.stringify({
    input: requestedInput,
    output: path.resolve(existingInput),
    skipped: true,
    reason: "Input export already imported. Use --force to create another debrief.",
  }, null, 2));
  process.exit(0);
}

const inputFile = findExportTextFile(input);
const raw = fs.readFileSync(inputFile, "utf8");
const hash = contentHash(raw);
const messages = parseMessages(raw);

if (messages.length === 0) {
  throw new Error("No WhatsApp messages parsed. The export format may be different.");
}

const existing = findExistingImport(hash, debriefDir);

if (existing && !hasFlag("--force")) {
  console.log(JSON.stringify({
    input: inputFile,
    output: path.resolve(existing),
    messages: messages.length,
    skipped: true,
    reason: "Source export already imported. Use --force to create another debrief.",
  }, null, 2));
  process.exit(0);
}

const requestedOut = argValue("--out");
const out = path.resolve(requestedOut || nextAvailablePath(defaultOutputPath(inputFile)));
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, buildDebrief(inputFile, hash, inputHash, messages));

console.log(JSON.stringify({
  input: inputFile,
  output: out,
  messages: messages.length,
  skipped: false,
}, null, 2));
