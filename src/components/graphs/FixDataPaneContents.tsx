import React, {useEffect, useState} from "react";
import {DataTypeEnum} from "./FixDataIssueWidget";
import firebase from "firebase";
import {LoadingWrapper} from "../LoadingWrapper";
import {Alert, Button, Col, Form, Row} from "react-bootstrap";

interface OptionItem {
    value: string,
    text: string,
    help: string,
    canHelp?: boolean,
}

export const FixDataPaneContents = (props: { type: DataTypeEnum, id: string }) => {
    const [authToken, setAuthToken] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [errorType, setErrorType] = useState("Please select...");
    const [options, setOptions] = useState([] as OptionItem[]);
    const [optionHelp, setOptionHelp] = useState("");
    const [canHelp, setCanHelp] = useState(false);

    useEffect(() => {
        firebase.auth().currentUser?.getIdToken(/* forceRefresh */ true).then(function (idToken) {
            setAuthToken(idToken);
        });
    }, [firebase.auth().currentUser]);

    useEffect(() => {
        setLoaded(authToken !== "");
    }, [authToken]);

    useEffect(() => {
        // set options ... each data type will have different things
        // that could be wrong
        let opts = [];
        if (props.type === DataTypeEnum.award) {
            opts.push({
                text: "Attachment(s) missing",
                value: "attachments_missing",
                help: "Government and public bodies are obliged to provide contract details. Use " +
                    "this option to mark details as missing - this will help us start and track an FOI process.",
                canHelp: true,
            });
        }
        if (props.type === DataTypeEnum.attachment) {
            opts.push({
                text: "Data missing",
                value: "single_attachment_missing",
                help: "Use this option to create a ticket that will allow you to upload a document yourself, or flag it " +
                    "so that someone else can do it.",
                canHelp: true
            });
            opts.push({
                text: "Downloaded / scanned incorrectly",
                value: "attachment_incorrect",
                help: "Attachments are downloaded automatically. Sometimes the process goes wrong: use this to mark " +
                    "the record as incorrect and we'll take a look."
            });
        }
        opts.push({
            text: "Other",
            value: "other",
            help: "Use this option to report a generic data issue. This will email us to have a look at manually. " +
                "Please don't use this form for generic support enquiries."
        });
        setOptions(opts);
    }, [props.type]);

    useEffect(() => {
        if (undefined !== options && options.length > 0) {
            setOptionHelp(options[0].help);
            setCanHelp((options[0].canHelp) ? options[0].canHelp : false);
        }
    }, [options]);

    if (!loaded) {
        return <LoadingWrapper/>
    }

    if (loaded && !firebase.auth().currentUser) {
        return <Alert>You need to be logged in to report / fix data</Alert>
    }

    return (
        <>
            <Row>
                <Col><Alert variant={"primary"}>
                    <div>Reporting as {firebase.auth().currentUser?.displayName}</div>
                    <div className={"text-muted small"}>to change the name displayed publicly, go to your profile</div>
                </Alert></Col>
            </Row>
            <Form id={"reportData"} className={"form"}>
                <Form.Group controlId="reportData.error_id">
                    <Form.Label>Node ID</Form.Label>
                    <Form.Control as={"text"} readOnly>{props.type}:{props.id}</Form.Control>
                </Form.Group>
                <Form.Group controlId="reportData.error_type">
                    <Form.Label>Error type</Form.Label>
                    <Form.Control as={"select"}
                                  onChange={(
                                      e: React.ChangeEvent<HTMLSelectElement>
                                  ): void => {
                                      setErrorType(e.target.value);
                                      let help = e.target.options[e.target.selectedIndex].getAttribute("data-help");
                                      setOptionHelp((null !== help) ? help : "");
                                      let canHelp = e.target.options[e.target.selectedIndex].getAttribute("data-can-help");
                                      setCanHelp((null !== canHelp && canHelp === "true"));
                                  }}>
                        {options.map(option => (
                            <option value={option.value} data-help={option.help}
                                    data-can-help={option.canHelp}>{option.text}</option>
                        ))}
                    </Form.Control>
                    <Alert variant={"success"} hidden={optionHelp === ""}>
                        {optionHelp}
                    </Alert>
                </Form.Group>
                <Form.Group controlId="reportData.notes">
                    <Form.Label>Additional notes</Form.Label>
                    <Form.Control as="textarea" type={"text"} rows={3}/>
                </Form.Group>
                <Form.Group className={"d-flex justify-content-end"}>
                    <Button type={"submit"} variant={"primary"} className={"m-1"}>report</Button>
                    <Button type={"submit"} variant={"success"} disabled={!canHelp} className={"m-1"}>report and start fixing</Button>
                </Form.Group>
            </Form>
        </>
    )
};