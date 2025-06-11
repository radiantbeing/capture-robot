/*jslint node*/
import fs from "node:fs";
import path from "node:path";
import robot from "robotjs";
import screenshot from "screenshot-desktop";
import pause from "./pause.js";

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

async function listDisplays() {
    return await screenshot.listDisplays();
}

function pressKey(key) {
    robot.keyTap(key);
}

// 상태 유지형 함수는 `captureRobotFactory` 함수 내에서 정의합니다.

async function captureRobotFactory(config) {
    const displayId = config.displayId ?? 0;
    const totalCaptures = config.totalCaptures ?? 0;
    const captureIntervalMs = config.captureIntervalMs ?? 0;
    const autoPressKey = config.autoPressKey ?? undefined;
    const outputPath = config.outputPath ?? path.resolve("./output");

    const validKeys = ["right", "left", "space"];
    let captureNr = 0;

    await initializeDirectory(outputPath);

    return async function capture() {
        const extension = "jpg";
        const filename = `${captureNr}.${extension}`;
        const filepath = path.join(outputPath, filename);
        const shouldCapture = captureNr < totalCaptures;
        const isLastCapture = captureNr === totalCaptures - 1;
        if (!shouldCapture) {
            return;
        }
        const buffer = await screenshot({format: extension, screen: displayId});
        await fs.promises.writeFile(filepath, buffer);
        if (!isLastCapture) {
            if (validKeys.includes(autoPressKey)) {
                pressKey(autoPressKey);
            }
            await pause(captureIntervalMs);
        }
        captureNr += 1;
        return {
            filename,
            index: captureNr - 1,
            path: filepath
        };
    };
}

export default Object.freeze(Object.assign(captureRobotFactory, {

// 상태 비저장형 함수는 `Object.assign` 메서드에 의해 `captureRobotFactory`에 포함됩니다.
// 이들은 정적 메서드로서 `captureRobotFactory` 함수 호출에 의해 인스턴스를 생성하기 전에도 호출할 수 있습니다.

    listDisplays
}));
