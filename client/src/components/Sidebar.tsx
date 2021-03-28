import React from "react";

import { ScrollDirectionAction, ZoomAction } from "../actions/storeActions";
import { OpenFileAction, SaveFileAction } from "../actions/uiActions/";
import { discord, github } from "../assets";
import { Converter } from "../formats/oc/converter";
import { Serializer } from "../formats/oc/serializer";
import { Project } from "../project";
import { Store } from "../store/";

export interface Props {
    store: Store;
}

export const Sidebar = (props: Props) => {
    const { store } = props;

    const openFilePicker = () => {
        new OpenFileAction({ accept: [".sm", ".oc"] }).run().then((files) => {
            const f = files[0];

            f.text().then((text) => {
                const fd = new Serializer().read(text);
                const project = new Converter().toNative(fd);
                store.setChart(project.charts[0]);
            });
        });
    };

    const saveFile = () => {
        const project: Project = {
            charts: [store.config.chart],
            song: {
                artist: "TODO",
                title: "TODO",
            },
        };
        const fd = new Converter().fromNative(project);
        const data = new Serializer().write(fd);

        new SaveFileAction({
            data,
            fileName: "project.oc",
            mimeType: "application/openchart",
        }).run();
    };

    const swapScrollDirection = () => {
        new ScrollDirectionAction(store, { to: "swap" }).run();
    };

    const zoomIn = () => {
        new ZoomAction(store, {
            to: store.state.zoom.mul(1.5),
        }).run();
    };

    const zoomOut = () => {
        new ZoomAction(store, {
            to: store.state.zoom.div(1.5),
        }).run();
    };

    return (
        <div className="sidebar-container">
            <div className="toolbar">
                <a title="New chart">
                    <span className="material-icons-outlined">add</span>
                </a>
                <a title="Open chart" onClick={openFilePicker}>
                    <span className="material-icons-outlined">upload_file</span>
                </a>
                <a title="Download chart" onClick={saveFile}>
                    <span className="material-icons-outlined">save_alt</span>
                </a>
                <div className="divider"></div>
                <a title="Swap scroll direction" onClick={swapScrollDirection}>
                    <span className="material-icons-outlined">swap_vert</span>
                </a>
                <a title="Zoom in" onClick={zoomIn}>
                    <span className="material-icons-outlined">zoom_in</span>
                </a>
                <a title="Zoom out" onClick={zoomOut}>
                    <span className="material-icons-outlined">zoom_out</span>
                </a>
            </div>
            <div className="footer">
                <a
                    href="https://github.com/OpenChartProject/OpenChart-web/issues/new"
                    title="Report a bug or issue"
                    target="_blank"
                >
                    <span className="material-icons-outlined report-icon">report</span>
                </a>
                <div className="divider"></div>
                <a href="https://discord.gg/wSGmN52" title="Visit us on Discord" target="_blank">
                    <img src={discord} />
                </a>
                <a
                    href="https://github.com/OpenChartProject/OpenChart-web"
                    title="View OpenChart on GitHub"
                    target="_blank"
                >
                    <img src={github} />
                </a>
            </div>
        </div>
    );
};
