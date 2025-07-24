#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { Command } from "commander";
import CaptureRobot, { type PressableKey } from "../src/index.js";

interface CaptureOptions {
    count: string;
    delay: string;
    monitor: string;
    interval: string;
    key: string;
    output: string;
    overwrite: boolean;
}

const monitors = CaptureRobot.getAllMonitors();
const pressableKeys = CaptureRobot.pressableKeys;

// 인식된 모니터가 존재하지 않으면 프로그램을 조기 종료합니다.
if (monitors.length === 0) {
    console.error(
        "No monitors detected. This tool requires a display environment."
    );
    process.exit(1);
}

function createOutputDir(path: string, overwrite: boolean): void {
    if (fs.existsSync(path)) {
        if (overwrite) {
            return;
        }
        if (fs.readdirSync(path).length > 0) {
            throw new Error(
                `Output directory '${path}' must be empty. ` +
                    "Use --overwrite to allow overwriting."
            );
        }
    }
    fs.mkdirSync(path);
}

function createFileName(index: number, total: number): string {
    const totalDigits = total.toString().length;
    const paddedIndex = index.toString().padStart(totalDigits, "0");
    return `${paddedIndex}.png`;
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const program = new Command();

program
    .name("capture-robot")
    .description("Screenshot capture automation tool")
    .version("0.0.3");

// 인식된 모니터 목록을 조회하는 명령어를 등록합니다.
program
    .command("monitors")
    .description("List available monitors")
    .action(function () {
        console.log(
            "Available monitors:\n" +
                monitors
                    .map((m) => `[ID: ${m.id.toString()}] ${m.name}`)
                    .join("\n")
        );
    });

// 캡처를 시작하는 명령어를 등록합니다.
program
    .command("start")
    .description("Start screenshot capture")
    .option("-c, --count <number>", "Number of screenshots to capture", "1")
    .option(
        "-d, --delay <number>",
        "Delay before starting capture (ms)",
        "5000"
    )
    .option(
        "-m, --monitor <number>",
        "Monitor ID to capture",
        (CaptureRobot.getPrimaryMonitor()?.id ?? monitors[0].id).toString()
    )
    .option("-i, --interval <number>", "Interval between captures (ms)", "500")
    .option(
        "-k, --key <key>",
        `Key to press after each capture. Choices: ${pressableKeys.join(", ")}`,
        "right"
    )
    .option(
        "-o, --output <path>",
        "Output directory for captured screenshots",
        path.join(process.cwd(), "screenshots")
    )
    .option(
        "--overwrite",
        "Allow overwriting the output directory if it is not empty",
        false
    )
    .action(async (options: CaptureOptions) => {
        // 옵션을 파싱합니다.
        const count = parseInt(options.count, 10);
        const delay = parseInt(options.delay, 10);
        const monitor = parseInt(options.monitor, 10);
        const interval = parseInt(options.interval, 10);
        const { key, output, overwrite } = options;

        // 옵션의 유효성을 검증합니다.
        if (count < 0) {
            throw new Error("count must be 0 or greater.");
        }
        if (delay < 0) {
            throw new Error("delay must be 0 or greater.");
        }
        if (!monitors.some((m) => m.id === monitor)) {
            throw new Error(
                `monitor must be one of: [${monitors.map((m) => m.id).join(", ")}]`
            );
        }
        if (interval < 0) {
            throw new Error("interval must be 0 or greater.");
        }
        if (output === "") {
            throw new Error("output cannot be empty.");
        }

        function isPressableKey(k: string): k is PressableKey {
            return pressableKeys.some((validKey) => validKey === k);
        }

        if (!isPressableKey(key)) {
            throw new Error(
                `key must be one of: [${pressableKeys.join(", ")}]`
            );
        }

        try {
            const robot = new CaptureRobot(monitor, key);

            createOutputDir(output, overwrite);
            console.log(`Output directory ready: ${output}`);

            console.log(
                `Starting capture after ${(delay / 1000).toString()}s delay...`
            );
            await sleep(delay);

            for (let i = 0; i < count; i += 1) {
                const buffer = robot.captureImage();
                fs.writeFileSync(
                    path.join(output, createFileName(i, count)),
                    buffer
                );
                console.log(
                    `Captured ${(i + 1).toString()}/${count.toString()}`
                );
                robot.pressKey();
                await sleep(interval);
            }

            console.log(`All ${count.toString()} captures completed.`);
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    });

// 명령어가 없으면 도움말을 표시합니다.
if (process.argv.length <= 2) {
    program.help();
}

program.parse();
