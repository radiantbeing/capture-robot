const fs = require("fs/promises");
const robot = require("robotjs");
const screenshot = require("screenshot-desktop");
const inquirer = require("@inquirer/prompts");

const log = require("./logger");

class CaptureRobot {
  private outputDir: string;
  private imageBuffer: Buffer | null;
  private totalPage: number;
  private currentPage: number;
  private captureSpeed: number;

  constructor(outputDir: string) {
    this.outputDir = outputDir;
    this.imageBuffer = null;
    this.totalPage = 1;
    this.currentPage = 1;
    this.captureSpeed = 1000;
  }

  async initialize(): Promise<void> {
    this.totalPage = await inquirer.input({ message: "총 페이지 수" });
    this.captureSpeed = await inquirer.input({
      message: "캡처 속도 (단위: ms)",
    });
  }

  async ready(): Promise<void> {
    log.info("5초 뒤 캡처가 시작됩니다.");
    log.info("캡처할 윈도우를 클릭하여 활성화하세요.");

    await this.sleep(5000);
  }

  async shoot(): Promise<void> {
    try {
      this.imageBuffer = await screenshot();
    } catch (error) {
      log.error("스크린샷 캡처 실패");
    }
  }

  async save(): Promise<void> {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
      await fs.writeFile(
        `${this.outputDir}/${this.currentPage}.jpg`,
        this.imageBuffer
      );

      log.info(`${this.currentPage}.jpg 저장 성공`);
    } catch (error) {
      log.error(`${this.currentPage}.jpg 저장 실패`);
    }
  }

  turnPage(): void {
    robot.keyTap("right");
    this.currentPage = this.currentPage + 1;
  }

  sleep(delay: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  async run() {
    await this.initialize();
    await this.ready();

    while (this.currentPage <= this.totalPage) {
      await this.shoot();
      await this.save();
      this.turnPage();
      await this.sleep(this.captureSpeed);
    }

    log.info("작업이 완료되었습니다!");
  }
}

new CaptureRobot("./out").run();
