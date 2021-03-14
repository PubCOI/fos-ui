import {AttachmentDAO} from "../../interfaces/AttachmentDAO";
import {Button} from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import React from "react";

export const AttachmentAccordionLinks = (props: { attachment: AttachmentDAO }) => {
    let ocrUrl = `/view/cf/${props.attachment.id}/page/1`;
    return (
        <>
            {/*<Button variant={"outline-primary"} className={"m-1"}>Original <FontAwesome*/}
            {/*    name={"external-link"}/></Button>*/}
            <Button variant={"outline-info"} className={"m-1"} hidden={!props.attachment.ocr}>Scanned <FontAwesome
                name={"file-pdf-o"}/></Button>
        </>
    )
};