import {Alert} from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import React from "react";

export const LoadingWrapper = () => {
    return (
        <Alert variant={"light"}><h4><FontAwesome name={"spinner"} spin/> Loading ...</h4></Alert>
    )
};