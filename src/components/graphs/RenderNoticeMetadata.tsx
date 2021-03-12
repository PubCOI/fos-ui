import React, {useEffect, useState} from "react";
import {useToasts} from "react-toast-notifications";
import axios from "axios";
import {NoticeResponseDAO} from "./NoticeResponseDAO";
import Moment from "react-moment";

export const RenderNoticeMetadata = (props: {id: string}) => {
    const {addToast} = useToasts();

    const [notice, setNotice] = useState<NoticeResponseDAO>({
        id: "",
        description: "",
        organisation: "",
        postedDT: "",
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

            <div>Published by {notice.organisation} <Moment date={notice.postedDT} format={"DD MMM yyyy"}/> (<Moment from={notice.postedDT} ago/> ago)</div>
            <div>{notice.description}</div>

        </>
    );
};