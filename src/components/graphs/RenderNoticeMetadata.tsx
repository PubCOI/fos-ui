import React, {useEffect, useState} from "react";
import {useToasts} from "react-toast-notifications";
import axios from "axios";
import {NoticeResponseDAO} from "../../interfaces/NoticeResponseDAO";
import Moment from "react-moment";
import {AwardDAO} from "../../interfaces/AwardDAO";
import {MinMaxValueFormat} from "../MinMaxValueFormat";
import {ListGroup} from "react-bootstrap";

export const RenderNoticeMetadata = (props: {id: string}) => {
    const {addToast} = useToasts();

    const [notice, setNotice] = useState<NoticeResponseDAO>({
        id: "",
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

            <div className={"mb-2"}>Published by {notice.organisation} <Moment date={notice.postedDT} format={"DD MMM yyyy"}/> (<Moment from={notice.postedDT} ago/> ago)</div>
            <h6>Value</h6>
            <div className={"mb-2"}>{<MinMaxValueFormat min={notice.valueLow} max={notice.valueHigh} rounded/>}</div>
            <h6>Awarded to {notice.awards.length} {notice.awards.length > 1 ? "companies" : "company"}</h6>
            <ListGroup>

                {notice.awards.map(award => (
                    <ListGroup.Item key={`award_metadata_${award.id}`}>
                        <div>{award.supplierName}</div>
                    </ListGroup.Item>
                ))}

            </ListGroup>

        </>
    );
};