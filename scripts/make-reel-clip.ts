import { existsSync } from "fs";
import { spawnSync } from "child_process";

type Options = {
  input: string;
  output: string;
  start: string;
  duration: string;
  cropX: string;
  overlay: boolean;
  title1: string;
  title2: string;
  subtitle: string;
  tag: string;
};

const defaults: Omit<Options, "input"> = {
  output: "/private/tmp/harvest-reel-draft.mp4",
  start: "0",
  duration: "12",
  cropX: "center",
  overlay: false,
  title1: "The garden is starting",
  title2: "to show itself",
  subtitle: "One corner at a time",
  tag: "The Harvest, Witta",
};

function usage(): never {
  console.error(`Usage:
  npm run make:reel -- --input "/path/to/video.mp4" [options]

Options:
  --output "/private/tmp/reel.mp4"
  --start 16
  --duration 12
  --crop-x 1320
  --overlay true
  --title1 "The garden is starting"
  --title2 "to show itself"
  --subtitle "One corner at a time"
  --tag "The Harvest, Witta"`);
  process.exit(1);
}

function readArgs(): Options {
  const args = process.argv.slice(2);
  const values = new Map<string, string>();

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const value = args[index + 1];
    if (!value || value.startsWith("--")) usage();
    values.set(key, value);
    index += 1;
  }

  const input = values.get("input");
  if (!input) usage();

  return {
    input,
    output: values.get("output") || defaults.output,
    start: values.get("start") || defaults.start,
    duration: values.get("duration") || defaults.duration,
    cropX: values.get("crop-x") || defaults.cropX,
    overlay: values.get("overlay") === "true",
    title1: values.get("title1") || defaults.title1,
    title2: values.get("title2") || defaults.title2,
    subtitle: values.get("subtitle") || defaults.subtitle,
    tag: values.get("tag") || defaults.tag,
  };
}

function escapeDrawText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/:/g, "\\:")
    .replace(/'/g, "\\'")
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]");
}

function drawText(text: string, size: number, x: number, y: number, opacity = "1"): string {
  return [
    "drawtext=fontfile=/System/Library/Fonts/Supplemental/Arial.ttf",
    `text='${escapeDrawText(text)}'`,
    `fontcolor=white@${opacity}`,
    `fontsize=${size}`,
    `x=${x}`,
    `y=${y}`,
    "shadowcolor=black@0.45",
    "shadowx=2",
    "shadowy=2",
  ].join(":");
}

function run(command: string, args: string[]): void {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} exited with ${result.status}`);
  }
}

function main(): void {
  const options = readArgs();

  if (!existsSync(options.input)) {
    throw new Error(`Input video does not exist: ${options.input}`);
  }

  const cropX = options.cropX === "center" ? "(iw-1215)/2" : options.cropX;
  const filters = [
    `crop=1215:2160:${cropX}:0`,
    "scale=1080:1920",
    ...(options.overlay
      ? [
          "drawbox=x=0:y=0:w=iw:h=ih:color=black@0.08:t=fill",
          "drawbox=x=64:y=1240:w=952:h=430:color=black@0.44:t=fill",
          drawText(options.title1, 64, 90, 1285),
          drawText(options.title2, 64, 90, 1365),
          drawText(options.subtitle, 46, 90, 1518),
          drawText(options.tag, 32, 90, 1595, "0.82"),
        ]
      : []),
  ].join(",");

  run("ffmpeg", [
    "-hide_banner",
    "-ss",
    options.start,
    "-t",
    options.duration,
    "-i",
    options.input,
    "-vf",
    filters,
    "-an",
    "-r",
    "30",
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "21",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-y",
    options.output,
  ]);

  console.log(JSON.stringify({
    output: options.output,
    width: 1080,
    height: 1920,
    durationSeconds: Number(options.duration),
    overlay: options.overlay,
  }, null, 2));
}

main();
