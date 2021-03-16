import React, {useEffect, useState} from "react";
import {useToasts} from "react-toast-notifications";
import axios from "axios";
import {NoticeResponseDAO} from "../../interfaces/NoticeResponseDAO";
import Moment from "react-moment";
import {AwardDAO} from "../../interfaces/DAO/AwardDAO";
import {MinMaxValueFormat} from "../MinMaxValueFormat";
import {Alert, Badge, Button, ListGroup} from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import {ContractValueFormat} from "../ContractValueFormat";
import {AttachmentsAccordion} from "./AttachmentsAccordion";

export const RenderAwardMetadata = (props: {id: string}) => {
    const {addToast} = useToasts();

    const [award, setAward] = useState<AwardDAO>({
        attachments: [],
        id: "",
        noticeId: "",
        noticeTitle: "",
        organisation: "",
        supplierName: "",
        supplierNumTotalAwards: -1,
        value: 0,
        valueMax: 0,
        valueMin: 0,
        group_award: false
    });

    let baseURL = `/api/ui/awards/${props.id}`;

    useEffect(() => {
        axios.get<AwardDAO>(baseURL).then(response => {
            setAward(response.data);
        })
            .then(() => {
            })
            .catch(() => {
                addToast("Error, unable to load data", {
                    appearance: "error",
                    autoDismiss: true,
                });
            });

    }, [props.id]);

    return (
        <>
            <div><Badge pill variant={"dark"} className={"w-100"}>supplier</Badge></div>
            <Alert variant={"dark"}>{award.supplierName}</Alert>

            <div hidden={!award.group_award}><Badge pill variant={"info"} className={"w-100"}>group award</Badge></div>
            <Alert variant={"secondary"}>Value: <ContractValueFormat award={award}/></Alert>

            <div><Badge pill variant={"primary"} className={"w-100"}>attachments</Badge></div>

            <AttachmentsAccordion award={award}/>

            {(award.attachments.length === 0) && (
                <Alert variant={"primary"}><FontAwesome name={"warning"}/> No attachments</Alert>
            )}
        </>
    );
};