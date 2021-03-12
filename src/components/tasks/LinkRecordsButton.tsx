import FontAwesome from "react-fontawesome";
import {Button} from "react-bootstrap";
import React, {useState} from "react";
import firebase from "firebase";
import {linkToParent} from "./ResolveClientModal";
import {useToasts} from "react-toast-notifications";

// this is absolutely disgusting

export const LinkRecordsButton = (props: { currentUser: firebase.User | null, taskId: string, source: string, target: string, removeTaskCB: (taskId: string) => void }) => {

    const {addToast} = useToasts();
    const [disabled, setDisabled] = useState(false);
    const [authenticated] = useState(null !== props.currentUser);
    const [buttonIcon, setButtonIcon] = useState("link");

    return (
        <Button size={"sm"} variant={"success"}
                onClick={() => {
                    if (null === props.currentUser) return;
                    setDisabled(true);
                    setButtonIcon("spinner");
                    props.currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
                        console.debug(`linking ${props.source} to ${props.target}`);
                        linkToParent(props.taskId, idToken, props.source, props.target, props.removeTaskCB, addToast, setButtonIcon);
                    }).catch(function (error) {
                        addToast(error.toString(), {
                            appearance: "error",
                            autoDismiss: true,
                        });
                    });
                }}
                disabled={!authenticated || disabled}><FontAwesome
            name={buttonIcon} spin={buttonIcon === "spinner"}/> Link records</Button>
    )
};