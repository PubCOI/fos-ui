import React, {useContext} from "react";
import {Button} from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import PaneContext from "../core/PaneContext";
import {FixDataPaneContents} from "./FixDataPaneContents";

export enum DataTypeEnum {
    attachment = "attachment",
    award = "award"
}

// MAKE SURE THIS IS CALLED WITHIN APPLICATION CONTEXT ... modals are notorious for being a PITA
export const FixDataIssueWidget = (props: { type: DataTypeEnum, id: string }) => {

    const {setPaneTitle, setPaneSubtitle, setPaneContents, openPane} = useContext(PaneContext);

    function openFixWidget() {
        setPaneTitle("Report data issue");
        setPaneSubtitle(`Fixing ${props.type} ${props.id}`);
        setPaneContents(<FixDataPaneContents type={props.type} id={props.id}/>);
        openPane();
    }

    return (
        <>
            <div className={"d-flex justify-content-end"}>
                <Button variant={"dark"} size={"sm"} onClick={() => openFixWidget()}> fix data <FontAwesome
                    name={"wrench"}/></Button>
            </div>
        </>
    )
};


