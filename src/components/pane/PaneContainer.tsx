import React, {useContext} from "react";
import AppContext from "../core/AppContext";
import PaneContext from "../core/PaneContext";
import FontAwesome from "react-fontawesome";
import {ReactSlidingPane} from "react-sliding-pane";
import {useWindowSize} from "../../hooks/Utils";

export const PaneContainer = () => {
    const size = useWindowSize();
    const {showRightPane} = useContext(AppContext);
    const {paneContents, paneTitle, paneSubtitle, closePane} = useContext(PaneContext);

    return (
        <>
            <ReactSlidingPane
                overlayClassName="pane-overlay"
                isOpen={showRightPane}
                width={(size.width >= 768 ? "80%" : "100%")}
                closeIcon={(size.width >= 768) ? <FontAwesome name={"caret-right"} size={"2x"}/> :
                    <FontAwesome name={"window-close-o"} size={"2x"}/>}
                title={paneTitle}
                subtitle={paneSubtitle}
                onRequestClose={() => {
                    closePane()
                }}>
                {paneContents}
            </ReactSlidingPane>
        </>
    )
};