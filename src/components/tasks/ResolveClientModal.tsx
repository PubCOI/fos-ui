import {Alert, Button, ListGroup, Modal} from "react-bootstrap";
import {AlertWrapper} from "../AlertWrapper";
import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import {LoadingWrapper} from "../LoadingWrapper";
import {isValid, toNormalised} from "postcode";
import FontAwesome from "react-fontawesome";
import firebase from "firebase";
import {Options, ToastProvider, useToasts} from "react-toast-notifications";
import {LinkToParentResponse} from "../../interfaces/LinkToParentResponse";
import {LinkRecordsButton} from "./LinkRecordsButton";
import {FosToastContainer} from "../FosToastContainer";
import AppContext from "../core/AppContext";

interface ClientDetailsDAO {
    id: string,
    name: string,
    canonical: boolean,
    canonicalId: string,
    postCode: string,
}

interface ClientSearchResponse {
    id: string,
    name: string,
    score: number
}

export const ResolveClientModal = (props: { id: string, taskId: string, removeTaskCB: (taskId: string) => void }) => {
    const {hideModal} = useContext(AppContext);
    const {addToast} = useToasts();
    const [client, setClient] = useState<ClientDetailsDAO>({
        id: "",
        name: "",
        canonical: false,
        canonicalId: "",
        postCode: ""
    });
    const [clientSearchResponse, setClientSearchResponse] = useState<ClientSearchResponse[]>([{
        id: "",
        name: "",
        score: 0.0
    }]);
    const [searchResponseSize, setSearchResponseSize] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [currentUser, setCurrentUser] = useState(firebase.auth().currentUser);

    let statusURL = `/api/ui/tasks/resolve_client/${props.id}`;

    useEffect(() => {
        setCurrentUser(firebase.auth().currentUser)
    }, [firebase.auth().currentUser]);

    useEffect(() => {
        axios.get<ClientDetailsDAO>(statusURL).then(response => {
            setClient(response.data);
        })
            .then(() => setLoaded(true))
            .catch(() => setError(true));
    }, []);

    useEffect(() => {
        // short-circuit if param is empty
        if (client.name === "" || client?.canonical) return;
        axios.get<ClientSearchResponse[]>("/api/graphs/_search/clients", {
            params: {
                query: encodeURIComponent(client.name),
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
                );
                setClientSearchResponse([]);
            })
    }, [client]);

    useEffect(() => {
        setSearchResponseSize(clientSearchResponse.length);
    }, [clientSearchResponse]);

    if (error) {
        return <AlertWrapper text={`Unable to load task ${props.id}`}/>
    }

    if (!loaded) {
        return <LoadingWrapper/>
    }

    function openLink(url: string) {
        window.open(url)
    }

    return (
        <Modal backdrop={"static"} show centered size={"xl"}>
            <Modal.Header closeButton onClick={() => hideModal()}>
                <Modal.Title>Task: Resolve client</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <table cellPadding={5} className={"mb-2"}>
                    <tbody>
                    <tr>
                        <td>Node</td>
                        <td className={"text-monospace bg-light"}>{client?.id}</td>
                    </tr>
                    <tr>
                        <td>Client&nbsp;name</td>
                        <td>{client?.name}</td>
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
                    {(null !== client?.canonicalId) ?
                        <tr>
                            <td>Canonical ID</td>
                            <td>{client?.canonicalId}</td>
                        </tr>
                        : <></>
                    }
                    </tbody>
                </table>

                <Alert variant={"success"} hidden={client?.canonical || searchResponseSize < 1} className={"mb-0"}>
                    <FontAwesome name={"arrow-down"}/> Some possible related entries were found
                </Alert>

                <ListGroup className={client?.canonical ? "d-none" : ""}>
                    {clientSearchResponse.map(canonicalFTSResponse => (
                        <ListGroup.Item key={`fts_result_${canonicalFTSResponse.id}`}
                                        className={"d-flex justify-content-between align-items-center"}>
                            <span><FontAwesome name={"building-o"}
                                               className={"mr-2"}/> {canonicalFTSResponse.name}</span>
                            <LinkRecordsButton taskId={props.taskId}
                                               source={client?.id}
                                               target={canonicalFTSResponse.id}
                                               removeTaskCB={props.removeTaskCB} currentUser={currentUser}/>
                        </ListGroup.Item>
                    ))}
                </ListGroup>

                <ToastProvider components={{ToastContainer: FosToastContainer}}>
                    <ActionsButtons details={client} taskId={props.taskId}
                                    removeTaskCallback={props.removeTaskCB}/>
                </ToastProvider>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => hideModal()}>
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

interface SetAsCanonicalResponse {
    response: string
}

enum FosTasks {
    canonical_client = "mark_canonical_clientNode",
    link_client_parent = "link_clientNode_to_parentClientNode"
}

const ActionsButtons = (props: { details: ClientDetailsDAO, taskId: string, removeTaskCallback: (taskId: string) => void }) => {
    const {hideModal} = useContext(AppContext);
    const {addToast} = useToasts();

    if (undefined === props.details.id || null === firebase || null === firebase.auth()) {
        return <></>
    }
    const currentUser = firebase.auth().currentUser;
    if (null == currentUser) {
        return <></>
    }

    function setAsCanonical(entityId: string | undefined, authToken: string, taskId: string, removeTaskCallback: (taskId: string) => void) {
        axios.put<SetAsCanonicalResponse>(`/api/ui/tasks/${FosTasks.canonical_client}`, {
            authToken: authToken,
            target: entityId,
            taskId: taskId
        })
            .then(value => {
                removeTaskCallback(taskId);
                addToast(value.data.response, {
                    appearance: "success",
                    autoDismiss: true,
                    id: entityId,
                    onDismiss: () => {hideModal()}
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
                                setAsCanonical(props.details.id, idToken, props.taskId, props.removeTaskCallback);
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

// todo this whole function is a shit-show and needs rewritten ... I mean, look at this signature, wtf was I doing
export function linkToParent(taskId: string, authToken: string, source: string, target: string, removeTaskCB: (taskId: string) => void,
                             addToast: (content: React.ReactNode, options?: Options, callback?: (id: string) => void) => void,
                             setButtonIcon: (icon: string) => void, hideModalCallback: () => void
) {
    axios.put<LinkToParentResponse>(`/api/ui/tasks/${FosTasks.link_client_parent}`, {
        authToken: authToken,
        source: source,
        target: target,
        taskId: taskId
    })
        .then(value => {
            removeTaskCB(taskId);
            setButtonIcon("check");
            addToast(value.data.response, {
                appearance: "success",
                autoDismiss: true,
                id: taskId,
                onDismiss: () => {
                    hideModalCallback()
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