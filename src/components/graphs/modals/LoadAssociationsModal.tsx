import {Alert, Button, Modal} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import AppContext from "../../core/AppContext";
import {INodeMetadata} from "../../../interfaces/INodeMetadata";
import {useToasts} from "react-toast-notifications";
import axios from "axios";
import firebase from "firebase";
import {LoadingWrapper} from "../../LoadingWrapper";

export const LoadAssociationsModal = (props: { metadata: INodeMetadata }) => {

    const {hideModal} = useContext(AppContext);
    const {addToast} = useToasts();
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

    function doLoad(id: string) {
        addToast(`Requesting data import for user ID ${id}`, {
            appearance: "info",
            autoDismiss: true
        });
        hideModal();
        axios.put(`/api/graphs/persons/${id}/populate`, null, {
            headers: {
                authToken: authToken
            }
        })
            .then((res) => {
                addToast("Finished loading data for user", {
                    autoDismiss: true,
                    appearance: "success"
                })
            })
            .catch(() => {
                addToast("Error retrieving data for user", {
                    autoDismiss: true,
                    appearance: "error"
                })
            })
    }

    if (!loaded) {
        return <LoadingWrapper/>
    }

    return (
        <>
            <Modal backdrop={"static"} show centered>
                <Modal.Header closeButton onClick={() => hideModal()}>
                    <Modal.Title>Retrieve associations</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Boolean(authToken) && (
                        <Alert variant={"primary"}>
                            <p>This will request all associations for this person. Please only request this data if you
                                wish all their associated companies to be loaded into the system.</p>
                            <div>
                                Note this can take some time to complete: A notification will display in your browser
                                once the process has finished.
                            </div>
                        </Alert>
                    )}
                    {Boolean(!authToken) && (
                        <Alert variant={"warning"}>
                            Sorry, you need to be logged in to do that
                        </Alert>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="outline-secondary"
                        onClick={() => hideModal()}>
                        Cancel
                    </Button>
                    <Button variant="success" disabled={!authToken} onClick={() => doLoad(props.metadata.fosId)}>
                        Begin data load
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
};