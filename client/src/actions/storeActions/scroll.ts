import assert from "assert";

import { BeatTime } from "../../charting/";
import { RootStore } from "../../store/";
import { Action } from "../action";

/**
 * Arguments for the ScrollAction.
 */
export interface ScrollArgs {
    by?: { beat?: number; time?: number };
    to?: Partial<BeatTime>;
}

/**
 * Action for scrolling the notefield by beat/time.
 */
export class ScrollAction implements Action {
    args: ScrollArgs;
    store: RootStore;

    constructor(store: RootStore, args: ScrollArgs) {
        assert(args.to || args.by, "both scroll arguments are undefined");

        this.args = args;
        this.store = store;
    }

    run(): void {
        const args = this.args;
        const { scrollBy, setScroll } = this.store.noteField;

        if (args.by) {
            scrollBy(args.by);
        } else if (args.to) {
            setScroll(args.to);
        }
    }
}
