import {FirebaseAuthConsumer} from "@react-firebase/auth";
import {useHistory} from "react-router";
import React from "react";
import {Button, Card, Col, Row} from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import firebase from "firebase";
import axios from "axios";

export const Login = () => {

    const history = useHistory();

    return (
        <>
            <FirebaseAuthConsumer>
                {({isSignedIn, user, providerId}) => {
                    if (isSignedIn) {
                        axios.post("/api/ui/login", {uid: user.uid}).then(r => {
                            history.push("/");
                        });
                        return <></>;
                    } else {
                        return <LoginButtons/>;
                    }
                }}
            </FirebaseAuthConsumer>
        </>
    )
};

const LoginButtons = () => {
    return (
        <>
            <Row>
                <Col className={"offset-md-4"} md={4}>
                    <h3>Log in via federation</h3>
                    <p>We currently only log users in via OAuth2, using Google as the identity provider. More
                        options will be added in due course.
                    </p>
                </Col>
            </Row>
            <Row>
                <Col className={"offset-md-4"} md={4}>
                    <Card>
                        <Card.Header>Google Login</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <Button size={"lg"} className={"rounded"} block onClick={() => {
                                    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                                    firebase.auth().signInWithPopup(googleAuthProvider).then(r => {});
                                }}>
                                    <div className={"d-flex justify-content-between align-items-center"}>
                                        <FontAwesome name={"google"} size={"3x"}/>
                                        <h3>Sign in</h3>
                                    </div>
                                </Button>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
};