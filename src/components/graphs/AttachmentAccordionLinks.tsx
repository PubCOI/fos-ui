import {AttachmentDTO} from "../../interfaces/AttachmentDTO";
import {Button} from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import React, {useContext} from "react";
import PaneContext from "../core/PaneContext";
import {CFViewer} from "../viewer/CFViewer";

export const AttachmentAccordionLinks = (props: { attachment: AttachmentDTO }) => {

    const {setPaneTitle, setPaneContents, openPane} = useContext(PaneContext);

    function openDocument(id: string) {
        setPaneTitle("Attachment: " + id);
        setPaneContents(<CFViewer attachment_id={id} page_number={"1"}/>);
        openPane();
    }

    return (
        <>
            {/*<Button variant={"outline-primary"} className={"m-1"}>Original <FontAwesome*/}
            {/*    name={"external-link"}/></Button>*/}
            <Button variant={"outline-info"} className={"mt-2"}
                    onClick={() => openDocument(props.attachment.id)}
                    hidden={!props.attachment.ocr}>View OCR'd document <FontAwesome
                name={"file-pdf-o"}/></Button>
        </>
    )
};