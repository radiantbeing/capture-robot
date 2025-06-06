#!/usr/bin/env node
/*jslint node*/
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {input, select} from "@inquirer/prompts";
import screenshot from "screenshot-desktop";
import robot from "robotjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function captureRobot() {
    let displayId = 0;
    let totalCaptures = 0;
    let captureIntervalMs = 500;
    let autoPressKey = "right";
    let outputPath = path.join(__dirname, "output");

    async function listDisplays() {
        return await screenshot.listDisplays();
    }

    function defineConfig(config) {
        displayId = config.displayId ?? displayId;
        totalCaptures = config.totalCaptures ?? totalCaptures;
        captureIntervalMs = config.captureIntervalMs ?? captureIntervalMs;
        autoPressKey = config.autoPressKey ?? autoPressKey;
        outputPath = config.outputPath ?? outputPath;
    }

    async function initializeDirectory(directoryPath) {

// 캡처된 이미지를 저장할 출력 디렉터리를 초기화합니다.

        await fs.promises.mkdir(directoryPath, {recursive: true});

// fs.promises.mkdir 메서드의 두 번째 매개변수에 전달된 옵션 객체의 recursive 프로퍼티가 true로 설정되어 있어,
// 디렉터리가 이미 존재하는 경우에도 예외가 발생하지 않습니다. 따라서 디렉터리 내에 이미 존재할 수 있는 파일을 식별하여 삭제합니다.

        const files = await fs.promises.readdir(directoryPath);
        files.forEach(async function (file) {
            const filePath = path.join(directoryPath, file);
            await fs.promises.rm(filePath, {recursive: true});
        });
    }

    function pressKey(key) {
        robot.keyTap(key);
    }

    async function saveImage(filePath, buffer) {
        await fs.promises.writeFile(filePath, buffer);
    }

    function sleep(delay) {
        return new Promise((resolve) => setTimeout(resolve, delay));
    }

    async function prepareCapture() {
        await initializeDirectory(outputPath);
    }

    async function startCapture({
        onAllCaptureComplete,
        onEachCaptureComplete,
        onPrepareComplete
    }) {
        const validKeys = new Set(["right", "left", "space"]);

        await prepareCapture();
        if (typeof onPrepareComplete === "function") {
            await onPrepareComplete();
        }

        let captureNo = 1;
        while (captureNo <= totalCaptures) {
            const imageBuffer = await screenshot({
                format: "jpg",
                screen: displayId
            });
            await saveImage(
                path.join(outputPath, `${captureNo}.jpg`),
                imageBuffer
            );
            if (captureNo < totalCaptures) {
                if (validKeys.has(autoPressKey)) {

// autoPressKey 매개변수로 전달된 키를 robotjs가 입력합니다. robotjs가 입력할 수 있는 키 목록 중 일부만을 허용하며
// 매개변수로 전달된 키가 유효하지 않은 경우 아무 작업도 수행하지 않습니다.

                    pressKey(autoPressKey);
                }
                await sleep(captureIntervalMs);
            }
            if (typeof onEachCaptureComplete === "function") {
                await onEachCaptureComplete(captureNo);
            }
            captureNo += 1;
        }

        if (typeof onAllCaptureComplete === "function") {
            await onAllCaptureComplete();
        }
    }

    return Object.freeze({
        defineConfig,
        listDisplays,
        sleep,
        startCapture
    });
}

async function captureRobotCli() {
    const cr = captureRobot();

    const displayId = await select({
        choices: (await cr.listDisplays()).map((display) => ({
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
    cr.defineConfig({
        autoPressKey,
        captureIntervalMs,
        displayId,
        outputPath,
        totalCaptures
    });

    cr.startCapture({
        onAllCaptureComplete: () => console.log("✅ 모든 캡처가 완료되었습니다."),
        onEachCaptureComplete: (page) => console.log(`[${page}] 캡처 완료`),
        onPrepareComplete: async function () {
            const startDelayMs = 5000;
            console.log(`⏳ ${startDelayMs / 1000}초 뒤 캡처가 시작됩니다.`);
            await cr.sleep(startDelayMs);
        }
    });
}

export default Object.freeze(captureRobot);

captureRobotCli();
