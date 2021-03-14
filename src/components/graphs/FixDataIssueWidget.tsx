import React, {useContext} from "react";
import {Button} from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import PaneContext from "../core/PaneContext";

export enum DataTypeEnum {
    attachment = "attachment",
    award = "award"
}

// MAKE SURE THIS IS CALLED WITHIN APPLICATION CONTEXT ... modals are notorious for being a PITA
export const FixDataIssueWidget = (props: { type: DataTypeEnum, id: string }) => {

    const {setPaneTitle, setPaneSubtitle, openPane} = useContext(PaneContext);
    const paneContext = useContext(PaneContext);

    function openFixWidget() {
        setPaneTitle("Report data issue");
        setPaneSubtitle(`Fixing ${props.type} ${props.id}`);
        openPane();
    }

    return (
        <>
            <div className={"d-flex justify-content-end"}>
                <Button variant={"dark"} size={"sm"} onClick={() => openFixWidget()}> fix data issue <FontAwesome
                    name={"wrench"}/></Button>
            </div>
        </>
    )
};


