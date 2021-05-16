import React, {KeyboardEventHandler, useContext, useEffect, useState} from "react";
import AppContext from "../core/AppContext";
import axios, {AxiosResponse} from "axios";
import {ResolvedCOIDTOResponse, ResolvePotentialCOIDTO} from "../../generated/FosTypes";
import {useToasts} from "react-toast-notifications";
import {LoadingWrapper} from "../LoadingWrapper";
import {Alert, Button, Col, Modal, Row} from "react-bootstrap";
import firebase from "firebase";
import Moment from "react-moment";

export const ResolvePotentialCOIModal = (props: {
    taskId: string,
    removeTaskCB?: (taskID: string) => void
}) => {
    const {setModalBody, hideModal} = useContext(AppContext);
    const {addToast} = useToasts();
    const [resolveCOIResponse, setResolveCOIResponse] = useState<ResolvePotentialCOIDTO>();
    const [doResolveResponse, setDoResolveResponse] = useState<ResolvedCOIDTOResponse>();
    const [loaded, setLoaded] = useState(false);

    // auth
    const [authToken, setAuthToken] = useState("");
    useEffect(() => {
        firebase.auth().currentUser?.getIdToken(/* forceRefresh */ true)
            .then(function (idToken) {
                    setAuthToken(idToken);
                    setLoaded(true);
                }
            )
    }, [firebase.auth().currentUser]);

    useEffect(() => {
        axios.get<ResolvePotentialCOIDTO>(`/api/ui/tasks/resolve_potential_coi/${props.taskId}`)
            .then(response => {
                setResolveCOIResponse(response.data);
                setLoaded(true);
            })
            .catch(() => {
                addToast(`Error loading task ${props.taskId}`, {
                    appearance: "error",
                    autoDismiss: true
                })
            })
    }, []);

    function flag() {
        if (resolveCOIResponse?.completed) return;
        console.debug('flagging', props.taskId);
        resolve(`/api/ui/tasks/resolve_potential_coi/${props.taskId}/flag`)
    }

    function ignore() {
        if (resolveCOIResponse?.completed) return;
        console.debug('ignoring', props.taskId);
        resolve(`/api/ui/tasks/resolve_potential_coi/${props.taskId}/ignore`)
    }

    function resolve(url: string) {
        axios.put<string, AxiosResponse<ResolvedCOIDTOResponse>>(url, null, {
            headers: {
                authToken: authToken
            }
        })
            .then(response => {
                setDoResolveResponse(response.data);
                addToast(`Resolved ${props.taskId}`, {
                    autoDismiss: true,
                    appearance: "info"
                });
                props.removeTaskCB?.(props.taskId);
                if (undefined !== response.data.nextTaskId && "" !== response.data.nextTaskId) {
                    hideModal();
                    setModalBody(<ResolvePotentialCOIModal taskId={response.data.nextTaskId}
                                                           removeTaskCB={props.removeTaskCB}/>)
                } else {
                    hideModal();
                }
            })
            .catch(() => {
                addToast("Error resolving task " + props.taskId, {
                    appearance: "error",
                    autoDismiss: true,
                });
                props.removeTaskCB?.(props.taskId);
                hideModal();
            })
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.code === "Escape") hideModal();
        if (e.code === "Digit1") flag();
        if (e.code === "Digit2") ignore();
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

    if (!loaded) return <LoadingWrapper/>;

    return (
        <>
            <Modal backdrop={"static"} show centered size={"xl"}>
                <Modal.Header closeButton onClick={() => hideModal()}>
                    <Modal.Title>Potential conflict of interest</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Boolean(resolveCOIResponse?.completed) && (
                        <Alert variant={"info"}>
                            The following COI was resolved on <Moment date={resolveCOIResponse?.completedDT} format={"yyyy-MM-DD"}/>
                        </Alert>
                    )}
                    {Boolean(!resolveCOIResponse?.completed) && (
                        <p>The following records have been flagged as possibly related</p>
                    )}
                    <Alert variant={"dark"}>
                        <div className={"text-muted font-weight-bold"}>Organisation</div>
                        <div>{resolveCOIResponse?.organisation?.companyName}</div>
                        <div className={"text-muted"}>{resolveCOIResponse?.organisation?.companyAddress}</div>
                    </Alert>
                    <Alert variant={"primary"}>
                        <div className={"text-muted font-weight-bold"}>Politician</div>
                        <div className={"text-muted"}>Name: {resolveCOIResponse?.memberInterest?.personFullName}</div>
                        <div>Declaration statement:</div>
                        <div>{resolveCOIResponse?.memberInterest?.text}</div>
                    </Alert>
                    {Boolean(!resolveCOIResponse?.completed) && (
                        <Row>
                            <Col>
                                <Button variant={"danger"} block onClick={() => flag()}>Flag: potential
                                    conflict [1]</Button>
                            </Col>
                            <Col>
                                <Button variant={"primary"} block onClick={() => ignore()}>Ignore: false
                                    positive [2]</Button>
                            </Col>
                        </Row>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={() => hideModal()}> Close [esc]</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};