import {Button, Col, Form, Row} from "react-bootstrap";
import React, {FormEvent, useContext, useEffect, useState} from "react";
import AppContext from "../components/core/AppContext";
import {useToasts} from "react-toast-notifications";
import axios, {AxiosResponse} from "axios";
import firebase from "firebase";
import {UpdateProfileRequestDAO, UpdateProfileResponseDAO} from "../interfaces/DAO/UserDAO";

export const Profile = () => {

    const {addToast} = useToasts();
    const appContext = useContext(AppContext);
    const [displayName, setDisplayName] = useState(appContext.displayName);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // auth
    const [authToken, setAuthToken] = useState("");
    useEffect(() => {
        firebase.auth().currentUser?.getIdToken(/* forceRefresh */ true).then(function (idToken) {
            setAuthToken(idToken);
        });
    }, [firebase.auth().currentUser]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitted(true);
        let data = {
            displayName: displayName
        };
        axios.put<UpdateProfileRequestDAO, AxiosResponse<UpdateProfileResponseDAO>>("/api/ui/user", data, {
            headers: {
                authToken: authToken
            }
        })
            .then((r) => {
                addToast("Updated profile", {
                    appearance: "success",
                    autoDismiss: true,
                });
                appContext.setDisplayName(displayName);
                setIsSubmitted(false);
            })
            .catch((reason) => {
                addToast(reason.toString(), {
                    appearance: "error",
                    autoDismiss: true,
                });
                setIsSubmitted(false);
            })
    };

    return (
        <>
            <Row className={"mt-3"}>
                <Col md={8} className={"offset-md-2"}>
                    <h3>Profile</h3>
                </Col>
            </Row>
            <Row>
                <Col md={8} className={"offset-md-2 shadow p-3"}>
                    <Form onSubmit={handleSubmit}>

                        <Form.Group controlId="profileForm.name">
                            <Form.Label>Display name</Form.Label>
                            <Form.Control type="text" placeholder="Display name" onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ): void => setDisplayName(e.target.value)} value={displayName}/>
                            <Form.Text className="text-muted">
                                Change this to whatever you wish others to see: you can use your
                                full name, nickname or a pseudonym.
                            </Form.Text>
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={isSubmitted}>
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </>
    )
};