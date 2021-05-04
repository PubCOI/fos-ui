import React, {useContext} from "react";
import {Button, OverlayTrigger} from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import PaneContext from "../core/PaneContext";
import {FixDataPaneContents} from "./FixDataPaneContents";
import {renderTooltip} from "../../hooks/Utils";

export enum DataTypeEnum {
    attachment = "attachment",
    award = "award",
    company = "company"
}

export const FixDataIssueWidget = (props: { type: DataTypeEnum, id: string }) => {
    const {setPaneTitle, setPaneSubtitle, setPaneContents, openPane} = useContext(PaneContext);

    function showPane() {
        setPaneTitle("Report data issue");
        setPaneSubtitle(`Fixing ${props.type} ${props.id}`);
        setPaneContents(<FixDataPaneContents type={props.type} id={props.id}/>);
        openPane();
    }

    return (
        <>
            <div className={"d-flex justify-content-end"}>
                <Button variant={"dark"} size={"sm"} onClick={() => showPane()}>
                    <OverlayTrigger
                        placement="auto"
                        delay={{show: 0, hide: 250}}
                        overlay={renderTooltip({text: "Fix data issue"})}>
                        <FontAwesome name={"wrench"}/>
                    </OverlayTrigger>
                </Button>
            </div>
        </>
    )
};


