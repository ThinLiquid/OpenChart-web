import assert from "assert";

import { Beat, KeyIndex } from "../../charting";
import { Tap } from "../../charting/objects";
import { RootStore } from "../../store";
import { Action } from "../action";

/**
 * Arguments for the PlaceTapAction.
 */
export interface PlaceTapArgs {
    beat: Beat;
    key: KeyIndex;
}

/**
 * Action for placing a tap note.
 */
export class PlaceTapAction implements Action {
    args: PlaceTapArgs;
    store: RootStore;

    constructor(store: RootStore, args: PlaceTapArgs) {
        const { chart } = store.noteField;

        assert(args.key.value < chart.keyCount.value, "key index is out of range");

        this.args = args;
        this.store = store;
    }

    run(): void {
        const { chart } = this.store.noteField;
        const args = this.args;

        chart.placeObject(new Tap(args.beat, args.key), {
            removeIfExists: true,
        });
    }
}