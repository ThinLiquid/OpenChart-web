import { Beat } from "../charting/beat";
import Fraction from "fraction.js";
import assert from "assert";

export const commonBeatSnaps: Readonly<Fraction>[] = [
    new Fraction(1, 4),
    new Fraction(1, 8),
    new Fraction(1, 12),
    new Fraction(1, 16),
    new Fraction(1, 24),
    new Fraction(1, 32),
    new Fraction(1, 48),
    new Fraction(1, 64),
    new Fraction(1, 96),
    new Fraction(1, 192),
];

export class BeatSnap {
    private _current!: Fraction;

    constructor(current?: Fraction) {
        this.current = current ?? new Fraction(1, 4);
    }

    get current(): Fraction {
        return this._current;
    }

    set current(val: Fraction) {
        assert(val.valueOf() > 0, "beat snap value must be greater than zero");
        this._current = val;
    }

    /**
     * Returns true if this snapping matches one of the snaps defined in the
     * commonBeatSnaps list.
     */
    isCommonSnap(): boolean {
        return (
            commonBeatSnaps.findIndex((snap) => snap.equals(this.current)) !==
            -1
        );
    }

    /**
     * Returns the index from the commonBeatSnaps list that closest matches this beat
     * snapping.
     */
    nearestCommonSnapIndex(): number {
        let minDifference = 999999999;
        let nearestIndex = 0;

        for (let i = 0; i < commonBeatSnaps.length; i++) {
            const diff = commonBeatSnaps[i].sub(this.current).abs().valueOf();

            if (diff < minDifference) {
                minDifference = diff;
                nearestIndex = i;
            }
        }

        return nearestIndex;
    }

    /**
     * Makes the beat snapping finer by moving to the next common beat snapping.
     */
    next() {
        let index = this.nearestCommonSnapIndex();

        if (commonBeatSnaps[index].compare(this.current) !== -1) {
            index++;
        }

        this.current =
            commonBeatSnaps[Math.min(index, commonBeatSnaps.length - 1)];
    }

    /**
     * Makes the beat snapping coarser by moving to the previous common beat snapping.
     */
    prev() {
        let index = this.nearestCommonSnapIndex();

        if (commonBeatSnaps[index].compare(this.current) !== 1) {
            index--;
        }

        this.current = commonBeatSnaps[Math.max(index, 0)];
    }

    toBeat(): Beat {
        return new Beat(this._current.mul(4).valueOf());
    }
}