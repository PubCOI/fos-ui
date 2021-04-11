import {FirebaseAuthConsumer} from "@react-firebase/auth";
import {useHistory} from "react-router";
import React from "react";
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import firebase from "firebase";
import axios from "axios";
import {useWindowSize} from "../hooks/Utils";

export const Login = () => {
    const history = useHistory();

    return (
        <>
            <FirebaseAuthConsumer>
                {({isSignedIn, user, providerId}) => {
                    if (isSignedIn) {
                        axios.post("/api/login", {uid: user.uid}).then(r => {
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
    const size = useWindowSize();
    return (
        <>
            <Container fluid className={"p-3"}>
                <Row>
                    <Col className={`offset-sm-3 p-4 ${(size.width >= 768) ? "shadow" : ""}`} sm={6}>
                        <h3>Log in via federation</h3>
                        <p>Log in via OAuth2, using Google IdP. More login
                            options will be added in due course.
                        </p>
                        <Button size={(size.width >= 576) ? "lg" : undefined} className={"rounded shadow-sm"} block onClick={() => {
                            const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                            firebase.auth().signInWithPopup(googleAuthProvider).then(r => {
                            });
                        }}>
                            <div className={"d-flex justify-content-between align-items-center"}>
                                <FontAwesome name={"google"} size={"3x"}/>
                                <h3>Sign in</h3>
                            </div>
                        </Button>
                    </Col>
                </Row>
            </Container>
        </>
    )
};