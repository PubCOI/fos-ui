import {Alert, Button, ListGroup, Modal} from "react-bootstrap";
import {AlertWrapper} from "../AlertWrapper";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {LoadingWrapper} from "../LoadingWrapper";
import {hide} from "react-functional-modal";
import {isValid, toNormalised} from "postcode";
import FontAwesome from "react-fontawesome";
import firebase from "firebase";
import {ToastProvider, useToasts} from "react-toast-notifications";
import {FOSToastContainer} from "../FOSToastContainer";

interface ClientDetailsDAO {
    id: string,
    clientName: string,
    canonical: boolean,
    canonicalID: string,
    postCode: string,
}

interface ClientSearchResponse {
    id: string,
    clientName: string,
    score: number
}

export const ResolveClientModal = (props: { id: string, taskID: string, removeTaskCallback: (taskID: string) => void }) => {
    const [authenticated] = useState(null !== firebase.auth().currentUser);
    const {addToast} = useToasts();
    const [client, setClient] = useState<ClientDetailsDAO>({
        id: "",
        clientName: "",
        canonical: false,
        canonicalID: "",
        postCode: ""
    });
    const [clientSearchResponse, setClientSearchResponse] = useState<ClientSearchResponse[]>([{
        id: "",
        clientName: "",
        score: 0.0
    }]);
    const [searchResponseSize, setSearchResponseSize] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    let statusURL = `/api/ui/tasks/resolve_client/${props.id}`;

    useEffect(() => {
        axios.get<ClientDetailsDAO>(statusURL).then(response => {
            setClient(response.data);
        })
            .then(() => setLoaded(true))
            .catch(() => setError(true));
    }, []);

    useEffect(() => {
        // short-circuit if param is empty
        if (client.clientName === "") return;
        axios.get<ClientSearchResponse[]>("/api/ui/graphs/clients", {
            params: {
                query: encodeURIComponent(client.clientName),
                currentNode: client.id
            }
        })
            .then(response => {
                setClientSearchResponse(response.data)
            })
            .catch(error => {
                addToast(
                    error.toString(),
                    {
                        appearance: "error",
                        autoDismiss: true,
                    }
                )
            })
    }, [client]);

    useEffect(() => {
        setSearchResponseSize(clientSearchResponse.length);
    }, [clientSearchResponse]);

    if (error) {
        return <AlertWrapper text={`Unable to load task ID ${props.id}`}/>
    }

    if (!loaded) {
        return <LoadingWrapper/>
    }

    function openLink(url: string) {
        window.open(url)
    }

    return (
        <Modal backdrop={"static"} show centered size={"xl"}>
            <Modal.Header closeButton onClick={() => hide("key#" + props.taskID)}>
                <Modal.Title>Task: Resolve client</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <table cellPadding={5} className={"mb-2"}>
                    <tbody>
                    <tr>
                        <td>Node&nbsp;ID</td>
                        <td className={"text-monospace bg-light"}>{client?.id}</td>
                    </tr>
                    <tr>
                        <td>Client&nbsp;name</td>
                        <td>{client?.clientName}</td>
                    </tr>
                    <tr>
                        <td>Location</td>
                        <td>{isValid(client?.postCode) ?
                            toNormalised(client?.postCode as string) : client?.postCode} &mdash; open
                            in <a href={"#"} onClick={
                                () => openLink(`https://google.co.uk/maps?q=${client?.postCode}`)
                            }>Google Maps <FontAwesome name={"external-link"}/></a></td>
                    </tr>
                    <tr>
                        <td>Canonical</td>
                        <td>{client?.canonical ? "Yes" : "No"}</td>
                    </tr>
                    {(null !== client?.canonicalID) ?
                        <tr>
                            <td>Canonical ID</td>
                            <td>{client?.canonicalID}</td>
                        </tr>
                        : <></>
                    }
                    </tbody>
                </table>

                <Alert variant={"success"} hidden={searchResponseSize < 1} className={"mb-0"}>
                    <FontAwesome name={"arrow-down"}/> Some possible related entries were found
                </Alert>

                <ListGroup>
                    {clientSearchResponse.map(searchResponse => (
                        <ListGroup.Item key={`fts_result_${searchResponse.id}`}
                                        className={"d-flex justify-content-between align-items-center"}>
                            <span><FontAwesome name={"building-o"}
                                               className={"mr-2"}/> {searchResponse.clientName}</span>
                            <Button size={"sm"} variant={"success"}
                                    onClick={() => {

                                    }}
                                    disabled={!authenticated}><FontAwesome
                                name={"link"}/> Link records</Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>

                <ToastProvider components={{ToastContainer: FOSToastContainer}}>
                    <ActionsButtons details={client} taskID={props.taskID}
                                    removeTaskCallback={props.removeTaskCallback}/>
                </ToastProvider>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => hide("key#" + props.taskID)}>
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

interface SetAsCanonicalResponse {
    response: string
}

enum FOSTasks {
    canonical_client = "mark_canonical_clientNode"
}

const ActionsButtons = (props: { details: ClientDetailsDAO, taskID: string, removeTaskCallback: (taskID: string) => void }) => {
    const {addToast} = useToasts();

    if (undefined === props.details.id || null === firebase || null === firebase.auth()) {
        return <></>
    }
    const currentUser = firebase.auth().currentUser;
    if (null == currentUser) {
        return <></>
    }

    function setAsCanonical(entityID: string | undefined, authToken: string, taskID: string, removeTaskCallback: (taskID: string) => void) {
        axios.put<SetAsCanonicalResponse>(`/api/ui/tasks/${FOSTasks.canonical_client}`, {
            authToken: authToken,
            target: entityID,
            taskID: taskID
        })
            .then(value => {
                removeTaskCallback(taskID);
                addToast(value.data.response, {
                    appearance: "success",
                    autoDismiss: true,
                    id: entityID,
                    onDismiss: () => {
                        hide("key#" + taskID)
                    }
                });
            })
            .catch(reason => {
                addToast(reason.toString(), {
                    appearance: "error",
                    autoDismiss: true,
                });
            })
    }

    return (
        <>
            <div hidden={props.details.canonical}>
                <hr/>
                <h5><FontAwesome name={"warning"} className={"mx-1"}/> Node actions</h5>
                <Button variant={"danger"}
                        className={"text-dark"} size={"sm"} block
                        onClick={() => {
                            currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
                                setAsCanonical(props.details.id, idToken, props.taskID, props.removeTaskCallback);
                            }).catch(function (error) {
                                addToast(error.toString(), {
                                    appearance: "error",
                                    autoDismiss: true,
                                });
                            });
                        }}>
                    Designate as canonical entity
                </Button>
            </div>
        </>
    )
};