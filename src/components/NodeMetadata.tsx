import React, {useEffect, useState} from "react";
import {INodeMetadata, NodeMetadataType} from "./graphs/INodeMetadata";
import FontAwesome from "react-fontawesome";
import axios from "axios";
import {isValid, toNormalised} from "postcode";
import {useToasts} from "react-toast-notifications";
import {ClientResponseDAO} from "./graphs/ClientResponseDAO";
import {RenderNoticeMetadata} from "./graphs/RenderNoticeMetadata";
import {RenderClientMetadata} from "./graphs/RenderClientMetadata";
import {Button} from "react-bootstrap";


export const NodeMetadata = (props: { hideCallback: () => void, hidden: boolean, metadata: INodeMetadata }) => {

    const [output, setOutput] = useState(<></>);
    const [icon, setIcon] = useState(<></>);

    useEffect(() => {
        if (undefined === props.metadata || undefined === props.metadata.type || undefined === props.metadata.id || props.metadata.id === "") {
            setIcon(<></>);
            setOutput(<></>);
            props.hideCallback();
            return;
        }
        if (props.metadata.type === NodeMetadataType.client) {
            setIcon(<FontAwesome name={"users"}/>);
            setOutput(<RenderClientMetadata id={props.metadata.id}/>);
            return;
        }
        if (props.metadata.type === NodeMetadataType.notice) {
            setIcon(<FontAwesome name={"file-text-o"}/>);
            setOutput(<RenderNoticeMetadata id={props.metadata.id}/>);
            return;
        }
        throw new DOMException("Unable to determine node type");
    }, [props.metadata]);

    return (
        <>
            <div className={"metadata-parent shadow-lg metadata-text-block"} hidden={props.hidden}>
                <div className={"d-flex justify-content-between align-items-center"}>
                    <div><h5 className={"mr-3 mt-2"}>Node: {props.metadata.type}</h5></div>
                    <div><span className={"mr-2"}>{icon}</span></div>
                </div>

                {output}

                <div className={"d-flex justify-content-end"}>
                <Button size={"sm"} className={"mt-3"} variant={"outline-primary"}
                        onClick={() => props.hideCallback()}>Hide</Button>
                </div>
            </div>
        </>
    )
};