#!/usr/bin/env node
/*jslint node*/
import path from "node:path";
import {input, select} from "@inquirer/prompts";
import captureRobot from "../index.js";
import pause from "../src/pause.js";

async function repeat(generator) {
    const result = await generator();
    if (result !== undefined) {
        console.log(`${result.filename} 저장 완료`);
        await repeat(generator);
    }
}

async function cli() {
    let displayId;
    let totalCaptures;
    let captureIntervalMs;
    let autoPressKey;
    let outputPath;

    displayId = await select({
        choices: (await captureRobot.listDisplays()).map((display) => ({
            name: display.name,
            value: display.id
        })),
        loop: false,
        message: "디스플레이 선택"
    });
    totalCaptures = Number.parseInt(await input({
        default: "1",
        message: "캡처 매수"
    }));
    captureIntervalMs = Number.parseInt(await input({
        default: 500,
        message: "캡처 간격 (ms)"
    }));
    autoPressKey = await select({
        choices: ["right", "left", "space", "선택 안 함"],
        loop: false,
        message: "캡처 직후 자동 입력 키"
    });
    outputPath = await input({
        default: path.resolve("./output"),
        message: "캡처 이미지 저장 경로 (경로 내 파일은 모두 삭제됨)"
    });

    const startDelayMs = 5000;
    console.log(`⏳ ${startDelayMs / 1000}초 뒤 캡처가 시작됩니다.`);
    await pause(startDelayMs);

    const capture = await captureRobot({
        autoPressKey,
        captureIntervalMs,
        displayId,
        outputPath,
        totalCaptures
    });
    await repeat(capture);
    console.log("✅ 모든 캡처가 완료되었습니다.");
}

cli();

export default Object.freeze(cli);
