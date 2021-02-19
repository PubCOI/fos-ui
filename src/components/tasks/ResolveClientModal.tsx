import {Button, Modal} from "react-bootstrap";
import {AlertWrapper} from "../AlertWrapper";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {useHistory} from "react-router";
import {LoadingWrapper} from "../LoadingWrapper";
import {hide} from "react-functional-modal";
import {toNormalised} from "postcode";
import FontAwesome from "react-fontawesome";
import firebase from "firebase";
import {ToastProvider, useToasts} from "react-toast-notifications";
import {FOSToastContainer} from "../FOSToastContainer";

interface ClientDetailsDAO {
    id: string,
    clientName: string,
    isCanonical: boolean,
    canonicalID: string,
    postCode: string,
}

export const ResolveClientModal = (props: { id: string }) => {
    const [client, setClient] = useState<ClientDetailsDAO>();
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    let statusURL = `/api/ui/tasks/resolve_client/${props.id}`;

    useEffect(() => {
        axios.get<ClientDetailsDAO>(statusURL).then(response => {
            setClient(response.data)
        })
            .then(() => setLoaded(true))
            .catch(() => setError(true));
    }, []);


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
            <Modal.Header closeButton onClick={() => hide("key#" + props.id)}>
                <Modal.Title>Task: Resolve client</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <table cellPadding={5}>
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
                        <td>{toNormalised(client?.postCode as string)} &mdash; open in <a href={"#"}
                                                                                          onClick={() => openLink(`https://google.co.uk/maps?q=${client?.postCode}`)}>Google
                            Maps <FontAwesome name={"external-link"}/></a></td>
                    </tr>
                    <tr>
                        <td>Canonical</td>
                        <td>{client?.isCanonical ? "Yes" : "No"}</td>
                    </tr>
                    {(null !== client?.canonicalID) ?
                        <tr>
                            <td>Canonical ID</td>
                            <td>{client?.canonicalID}</td>
                        </tr>
                        : <></>
                    }
                    <tr>
                        <td>&nbsp;</td>
                        <td>
                            <ToastProvider components={{ToastContainer: FOSToastContainer}}>
                                <ActionsButtons clientID={client?.id}/>
                            </ToastProvider>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => hide("key#" + props.id)}>
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

interface SetAsCanonicalResponse {
    response: string
}

const ActionsButtons = (props: { clientID: string | undefined }) => {

    const {addToast} = useToasts();

    if (undefined === props.clientID || null === firebase || null === firebase.auth()) {
        return <></>
    }
    const currentUser = firebase.auth().currentUser;
    if (null == currentUser) {
        return <></>
    }

    function setAsCanonical(id: string | undefined, idToken: string) {
        axios.put<SetAsCanonicalResponse>(`/api/ui/tasks/resolve_client/${id}?canonical=true`, {
            authToken: idToken
        })
            .then(value => {

                addToast(value.data.response, {
                    appearance: "success",
                    autoDismiss: true,
                    id: id,
                    onDismiss: () => {hide("key#" + id)}
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
            <div>
                <Button variant={"danger"} className={"text-dark"} size={"sm"} onClick={() => {
                    currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
                        setAsCanonical(props.clientID, idToken);
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