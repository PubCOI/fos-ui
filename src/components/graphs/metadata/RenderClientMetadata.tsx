import React, {useContext, useEffect, useState} from "react";
import {ClientNodeResponseDAO} from "../../../interfaces/ClientNodeResponseDAO";
import {useToasts} from "react-toast-notifications";
import axios from "axios";
import {Button, ListGroup} from "react-bootstrap";
import {NoticeResponseDAO} from "../../../interfaces/NoticeResponseDAO";
import {MinMaxValueFormat} from "../../MinMaxValueFormat";
import {INodeMetadata, NodeMetadataType} from "../../../interfaces/INodeMetadata";
import FontAwesome from "react-fontawesome";
import AppContext from "../../core/AppContext";
import {AddRelationshipModal} from "../modals/AddRelationshipModal";

export const RenderClientMetadata = (
    props: {
        metadata: INodeMetadata,
        setMetadataCallback: (metadata: INodeMetadata) => void
    }
) => {
    let baseURL = `/api/graphs/clients/${props.metadata.id}/metadata`;
    const [client, setClient] = useState<ClientNodeResponseDAO>({
        id: "",
        name: "",
        postCode: "",
        noticeCount: -1,
        normalisedPostCode: "",
        notices: [] as NoticeResponseDAO[]
    });

    const {addToast} = useToasts();
    const {setModalBody} = useContext(AppContext);

    useEffect(() => {
        axios.get<ClientNodeResponseDAO>(baseURL).then(response => {
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

    }, [props.metadata.id]);

    function addRelationshipModal(metadata: INodeMetadata) {
        setModalBody(<AddRelationshipModal metadata={metadata}/>);
    }

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
                            type: NodeMetadataType.notice,
                            neo4j_id: "",
                            clear_graph: false,
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

            <hr/>

            <div>
                <Button
                    onClick={() => addRelationshipModal(props.metadata)}
                    variant={"outline-secondary"} size={"sm"} block><FontAwesome name={"plus"}/> Add relationship</Button>
            </div>
        </>
    );
};