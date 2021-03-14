import React, {useContext} from "react";
import AppContext from "./core/AppContext";
import SlidingPane from "react-sliding-pane";
import FontAwesome from "react-fontawesome";
import PaneContext from "./core/PaneContext";

export const PaneContainer = () => {
    const {showRightPane} = useContext(AppContext);
    const {paneContents, paneTitle, paneSubtitle, closePane} = useContext(PaneContext);

    return (
        <SlidingPane
            overlayClassName="pane-overlay"
            isOpen={showRightPane}
            closeIcon={<FontAwesome name={"caret-right"} size={"2x"}/>}
            title={paneTitle}
            subtitle={paneSubtitle}
            onRequestClose={() => {
                closePane()
            }}>
            <div>{paneContents}</div>
        </SlidingPane>
    )
}