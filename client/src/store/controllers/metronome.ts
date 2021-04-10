import { UIStore } from "..";
import { Beat } from "../../charting";

/**
 * This handles playing the metronome ticks while the chart is playing.
 */
export class MetronomeController {
    lastBeat?: Beat;
    store: UIStore;

    constructor(store: UIStore) {
        this.store = store;
    }

    /**
     * This calculates if the metronome should tick or not based on the provided beat.
     * The metronome only ticks on whole beats and when it crosses a "beat boundary".
     */
    update(beat: Beat) {
        if (!this.lastBeat) {
            this.lastBeat = beat;
        }

        if (beat.isWholeBeat() || Math.floor(beat.value) > this.lastBeat.value) {
            this.store.emitters.metronome.emit("tick");
        }

        this.lastBeat = beat;
    }
}