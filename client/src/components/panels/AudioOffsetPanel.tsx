import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { FormEvent, useEffect, useState } from "react";

import { RootStore } from "../../store";

import { Panel } from "./Panel";

export interface Props {
    store: RootStore;
}

export const AudioOffsetPanel = observer((props: Props) => {
    const { noteField, ui } = props.store;
    const visible = ui.data.panelVisibility.audioOffset;
    const [inputVal, setInputVal] = useState(noteField.data.audioOffset.toFixed(3));

    // Update the offset input if the stored offset changed.
    useEffect(() => {
        reset();
    }, [noteField.data.audioOffset]);

    const reset = () => {
        setInputVal(noteField.data.audioOffset.toFixed(3));
    };

    const update = () => {
        if (!/^[-+]?\d*\.?\d*$/.test(inputVal)) {
            reset();
            return;
        }

        noteField.setAudioOffset(_.toNumber(inputVal));
    };

    const onPickTime = () => {
        ui.activateTimePicker({
            onPick: (y, time) => {
                // Set the offset relative to where it already is, since the user is
                // using the waveform to determine the offset, and if the audio offset
                // is already set, then the waveform will be moved and we want to know
                // the difference between where it is and where they clicked.
                noteField.setAudioOffset(noteField.data.audioOffset - time);
                ui.deactivateTimePicker();
            },
        });
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        update();
        (document.activeElement as HTMLElement).blur();
    };

    const onToggle = () => {
        ui.update({ panelVisibility: { audioOffset: !visible } });
    };

    const disabled = noteField.data.isPlaying || ui.tools.timePicker.active;

    return (
        <Panel title="Audio Offset" visible={visible} onToggle={onToggle}>
            <form onSubmit={onSubmit}>
                <div className="form-control">
                    <label className="form-label form-label-dark">Offset (seconds)</label>

                    <div className="clearfix">
                        <input
                            type="text"
                            className="form-input-inline"
                            disabled={disabled}
                            value={inputVal}
                            onChange={(e) => setInputVal(e.currentTarget.value)}
                            onBlur={update}
                        />
                        <button
                            type="button"
                            className="btn btn-secondary btn-thin"
                            style={{ float: "right" }}
                            disabled={disabled}
                            onClick={onPickTime}
                        >
                            Pick Time
                        </button>
                    </div>
                </div>
            </form>
        </Panel>
    );
});