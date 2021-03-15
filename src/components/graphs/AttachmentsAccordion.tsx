import {AwardDAO} from "../../interfaces/AwardDAO";
import {Accordion, Alert, Badge, Card} from "react-bootstrap";
import {GetOpenExtLink} from "../GetOpenExtLink";
import FontAwesome from "react-fontawesome";
import React from "react";
import {AttachmentAccordionLinks} from "./AttachmentAccordionLinks";
import {DataTypeEnum, FixDataIssueWidget} from "./FixDataIssueWidget";

export const AttachmentsAccordion = (props: { award: AwardDAO }) => {

    const hasAttachment = (props: { award: AwardDAO }) => {
        return (!props.award?.attachments || props.award.attachments.length < 1)
    };

    return (
        <>
            <div hidden={hasAttachment({award: props.award})}>
                <Accordion className={"mt-2"}>
                    {props.award.attachments.map(attachment => (
                        <Card key={"attachment_card_" + attachment.id}>
                            <Accordion.Toggle as={Card.Header} eventKey={"attachment-" + attachment.id}>
                                <div className={"d-flex justify-content-between align-content-center"}>
                                    <div>{attachment.type}{(attachment.description ? `: ${attachment.description}` : "")}</div>
                                    <div>{(attachment.mime) ? <Badge
                                        pill variant={"primary"}>{attachment.mime}</Badge> : null} <FontAwesome
                                        name={"warning"} hidden={attachment.ocr}/>
                                    </div>
                                </div>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={"attachment-" + attachment.id}>
                                <Card.Body>
                                    <Alert variant={"danger"} hidden={attachment.ocr} className={"small mb-0"}>
                                        <FontAwesome name={"warning"}/> We were unable to automatically download and
                                        index this content as it was an unrecognised file type, or an external resource
                                        that did not seem to contain information relating to this contract
                                    </Alert>
                                    <FixDataIssueWidget type={DataTypeEnum.attachment} id={attachment.id}/>
                                    <div className={"mb-2"}>{(attachment.description) ?
                                        <>Resource description: {attachment.description}</> : <>No description
                                            provided</>}
                                    </div>
                                    <div hidden={!attachment.href}>Resource URL: <span
                                        className={"text-monospace"}>{attachment.href}</span> <GetOpenExtLink
                                        href={attachment.href}/>
                                    </div>
                                    <AttachmentAccordionLinks attachment={attachment}/>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    ))}
                </Accordion>
            </div>
        </>
    )
}