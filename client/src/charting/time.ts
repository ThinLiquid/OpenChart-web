import * as assert from "assert";

export class Time {
  private _value: number;

  constructor(value: number) {
    this.value = value;
  }

  set value(val: number) {
    assert(val >= 0, "time cannot be negative");
    this._value = val;
  }

  get value(): number {
    return this._value;
  }
}
