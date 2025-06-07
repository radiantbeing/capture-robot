#!/usr/bin/env node
/*jslint node*/
import path from "node:path";
import {input, select} from "@inquirer/prompts";
import createCaptureRobot from "../index.js";

async function cli() {
    const robot = createCaptureRobot();

    const displayId = await select({
        choices: (await robot.listDisplays()).map((display) => ({
            name: display.name,
            value: display.id
        })),
        loop: false,
        message: "디스플레이 선택"
    });
    const totalCaptures = Number.parseInt(await input({
        default: "1",
        message: "캡처 매수"
    }));
    const captureIntervalMs = Number.parseInt(await input({
        default: 500,
        message: "캡처 간격 (ms)"
    }));
    const autoPressKey = await select({
        choices: ["right", "left", "space", "선택 안 함"],
        loop: false,
        message: "캡처 직후 자동 입력 키"
    });
    const outputPath = await input({
        default: path.resolve("./output"),
        message: "캡처 이미지 저장 경로 (경로 내 파일은 모두 삭제됨)"
    });
    robot.defineConfig({
        autoPressKey,
        captureIntervalMs,
        displayId,
        outputPath,
        totalCaptures
    });

    robot.startCapture({
        onAllCaptureComplete: () => console.log("✅ 모든 캡처가 완료되었습니다."),
        onEachCaptureComplete: (page) => console.log(`[${page}] 캡처 완료`),
        onPrepareComplete: async function () {
            const startDelayMs = 5000;
            console.log(`⏳ ${startDelayMs / 1000}초 뒤 캡처가 시작됩니다.`);
            await robot.sleep(startDelayMs);
        }
    });
}

cli();
