import {NodeTypeEnum} from "../../generated/FosTypes";
import React, {useContext} from "react";
import PaneContext from "../core/PaneContext";
import {Graph} from "../../pages/Graph";
import {Badge, OverlayTrigger} from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import {renderTooltip} from "../../hooks/Utils";

export const GraphPanelBadge = (props: { type: NodeTypeEnum, id?: string, variant?: string }) => {
    const {setPaneTitle, setPaneSubtitle, setPaneContents, openPane} = useContext(PaneContext);

    function showPane() {
        setPaneTitle(`Graph details for ${props.type} ${props.id}`);
        setPaneSubtitle(``);
        setPaneContents(<Graph object_id={props.id} object_type={props.type}/>);
        openPane();
    }

    if (!props.type || !props.id) return <></>;

    return (
        <>
            <Badge variant={(props.variant && props.variant !== "") ? props.variant : undefined} className={"ml-1 p-1"} onClick={() => showPane()} role={"button"}><OverlayTrigger
                placement="auto"
                delay={{show: 0, hide: 250}}
                overlay={renderTooltip({text: "Show graph"})}>
                <FontAwesome name={"eye"}/>
            </OverlayTrigger></Badge>
        </>
    )
};