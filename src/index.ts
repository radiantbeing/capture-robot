import { Monitor } from "node-screenshots";
import robotjs from "robotjs";

export const PRESSABLE_KEYS = [
    "up",
    "down",
    "right",
    "left",
    "pageup",
    "pagedown",
    "space",
    "enter"
] as const;

export type PressableKey = (typeof PRESSABLE_KEYS)[number];

export default class CaptureRobot {
    public static pressableKeys = PRESSABLE_KEYS;

    constructor(
        private monitorId: number,
        private key: PressableKey
    ) {}

    public static getAllMonitors(): Monitor[] {
        return Monitor.all();
    }

    public static getPrimaryMonitor(): Monitor | undefined {
        return CaptureRobot.getAllMonitors().find((m) => m.isPrimary);
    }

    public static getMonitor(id: number): Monitor | undefined {
        return CaptureRobot.getAllMonitors().find((m) => m.id === id);
    }

    public captureImage(): Buffer {
        const monitor = CaptureRobot.getMonitor(this.monitorId);
        if (monitor === undefined) {
            throw new Error(`Monitor [${this.monitorId.toString()}] not found`);
        }
        return monitor.captureImageSync().toPngSync();
    }

    public pressKey(): void {
        robotjs.keyTap(this.key);
    }
}
