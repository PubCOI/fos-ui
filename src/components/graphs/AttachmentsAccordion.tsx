import {AwardMDBDTO} from "../../interfaces/DTO/AwardMDBDTO";
import {Accordion, Alert, Card} from "react-bootstrap";
import {GetOpenExtLink} from "../GetOpenExtLink";
import FontAwesome from "react-fontawesome";
import React from "react";
import {AttachmentAccordionLinks} from "./AttachmentAccordionLinks";
import {DataTypeEnum, FixDataIssueWidget} from "./FixDataIssueWidget";

export const AttachmentsAccordion = (props: { award: AwardMDBDTO }) => {

    const hasAttachment = (props: { award: AwardMDBDTO }) => {
        return (!props.award?.attachments || props.award.attachments.length < 1)
    };

    return (
        <>
            <div hidden={hasAttachment({award: props.award})}>
                <Accordion>
                    {props.award.attachments.map(attachment => (
                        <Card key={"attachment_card_" + attachment.id}>
                            <Accordion.Toggle as={Card.Header} eventKey={"attachment-" + attachment.id}>
                                <div className={"d-flex align-items-center justify-content-between"}>
                                    <div>{attachment.type}{(attachment.description ? `: ${attachment.description}` : "")}</div>
                                    <div className={"text-nowrap ml-3"}>
                                        {(attachment.href) ? <RenderMime type={"href"}/> : null}
                                        {(attachment.mime) ? <RenderMime type={attachment.mime}/> : null} <FontAwesome
                                        name={"warning"} className={"ml-1"} hidden={attachment.ocr}/>
                                    </div>
                                </div>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={"attachment-" + attachment.id}>
                                <Card.Body>
                                    <Alert variant={"danger"} hidden={attachment.ocr} className={"small"}>
                                        <FontAwesome name={"warning"}/> We were unable to automatically download and
                                        index this content as it was an unrecognised file type, or an external resource
                                        that did not seem to contain information relating to this contract
                                    </Alert>

                                    <div className={"mb-2"}>{(attachment.description) ?
                                        <>Resource description: {attachment.description}</> : <>No description
                                            provided</>}
                                    </div>

                                    <div hidden={!attachment.href}>Resource URL: <span
                                        className={"text-monospace"}>{attachment.href}</span> <GetOpenExtLink
                                        href={attachment.href}/>
                                    </div>

                                    <AttachmentAccordionLinks attachment={attachment}/>

                                    <div className={"fix-widget-inside-accordion"}>
                                        <FixDataIssueWidget type={DataTypeEnum.attachment} id={attachment.id}/>
                                    </div>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    ))}
                </Accordion>
            </div>
        </>
    )
};

const RenderMime = (props: { type: string }) => {
    let icon = "file-o";
    switch (props.type) {
        case "href":
            icon = "link";
            break;
        case "application/pdf":
            icon = "file-pdf-o";
            break;
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            icon = "file-word-o";
            break;
        default:
            console.debug(`Unable to find matching type for mime ${props.type}, returning default`)
    }

    return (
        <>
            <FontAwesome name={icon} fixedWidth/>
        </>
    )
};