import {Button, Col, Form, Row} from "react-bootstrap";
import React, {FormEvent, useContext, useState} from "react";
import AppContext from "../components/AppContext";
import {useToasts} from "react-toast-notifications";
import axios from "axios";

export const Profile = () => {

    const {addToast} = useToasts();
    const appContext = useContext(AppContext);
    const [displayName, setDisplayName] = useState(appContext.displayName);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitted(true);
        let f = new FormData(e.currentTarget);
        f.set('displayName', displayName);
        // f.set('_csrf', (status.csrf) ? status.csrf : '');
        axios.put("/api/ui/users", {
            method: "PUT",
            body: f,
        })
            .then(() => {
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
            })
    };

    return (
        <>
            <Row>
                <Col md={8} className={"offset-md-2"}>
                    <h3>Profile</h3>
                </Col>
            </Row>
            <Row>
                <Col md={8} className={"offset-md-2 shadow p-3"}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
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