import React, {useEffect, useState} from "react";
import {INodeMetadata, NodeMetadataType} from "../interfaces/INodeMetadata";
import FontAwesome from "react-fontawesome";
import {RenderNoticeMetadata} from "./graphs/metadata/RenderNoticeMetadata";
import {RenderClientMetadata} from "./graphs/metadata/RenderClientMetadata";
import {RenderAwardMetadata} from "./graphs/metadata/RenderAwardMetadata";
import {RenderPersonMetadata} from "./graphs/metadata/RenderPersonMetadata";


export const NodeMetadata = (
    props: {
        hideCallback: () => void,
        hidden: boolean,
        metadata: INodeMetadata,
        setMetadataCallback: (metadata: INodeMetadata) => void,
        showAwardDetailsCB: (id: string) => void
    }
) => {

    const [output, setOutput] = useState(<></>);
    const [icon, setIcon] = useState(<></>);

    function resetAndClose() {
        setIcon(<></>);
        setOutput(<></>);
        props.hideCallback();
    }

    useEffect(() => {
        if (undefined === props.metadata || undefined === props.metadata.type || undefined === props.metadata.id || props.metadata.id === "") {
            resetAndClose();
            return;
        }
        if (props.metadata.type === NodeMetadataType.client) {
            setIcon(<FontAwesome name={"users"}/>);
            setOutput(<RenderClientMetadata metadata={props.metadata} setMetadataCallback={props.setMetadataCallback}/>);
            return;
        }
        if (props.metadata.type === NodeMetadataType.notice) {
            setIcon(<FontAwesome name={"file-text-o"}/>);
            setOutput(<RenderNoticeMetadata id={props.metadata.id} awardDetailsCB={props.showAwardDetailsCB}/>);
            return;
        }
        if (props.metadata.type === NodeMetadataType.award) {
            setIcon(<FontAwesome name={"handshake-o"}/>);
            setOutput(<RenderAwardMetadata id={props.metadata.id}/>);
            return;
        }
        if (props.metadata.type === NodeMetadataType.organisation) {
            setIcon(<FontAwesome name={"building-o"}/>);
            //setOutput(<>{props.metadata.neo4j_id}</>);
            setOutput(<></>);
            return;
        }
        if (props.metadata.type === NodeMetadataType.person) {
            setIcon(<FontAwesome name={"user"}/>);
            setOutput(<RenderPersonMetadata id={props.metadata.id}/>);
            return;
        }
        console.debug("Did not match client or notice type");
    }, [props.metadata]);

    return (
        <>
            <div className={"metadata-parent shadow metadata-text-block"} hidden={props.hidden}>
                <div className={"d-flex justify-content-between align-items-center"}>
                    <div><h5 className={"ml-2 mr-3 mt-2"}><span className={"mr-2"}>{icon}</span> Node: {props.metadata.type}</h5></div>
                    <div>
                        <button type={"button"} className={"close"} onClick={() => resetAndClose()}>
                            <span aria-hidden={"true"}>×</span>
                        </button>

                        {/*<button type="button" className="close"><span aria-hidden="true">×</span><span*/}
                        {/*    className="sr-only">Close</span></button>*/}
                    </div>
                </div>

                {output}

                {/*<div className={"d-flex justify-content-end"}>*/}
                {/*    <Button size={"sm"} className={"mt-3"} variant={"outline-primary"}*/}
                {/*            onClick={() => resetAndClose()}>Hide</Button>*/}
                {/*</div>*/}
            </div>
        </>
    )
};