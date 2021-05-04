import {Button} from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import React, {useContext} from "react";
import PaneContext from "../core/PaneContext";
import {CFViewer} from "../viewer/CFViewer";
import {AttachmentDTO} from "../../generated/FosTypes";

export const AttachmentAccordionLinks = (props: { attachment?: AttachmentDTO }) => {

    const {setPaneTitle, setPaneContents, openPane} = useContext(PaneContext);

    function openDocument(id?: string) {
        if (undefined === id) return;
        setPaneTitle("Attachment: " + id);
        setPaneContents(<CFViewer attachment_id={id} page_number={"1"}/>);
        openPane();
    }

    if (undefined === props.attachment) return (<></>);

    return (
        <>
            <Button variant={"outline-info"} className={"mt-2"}
                    onClick={() => openDocument(props.attachment?.id)}
                    hidden={!props.attachment.ocr}>View OCR'd document <FontAwesome
                name={"file-pdf-o"}/></Button>
        </>
    )
};