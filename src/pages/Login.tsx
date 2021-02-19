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
                        });
                        history.push("/");
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
                <Col className={"offset-md-2"} md={6}>
                    <h3>Log in with either provider below</h3>
                    <p>We use your email address to allow notifications to be sent to you when any content changes / is
                        updated</p>
                </Col>
            </Row>
            <Row>
                <Col className={"offset-md-2"} md={4}>
                    <Card>
                        <Card.Header>Google Login</Card.Header>
                        <Card.Body>
                            <Card.Title>Sign in with Google</Card.Title>
                            <Card.Text>
                                <Button size={"lg"} className={"rounded"} block onClick={() => {
                                    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                                    firebase.auth().signInWithPopup(googleAuthProvider).then(r => {
                                    });
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
                <Col md={4} className={"mt-3 mt-md-0"}>
                    <Card>
                        <Card.Header>Email &amp; Password</Card.Header>
                        <Card.Body>
                            <Card.Title>Sign in with email address</Card.Title>
                            <Card.Text>
                                <Button size={"lg"} className={"rounded"} block variant={"success"} onClick={() => {
                                    const provider = new firebase.auth.OAuthProvider('microsoft.com');
                                    provider.setCustomParameters({
                                        // Force re-consent.
                                        prompt: 'consent',
                                    });
                                    provider.addScope('email');

                                    firebase.auth().signInWithPopup(provider).then(r => {
                                        console.log(r);
                                    });
                                }}>
                                    <div className={"d-flex justify-content-between align-items-center"}>
                                        <FontAwesome name={"envelope-o"} size={"3x"}/>
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