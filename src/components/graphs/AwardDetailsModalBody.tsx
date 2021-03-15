import {AwardDAO} from "../../interfaces/DAO/AwardDAO";
import {Col, Modal, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {ContractValueFormat} from "../ContractValueFormat";
import FontAwesome from "react-fontawesome";
import {AttachmentsAccordion} from "./AttachmentsAccordion";

export const AwardDetailsModalBody = (props: { award: AwardDAO | undefined }) => {

    const [noticeURL, setNoticeURL] = useState("");
    const [awardURL, setAwardURL] = useState("");

    const titleRowWidth = 3;

    const cfBaseURL = "https://www.contractsfinder.service.gov.uk/Notice";

    useEffect(() => {
        setNoticeURL(`${cfBaseURL}/${props.award?.noticeId}`);
        setAwardURL(`${cfBaseURL}/Award/${props.award?.noticeId}`)
    }, [props]);

    let totalAwards = props.award?.supplierNumTotalAwards || -1;

    if (!props.award) return (<></>);

    return (
        <>
            <Modal.Body>
                <Row>
                    <Col sm={titleRowWidth}>Award&nbsp;ID</Col>
                    <Col>{props.award.id}</Col>
                </Row>
                <Row>
                    <Col sm={titleRowWidth}>Awarded to</Col>
                    <Col>
                        <div>{props.award.supplierName}</div>
                        <div hidden={totalAwards < 2} className={"text-muted"}>
                            {totalAwards - 1} other award{(totalAwards - 1) === 1 ? " is" : "(s) are"} linked to this supplier
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col sm={titleRowWidth}>Value</Col>
                    <Col><ContractValueFormat award={props.award}/></Col>
                </Row>
                <Row>
                    <Col sm={titleRowWidth}>External links</Col>
                    <Col>
                        <ul className={"list-unstyled mb-0"}>
                            <li><a href={noticeURL} onClick={() => window.open(noticeURL)}
                                   rel={"noreferrer"}
                                   target={"_blank"}>Notice on Gov UK <FontAwesome name={"external-link"}/></a></li>
                        </ul>
                    </Col>
                </Row>
                <Row>
                    <Col sm={titleRowWidth}>Attachments</Col>
                    <Col><FontAwesome name={"warning"} className={"mr-2"}
                                      hidden={props.award?.attachments.length > 0}/>{props.award?.attachments.length} total</Col>
                </Row>
                <Row className={"my-2"}>
                    <Col><AttachmentsAccordion award={props.award}/></Col>
                </Row>
            </Modal.Body>
        </>
    )
};