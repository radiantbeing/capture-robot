/*jslint node*/
import fs from "node:fs";
import path from "node:path";

async function isDirectoryEmpty(directoryPath) {
    const contents = await fs.promises.readdir(directoryPath);
    return contents.length === 0;
}

async function doesDirectoryExist(directoryPath) {
    try {
        await fs.promises.access(directoryPath, fs.constants.F_OK);
        return true;
    } catch (ignore) {
        return false;
    }
}

async function createDirectory(directoryPath) {

// `directoryPath` 경로에 디렉터리를 생성합니다. `fs.promises.mkdir` 메서드의 두 번째 매개변수에 전달된 옵션
// 객체의 `recursive` 프로퍼티가 `true`로 설정되어 있어 디렉터리가 이미 존재하는 경우에도 예외가 발생하지 않습니다.

    await fs.promises.mkdir(directoryPath, {recursive: true});
}

async function clearDirectory(directoryPath) {
    const contents = await fs.promises.readdir(directoryPath);
    await Promise.all(contents.map(async function (content) {
        const contentPath = path.join(directoryPath, content);
        await fs.promises.rm(contentPath, {recursive: true});
    }));
}

export {
    clearDirectory,
    createDirectory,
    doesDirectoryExist,
    isDirectoryEmpty
};
