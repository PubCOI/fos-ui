import React, {useEffect, useState} from "react";
import {useToasts} from "react-toast-notifications";
import axios from "axios";
import {Alert, Badge} from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import {ContractValueFormat} from "../../ContractValueFormat";
import {AttachmentsAccordion} from "../AttachmentsAccordion";
import {AwardDTO} from "../../../generated/FosTypes";

export const RenderAwardMetadata = (props: { id: string }) => {
    const {addToast} = useToasts();

    const [award, setAward] = useState<AwardDTO>();

    let baseURL = `/api/graphs/awards/${props.id}/metadata`;

    useEffect(() => {
        axios.get<AwardDTO>(baseURL).then(response => {
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

    if (undefined === award) {
        return (<></>)
    }

    return (
        <>
            <div><Badge pill variant={"dark"} className={"w-100"}>supplier</Badge></div>
            <Alert variant={"dark"}>{award?.supplierName}</Alert>

            <div hidden={!award?.group_award}><Badge pill variant={"info"} className={"w-100"}>group award</Badge></div>
            <Alert variant={"secondary"}>Value: <ContractValueFormat award={award}/></Alert>

            <div><Badge pill variant={"primary"} className={"w-100"}>attachments</Badge></div>

            <AttachmentsAccordion award={award}/>

            {(award.attachments && award.attachments.length === 0) && (
                <Alert variant={"primary"}><FontAwesome name={"warning"}/> No attachments</Alert>
            )}
        </>
    );
};