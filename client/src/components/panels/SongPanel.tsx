import { observer } from "mobx-react-lite";
import React, { FormEvent, useEffect, useState } from "react";

import { RootStore } from "../../store";

import { Panel } from "./Panel";

export interface Props {
    store: RootStore;
}

export const SongPanel = observer((props: Props) => {
    const song = props.store.project.data.song;

    const [artist, setArtist] = useState(song.artist);
    const [title, setTitle] = useState(song.title);

    const modified = artist !== song.artist || title !== song.title;

    // Update the form if the value stored on the project changed. For example,
    // when opening a project
    useEffect(() => {
        if (!modified) {
            return;
        }

        setArtist(song.artist);
        setTitle(song.title);
    }, [song.artist, song.title]);

    const onApply = () => {
        props.store.project.updateSong({ artist, title });
    };

    const onRevert = () => {
        setArtist(song.artist);
        setTitle(song.title);
    };

    const onFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        onApply();
    };

    return (
        <Panel title="Song Info">
            <form onSubmit={onFormSubmit}>
                <div className="form-control">
                    <label className="form-label-dark" htmlFor="input-title">
                        Title
                    </label>
                    <input
                        id="input-title"
                        type="text"
                        className="form-input"
                        value={title}
                        onChange={(e) => setTitle(e.currentTarget.value)}
                    />
                </div>

                <div className="form-control">
                    <label className="form-label-dark" htmlFor="input-artist">
                        Artist
                    </label>
                    <input
                        id="input-artist"
                        type="text"
                        className="form-input"
                        value={artist}
                        onChange={(e) => setArtist(e.currentTarget.value)}
                    />
                </div>

                <div className="form-control">
                    <button
                        className="btn btn-primary btn-thin"
                        disabled={!modified}
                        onClick={onApply}
                    >
                        Apply
                    </button>
                    <button
                        className="btn btn-secondary btn-thin float-right"
                        disabled={!modified}
                        onClick={onRevert}
                    >
                        Revert
                    </button>
                </div>
            </form>
        </Panel>
    );
});