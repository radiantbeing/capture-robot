/*jslint node*/
import fs from "node:fs";
import path from "node:path";
import robot from "robotjs";
import screenshot from "screenshot-desktop";

function createCaptureRobot(config) {

// 클로저 기반의 캡처 자동화 로봇 객체를 생성합니다.

    let displayId = 0;
    let totalCaptures = 0;
    let captureIntervalMs = 500;
    let autoPressKey = "right";
    let outputPath = path.resolve("./output");

    defineConfig(config);

    function defineConfig(config) {
        displayId = config.displayId ?? displayId;
        totalCaptures = config.totalCaptures ?? totalCaptures;
        captureIntervalMs = config.captureIntervalMs ?? captureIntervalMs;
        autoPressKey = config.autoPressKey ?? autoPressKey;
        outputPath = config.outputPath ?? outputPath;
    }

    async function listDisplays() {
        return await screenshot.listDisplays();
    }

    async function initializeDirectory(directoryPath = outputPath) {

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

    async function startCapture(callback) {
        let captureNr = 1;
        while (captureNr <= totalCaptures) {
            const imageBuffer = await screenshot({
                format: "jpg",
                screen: displayId
            });
            await saveImage(
                path.join(outputPath, `${captureNr}.jpg`),
                imageBuffer
            );
            if (captureNr < totalCaptures) {
                const validKeys = ["right", "left", "space"];
                if (validKeys.includes(autoPressKey)) {

// autoPressKey 매개변수로 전달된 키를 robotjs가 입력합니다. robotjs가 입력할 수 있는 키 목록 중 일부만을 허용하며
// 매개변수로 전달된 키가 유효하지 않은 경우 아무 작업도 수행하지 않습니다.

                    pressKey(autoPressKey);
                }
                await sleep(captureIntervalMs);
            }
            if (typeof callback === "function") {
                await callback(captureNr);
            }
            captureNr += 1;
        }
    }

    return {
        defineConfig,
        initializeDirectory,
        listDisplays,
        sleep,
        startCapture
    };
}

export default Object.freeze(createCaptureRobot);
