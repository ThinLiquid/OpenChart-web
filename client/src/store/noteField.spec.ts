import assert from "assert";
import Fraction from "fraction.js";
import sinon from "sinon";
import { Chart } from "../charting";

import { zoom } from "../store/noteField";
import { createStore } from "../testUtil";

describe("NoteFieldStore", () => {
    describe("#setCanvas", () => {
        it("sets the canvas element and updates the width", () => {
            const el = document.createElement("canvas");
            el.width = 123;

            const store = createStore().noteField;

            store.setCanvas(el as HTMLCanvasElement);
            assert.strictEqual(store.canvas, el);
            assert.strictEqual(store.canvas.width, store.width);
        });
    });

    describe("#setChart", () => {
        it("sets the chart", () => {
            const store = createStore().noteField;
            const chart = new Chart();

            store.setChart(chart);
            assert.strictEqual(chart, store.chart);
        });

        it("resets the view", () => {
            const store = createStore().noteField;
            const spy = sinon.spy();

            sinon.replace(store, "resetView", spy);
            store.setChart(store.chart);

            assert(spy.called);
        });
    });

    describe("setMusic", () => {
        it("sets the music source", () => {
            const store = createStore().noteField;

            store.setMusic("foo");
            assert.strictEqual(store.music.el.src, "foo");
        });

        it("sets isPlaying to false", () => {
            const store = createStore().noteField;

            store.setMusic("foo");
            assert.strictEqual(store.state.isPlaying, false);
        });
    });

    describe("#setZoom", () => {
        it("throws if zoom is <= 0", () => {
            const store = createStore().noteField;
            assert.throws(() => store.setZoom(new Fraction(0)));
            assert.throws(() => store.setZoom(new Fraction(-1)));
        });

        it("sets zoom", () => {
            const store = createStore().noteField;
            const val = new Fraction(1, 2);

            store.setZoom(val);
            assert.strictEqual(store.state.zoom, val);
        });

        it("sets zoom to min zoom", () => {
            const store = createStore().noteField;
            const val = new Fraction(1, 9999999);

            store.setZoom(val);
            assert.strictEqual(store.state.zoom, zoom.min);
        });

        it("sets zoom to max zoom", () => {
            const store = createStore().noteField;
            const val = new Fraction(9999999);

            store.setZoom(val);
            assert.strictEqual(store.state.zoom, zoom.max);
        });

        it("doesn't set the zoom if it's already the same");
    });

    describe("#setScroll", () => {
        it("throws if both beat and time are not set");
        it("sets scroll using beat");
        it("sets scroll using time");
    });

    describe("#scrollBy", () => {
        it("throws if both beat and time are not set");
        it("scrolls by the beat amount");
        it("scrolls by the time amount");
        it("sets scroll to 0 if beat would go negative");
        it("sets scroll to 0 if time would go negative");
    });
});
