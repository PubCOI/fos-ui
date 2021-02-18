import React from "react";
import {Alert} from "react-bootstrap";

export const Tasks = () => {
    return (
        <>
            <h2>Data reconciliation tasks</h2>
            <Alert variant={"info"}>
                These are short data reconciliation tasks that could not be resolved automatically and
                need to be done by hand: Click on one to get started.
            </Alert>

            <h2>Recently completed by others</h2>
        </>
    )
};