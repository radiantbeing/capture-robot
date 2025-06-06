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
    let totalPages = 0;
    let captureIntervalMs = 500;
    let turnPageKey = "right";
    let outputPath = path.join(__dirname, "output");

    async function listDisplays() {
        return await screenshot.listDisplays();
    }

    function defineConfig(config) {
        displayId = config.displayId ?? displayId;
        totalPages = config.totalPages ?? totalPages;
        captureIntervalMs = config.captureIntervalMs ?? captureIntervalMs;
        turnPageKey = config.turnPageKey ?? turnPageKey;
        outputPath = config.outputPath ?? outputPath;
    }

    async function initializeDirectory(directoryPath) {

// 캡처된 이미지를 저장할 출력 디렉터리를 초기화합니다. 출력 디렉터리를 생성합니다. 출력 디렉터리가 이미 생성되어 있으면 포함된 내용물을
// 모두 삭제합니다.

        await fs.promises.mkdir(directoryPath, {recursive: true});

// fs.promises.mkdir 메서드의 두 번째 매개변수에 전달된 옵션 객체의 recursive 프로퍼티가 true로 설정되어 있어,
// 디렉터리가 이미 존재하는 경우에도 예외가 발생하지 않습니다. 따라서 디렉터리 내에 이미 존재할 수 있는 파일을 식별하여 삭제합니다.

        const files = await fs.promises.readdir(directoryPath);
        files.forEach(async function (file) {
            const filePath = path.join(directoryPath, file);
            await fs.promises.rm(filePath, {recursive: true});
        });
    }

    function turnPage(turnPageKey) {
        robot.keyTap(turnPageKey);
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

        let page = 1;
        while (page <= totalPages) {
            const imageBuffer = await screenshot({
                format: "jpg",
                screen: displayId
            });
            await saveImage(path.join(outputPath, `${page}.jpg`), imageBuffer);
            if (page < totalPages) {
                if (validKeys.has(turnPageKey)) {

// turnPageKey 매개변수로 전달된 키를 robotjs가 입력합니다. robotjs가 입력할 수 있는 키 목록 중 일부만을 허용하며
// 매개변수로 전달된 키가 유효하지 않은 경우 아무 작업도 수행하지 않습니다.

                    turnPage(turnPageKey);
                }
                await sleep(captureIntervalMs);
            }
            if (typeof onEachCaptureComplete === "function") {
                await onEachCaptureComplete(page);
            }
            page += 1;
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
    const totalPages = Number.parseInt(await input({
        default: "1",
        message: "총 페이지 수"
    }));
    const captureIntervalMs = Number.parseInt(await input({
        default: 500,
        message: "캡처 간격 (ms)"
    }));
    const turnPageKey = await select({
        choices: ["right", "left", "space", "none"],
        loop: false,
        message: "페이지 넘김 키"
    });
    const outputPath = await input({
        default: path.join(__dirname, "output"),
        message: "이미지 저장 경로"
    });
    cr.defineConfig({
        captureIntervalMs,
        displayId,
        outputPath,
        totalPages,
        turnPageKey
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
