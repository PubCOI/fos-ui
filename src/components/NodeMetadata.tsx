import React from "react";
import {Button} from "react-bootstrap";
import {INodeMetadata} from "../interfaces/INodeMetadata";
import FontAwesome from "react-fontawesome";

export const NodeMetadata = (props: { hideCB: () => void, hidden: boolean, data: INodeMetadata }) => {

    let icon = (props.data.type === "client" ? <FontAwesome name={"users"}/> : <FontAwesome name={"file-text-o"}/>);

    return (
        <>
            <div className={"metadata-parent shadow-lg"} hidden={props.hidden}>
                <div className={"d-flex justify-content-between align-items-center"}>
                    <div><h5 className={"my-2 mr-3"}><span className={"mr-2"}>{icon}</span> Node info</h5></div>
                    <div><Button className={"ml-3"} size={"sm"} onClick={() => props.hidden}>Hide</Button></div>
                </div>
                <p>{props.data.id}</p>
            </div>
        </>
    )
};