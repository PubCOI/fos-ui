import {Col, Modal, OverlayTrigger, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {ContractValueFormat} from "../ContractValueFormat";
import FontAwesome from "react-fontawesome";
import {AttachmentsAccordion} from "./AttachmentsAccordion";
import {renderTooltip} from "../../hooks/Utils";
import {GraphPanelBadge} from "./GraphPanelBadge";
import {AwardDTO, NodeTypeEnum} from "../../generated/FosTypes";

export const AwardDetailsModalBody = (props: { award: AwardDTO | undefined }) => {

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
                    <Col sm={titleRowWidth}>Awarded for</Col>
                    <Col>{props.award?.noticeTitle}</Col>
                </Row>
                <Row>
                    <Col sm={titleRowWidth}>Award&nbsp;ID</Col>
                    <Col>{props.award?.id}<GraphPanelBadge type={NodeTypeEnum.award} id={props.award?.id}/></Col>
                </Row>
                <Row>
                    <Col sm={titleRowWidth}>Notice ID</Col>
                    <Col>{props.award?.noticeId}<GraphPanelBadge type={NodeTypeEnum.notice} id={props.award?.noticeId}/></Col>
                </Row>
                <Row>
                    <Col sm={titleRowWidth}>Awarded to</Col>
                    <Col>
                        <div>{props.award?.supplierName}</div>
                        <div hidden={totalAwards < 2} className={"text-muted"}>
                            {totalAwards - 1} other award{(totalAwards - 1) === 1 ? " is" : "(s) are"} linked to this
                            supplier
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
                    <Col><OverlayTrigger placement="auto"
                                         delay={{show: 100, hide: 250}}
                                         overlay={renderTooltip(
                                             {text: "No attachments on this notice, consider creating a task to follow up"}
                                         )}>
                        <FontAwesome name={"warning"} className={"mr-2"}
                                     hidden={(props.award?.attachments && props.award?.attachments?.length > 0)}/>
                    </OverlayTrigger>{props.award?.attachments?.length} total</Col>
                </Row>
                <Row className={"my-2"}>
                    <Col><AttachmentsAccordion award={props.award}/></Col>
                </Row>
            </Modal.Body>
        </>
    )
};