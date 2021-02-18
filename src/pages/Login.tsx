import {FirebaseAuthConsumer} from "@react-firebase/auth";
import {useHistory} from "react-router";
import React from "react";
import {Button, Card, Col, Row} from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import firebase from "firebase";

export const Login = () => {

    const history = useHistory();

    return (
        <>
            <FirebaseAuthConsumer>
                {({isSignedIn, user, providerId}) => {
                    if (isSignedIn) {
                        history.push("/");
                        // return <Alert variant={"info"}>Already logged in, redirecting ...</Alert>
                    } else {
                        return <LoginButtons/>
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
                    <p>We use your email address to allow notifications to be sent to you when any content changes / is updated</p>
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
                                    firebase.auth().signInWithPopup(googleAuthProvider);
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
                <Col md={4}>
                    <Card>
                        <Card.Header>Github Login</Card.Header>
                        <Card.Body>
                            <Card.Title>Sign in with Github</Card.Title>
                            <Card.Text>
                                <Button size={"lg"} className={"rounded"} block variant={"success"} onClick={() => {
                                    const githubProvider = new firebase.auth.GithubAuthProvider();
                                    firebase.auth().signInWithPopup(githubProvider);
                                }}>
                                    <div className={"d-flex justify-content-between align-items-center"}>
                                        <FontAwesome name={"github"} size={"3x"}/>
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