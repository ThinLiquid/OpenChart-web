import { getBeatLineTimes } from "./beatlines";
import { Time } from "../charting/time";
import { NoteFieldConfig, NoteFieldState } from "./config";
import { KeyIndex } from "../charting/keyIndex";

export type DrawConfig = NoteFieldConfig & NoteFieldState;

export interface DrawProps {
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;
    config: DrawConfig;
    t0: Time;
    t1: Time;
}

function clear({ ctx, w, h, config }: DrawProps) {
    ctx.fillStyle = config.colors.background;
    ctx.fillRect(0, 0, w, h);
}

function drawBeatLines({ ctx, w, config, t0, t1 }: DrawProps) {
    ctx.strokeStyle = config.colors.beatLines;
    ctx.lineWidth = 1;

    for (const bt of getBeatLineTimes(config.chart, t0, t1)) {
        let y = (bt.time.value - t0.value) * config.pixelsPerSecond;

        if (ctx.lineWidth % 2 === 1) {
            y += 0.5;
        }

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.closePath();
        ctx.stroke();
    }
}

/**
 * Returns the new height after scaling to fit a particular width.
 */
export function scaleToWidth(srcW: number, srcH: number, dstW: number): number {
    return (dstW / srcW) * srcH;
}

function drawReceptors({ ctx, config }: DrawProps) {
    for (let i = 0; i < config.keyCount; i++) {
        const r = config.noteSkin.receptor[i];
        const h = scaleToWidth(
            r.width as number,
            r.height as number,
            config.columnWidth,
        );
        ctx.drawImage(r, i * config.columnWidth, 0, config.columnWidth, h);
    }
}

function drawObjects({ ctx, config, t0, t1 }: DrawProps) {
    for (let i = 0; i < config.keyCount; i++) {
        const r = config.noteSkin.tap[i];
        const h = scaleToWidth(
            r.width as number,
            r.height as number,
            config.columnWidth,
        );
        const objects = config.chart.getObjectsInInterval(
            new KeyIndex(i),
            // Extend the interval a bit to prevent notes at the edge of the screen from
            // getting cut off
            new Time(Math.max(t0.value - 2, 0)),
            new Time(t1.value + 2),
        );

        for (const obj of objects) {
            // TODO: Add time property to ChartObject
            const t = config.chart.bpms.timeAt(obj.beat);

            if (obj.type === "tap") {
                ctx.drawImage(
                    r,
                    i * config.columnWidth,
                    (t.value - t0.value) * config.pixelsPerSecond,
                    config.columnWidth,
                    h,
                );
            }
        }
    }
}

export function drawNoteField(el: HTMLCanvasElement, config: DrawConfig) {
    const ctx = el.getContext("2d") as CanvasRenderingContext2D;
    const { width: w, height: h } = el;

    if (h === 0) return;

    const t0 = new Time(config.scroll * config.secondsPerScrollTick);
    const t1 = new Time(t0.value + h / config.pixelsPerSecond);

    const drawProps = { ctx, w, h, config, t0, t1 };

    clear(drawProps);
    drawBeatLines(drawProps);
    drawReceptors(drawProps);
    drawObjects(drawProps);
}
