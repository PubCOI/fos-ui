import React, {useContext, useEffect} from "react";
import AppContext from "../core/AppContext";
import PaneContext from "../core/PaneContext";
import FontAwesome from "react-fontawesome";
import {ReactSlidingPane} from "react-sliding-pane";
import {Form} from "react-bootstrap";

export const PaneContainer = () => {
    const {showRightPane} = useContext(AppContext);
    const {paneContents, paneTitle, paneSubtitle, closePane} = useContext(PaneContext);

    useEffect(() => {
        console.log("re-rendered");
    }, []);

    return (
        <>
            <ReactSlidingPane
                overlayClassName="pane-overlay"
                isOpen={showRightPane}
                closeIcon={<FontAwesome name={"caret-right"} size={"2x"}/>}
                title={paneTitle}
                subtitle={paneSubtitle}
                onRequestClose={() => {
                    closePane()
                }}
            >
                {paneContents}
            </ReactSlidingPane>
        </>
    )
};