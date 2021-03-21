import {AwardDAO} from "../../interfaces/DAO/AwardDAO";
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
                <Accordion>
                    {props.award.attachments.map(attachment => (
                        <Card key={"attachment_card_" + attachment.id}>
                            <Accordion.Toggle as={Card.Header} eventKey={"attachment-" + attachment.id}>
                                <div className={"d-flex align-items-center justify-content-between"}>
                                    <div>{attachment.type}{(attachment.description ? `: ${attachment.description}` : "")}</div>
                                    <>{(attachment.mime) ? <Badge className={"ml-3"}
                                        pill variant={"primary"}>{attachment.mime}</Badge> : null} <FontAwesome
                                        name={"warning"} className={"ml-3"} hidden={attachment.ocr}/>
                                    </>
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
}