/*jslint node*/
import fs from "node:fs";
import path from "node:path";
import robot from "robotjs";
import screenshot from "screenshot-desktop";

async function initializeDirectory(directoryPath) {

// `directoryPath` 매개변수로 전달된 경로에 디렉터리를 생성합니다. 이미 디렉터리가 존재하면 디렉터리의 컨텐츠를 모두 삭제합니다.

    await fs.promises.mkdir(directoryPath, {recursive: true});

// fs.promises.mkdir 메서드의 두 번째 매개변수에 전달된 옵션 객체의 recursive 프로퍼티가 true로 설정되어 있어
// 디렉터리가 이미 존재하는 경우에도 예외가 발생하지 않습니다. 따라서 디렉터리 내에 이미 존재할 수 있는 컨텐츠를 식별하여 삭제합니다.

    const contents = await fs.promises.readdir(directoryPath);
    contents.forEach(async function (content) {
        const contentPath = path.join(directoryPath, content);
        await fs.promises.rm(contentPath, {recursive: true});
    });
}

async function save(filePath, buffer) {
    await fs.promises.writeFile(filePath, buffer);
}

function pause(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function listDisplays() {
    return await screenshot.listDisplays();
}

function pressKey(key) {
    robot.keyTap(key);
}

const validKeys = ["right", "left", "space"];

// 상태 유지형 함수는 `captureRobotConstructor` 함수 내에서 정의합니다.

function captureRobotConstructor(config) {
    const displayId = config.displayId ?? 0;
    const totalCaptures = config.totalCaptures ?? 0;
    const captureIntervalMs = config.captureIntervalMs ?? 500;
    const autoPressKey = config.autoPressKey ?? undefined;
    const outputPath = config.outputPath ?? path.resolve("./output");

    async function initializeOutputDirectory() {
        await initializeDirectory(outputPath);
    }

    async function startCapture(callback) {
        let captureNr = 1;
        while (captureNr <= totalCaptures) {
            const imageBuffer = await screenshot({
                format: "jpg",
                screen: displayId
            });
            await save(
                path.join(outputPath, `${captureNr}.jpg`),
                imageBuffer
            );
            if (captureNr < totalCaptures) {
                if (validKeys.includes(autoPressKey)) {

// autoPressKey 매개변수로 전달된 키를 robotjs가 입력합니다. robotjs가 입력할 수 있는 키 목록 중 일부만을 허용하며
// 매개변수로 전달된 키가 유효하지 않은 경우 아무 작업도 수행하지 않습니다.

                    pressKey(autoPressKey);
                }
                await pause(captureIntervalMs);
            }
            if (typeof callback === "function") {
                await callback(captureNr);
            }
            captureNr += 1;
        }
    }

    return {

// 외부로 노출되는 중첩 함수를 반환합니다. `captureRobotConstructor` 함수 호출에 의해 인스턴스가 만들어진 이후
// 호출할 수 있습니다.

        initializeOutputDirectory,
        startCapture
    };
}

export default Object.freeze(Object.assign(captureRobotConstructor, {

// 상태 비저장형 함수는 `Object.assign` 메서드에 의해 `captureRobotConstructor`에 포함됩니다.
// 이들은 정적 메서드로서 `captureRobotConstructor` 함수 호출에 의해 인스턴스를 생성하기 전에도 호출할 수 있습니다.

    listDisplays,
    pause
}));
