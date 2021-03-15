import React, {useEffect, useState} from "react";
import {useToasts} from "react-toast-notifications";
import axios from "axios";
import {NoticeResponseDAO} from "../../interfaces/NoticeResponseDAO";
import Moment from "react-moment";
import {AwardDAO} from "../../interfaces/DAO/AwardDAO";
import {MinMaxValueFormat} from "../MinMaxValueFormat";
import {Button, ListGroup} from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import {ContractValueFormat} from "../ContractValueFormat";

export const RenderNoticeMetadata = (props: {id: string, awardDetailsCB: (id: string) => void}) => {
    const {addToast} = useToasts();

    const [notice, setNotice] = useState<NoticeResponseDAO>({
        id: "",
        title: "",
        description: "",
        organisation: "",
        postedDT: "",
        valueLow: 0.0,
        valueHigh: 0.0,
        awards: [] as AwardDAO[]
    });

    let baseURL = `/api/ui/graphs/notices/${props.id}`;

    useEffect(() => {
        axios.get<NoticeResponseDAO>(baseURL).then(response => {
            setNotice(response.data);
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
            <div>{notice.title}</div>
            <div className={"mb-2 text-muted small"}>Published by {notice.organisation} <Moment date={notice.postedDT} format={"DD MMM yyyy"}/> (<Moment from={notice.postedDT} ago/> ago)</div>
            <h6>Value</h6>
            <div className={"mb-2"}>{<MinMaxValueFormat min={notice.valueLow} max={notice.valueHigh} rounded/>}</div>
            <h6>{notice.awards.length} {notice.awards.length === 1 ? "award" : "awards"} published</h6>
            <ListGroup className={"y-scroll"}>

                {notice.awards.map(award => (
                    <ListGroup.Item key={`award_metadata_${award.id}`} action
                                    onClick={() => props.awardDetailsCB(award.id)}>
                        <div className={"d-flex justify-content-between align-items-center"}>
                            <div>{award.supplierName}: <ContractValueFormat award={award}/></div>
                        </div>
                    </ListGroup.Item>
                ))}

            </ListGroup>

        </>
    );
};