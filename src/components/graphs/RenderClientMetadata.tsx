import React, {useEffect, useState} from "react";
import {ClientResponseDAO} from "../../interfaces/ClientResponseDAO";
import {useToasts} from "react-toast-notifications";
import axios from "axios";
import {ListGroup} from "react-bootstrap";
import {NoticeResponseDAO} from "../../interfaces/NoticeResponseDAO";
import {MinMaxValueFormat} from "../MinMaxValueFormat";
import {INodeMetadata, NodeMetadataType} from "../../interfaces/INodeMetadata";

export const RenderClientMetadata = (
    props: {
        id: string;
        setMetadataCallback: (metadata: INodeMetadata) => void
    }
) => {
    let baseURL = `/api/ui/graphs/clients/${props.id}`;
    const [client, setClient] = useState<ClientResponseDAO>({
        id: "",
        name: "",
        postCode: "",
        noticeCount: -1,
        normalisedPostCode: "",
        notices: [] as NoticeResponseDAO[]
    });

    const {addToast} = useToasts();

    useEffect(() => {
        axios.get<ClientResponseDAO>(baseURL).then(response => {
            // setClient(Object.assign(response.data, processResponse(response.data)));
            setClient(response.data)
        })
            .then(() => {
            })
            .catch((e) => {
                addToast(`Error, unable to load data`, {
                    appearance: "error",
                    autoDismiss: true,
                });
            });

    }, [props.id]);

    // function processResponse(data: ClientResponseDAO) {
    //     return {
    //         // append this to response object
    //         normalisedPostCode: (undefined !== data.postCode && data.postCode) ?
    //             (isValid(client?.postCode) ? toNormalised(client?.postCode as string) : client?.postCode) : ""
    //     };
    // }

    return (
        <>
            <div className={"my-2"}>{client.name} (<a
                href={"https://www.openstreetmap.org/search?query=" + client.postCode} target={"_blank"}
                rel={"noreferrer"}>view on map</a>)
            </div>

            <div className={"mb-2"}>{client.noticeCount} contract{(client.noticeCount > 1 ? "s" : "")} published</div>

            <ListGroup className={"y-scroll"}>

                {client.notices.map(notice => (
                    <ListGroup.Item action
                        onClick={() => props.setMetadataCallback({
                            id: notice.id,
                            type: NodeMetadataType.notice
                        })}
                        key={`notice_metadata_${notice.id}`}>
                        <div>{notice.description} (value <MinMaxValueFormat
                            min={notice.valueLow} max={notice.valueHigh}
                            rounded
                        />)
                        </div>
                    </ListGroup.Item>
                ))}

            </ListGroup>
        </>
    );
};