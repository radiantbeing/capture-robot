/*jslint node*/
import fs from "node:fs";
import {isDirectoryEmpty} from "./filesys.js";
import path from "node:path";
import pause from "./pause.js";
import robot from "robotjs";
import screenshot from "screenshot-desktop";

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

// 디렉터리에 콘텐츠가 존재하면 콘텐츠 보호를 위해 명시적으로 에러를 던집니다. 출력 디렉터리의 초기화 책임을 모듈 사용자에게 부여합니다.

    if (!(await isDirectoryEmpty(outputPath))) {
        const error = new Error(`${outputPath} 디렉터리가 비어있지 않습니다.`);
        error.evidence = outputPath;
        throw error;
    }

    const validKeys = ["right", "left", "space"];
    let captureNr = 0;

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
