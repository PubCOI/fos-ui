import {AwardDAO} from "../../interfaces/AwardDAO";
import {Accordion, Card, ListGroup, Modal} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {ContractValueFormat} from "../ContractValueFormat";
import FontAwesome from "react-fontawesome";
import {GetOpenExtLink} from "../GetOpenExtLink";

export const AwardDetailsModalBody = (props: { award: AwardDAO | undefined }) => {

    const [noticeURL, setNoticeURL] = useState("");
    const [awardURL, setAwardURL] = useState("");

    const hasAttachment = (props: { award: AwardDAO }) => {
        return (!props.award?.attachments || props.award.attachments.length < 1)
    };

    const cfBaseURL = "https://www.contractsfinder.service.gov.uk/Notice";

    useEffect(() => {
        setNoticeURL(`${cfBaseURL}/${props.award?.noticeId}`);
        setAwardURL(`${cfBaseURL}/Award/${props.award?.noticeId}`)
    }, [props]);

    if (!props.award) return (<></>);

    return (
        <>
            <Modal.Body>
                <table cellPadding={5} className={"w-100"}>
                    <tbody>
                    <tr>
                        <td>Award ID</td>
                        <td>{props.award.id}</td>
                    </tr>
                    <tr>
                        <td>Awarded to</td>
                        <td>{props.award.supplierName}</td>
                    </tr>
                    <tr>
                        <td>Value</td>
                        <td><ContractValueFormat award={props.award}/></td>
                    </tr>
                    <tr>
                        <td valign={"top"}>External links</td>
                        <td>
                            <ul className={"list-unstyled"}>
                                <li><a href={noticeURL} onClick={() => window.open(noticeURL)}
                                       rel={"noreferrer"}
                                       target={"_blank"}>Notice on Gov UK <FontAwesome name={"external-link"}/></a></li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <td valign={"top"}>Attachments</td>
                        <td hidden={hasAttachment({award: props.award})}>

                            <Accordion>
                                {props.award.attachments.map(attachment => (
                                <Card>
                                    <Accordion.Toggle as={Card.Header} eventKey={"attachment-" + attachment.id}>
                                        {attachment.type}: {attachment.description}
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey={"attachment-" + attachment.id}>
                                        <Card.Body>
                                            <div hidden={undefined === attachment.href}>{attachment.href} <GetOpenExtLink
                                                href={attachment.href}/>
                                            </div>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                ))}
                            </Accordion>

                        </td>
                        <td hidden={!hasAttachment({award: props.award})}>
                            None
                        </td>
                    </tr>
                    </tbody>
                </table>
            </Modal.Body>
        </>
    )
};