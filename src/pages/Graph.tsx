import React, {useContext, useEffect, useRef, useState} from 'react';
import {auth, driver as neo4j_driver} from "neo4j-driver";
import cytoscape, {EdgeDataDefinition, ElementDefinition, NodeDataDefinition,} from "cytoscape";
import {NodeMetadata} from "../components/NodeMetadata";
import {INodeMetadata, NodeMetadataType} from "../interfaces/INodeMetadata";
import {AwardDetailsModal} from "../components/graphs/AwardDetailsModal";
import PaneContext from "../components/core/PaneContext";
import AppContext from "../components/core/AppContext";

let coseBilkent = require('cytoscape-cose-bilkent');

export const Graph = (props: { location: Location }) => {
    const driver = neo4j_driver("bolt://localhost", auth.basic("neo4j", "password"));

    const appContext = useContext(AppContext);
    const paneContext = useContext(PaneContext);
    const {showRightPane, setModalBody} = useContext(AppContext);

    const cyRef = useRef<HTMLDivElement | null>(null);
    const [refVisible, setRefVisible] = useState(false);
    const [cy, setCy] = useState({} as cytoscape.Core);
    const [showMetadata, setShowMetadata] = useState(false);
    const [metadata, setMetadata] = useState<INodeMetadata>({type: NodeMetadataType.client, id: ""});

    useEffect(() => {
        if (undefined !== metadata.type && undefined !== metadata.id && metadata.id !== "") {
            setShowMetadata(true);
            if (metadata.type === NodeMetadataType.notice) {
                getChildNodes(metadata.id);
            }
            // if (metadata.type === NodeMetadataType.award) {
            //     showAwardDetails(metadata.id);
            // }
        }
    }, [metadata]);

    function setMetadataViaCallback(data: INodeMetadata) {
        let ele = `node[fos_id="${data.id}"]`;
        console.debug("Updating node", ele);
        cy.elements(ele).flashClass("highlight", 1500);
        setMetadata(data);
    }

    function hideMetadata() {
        setShowMetadata(false);
    }

    function showAwardDetails(id: string) {
        console.log("Getting award details for", id);
        setModalBody(<AwardDetailsModal id={id}/>);
    }

    function getChildNodes(id: string) {
        console.debug("Requesting children of", id);
        const cypher = `MATCH (a:Award)-[ref]-(n:Notice) WHERE n.hidden=false AND n.id="${id}" RETURN a, ref, n LIMIT 50`;
        console.debug("Running query:", cypher);
        const params = {};
        const session = driver.session();
        return session.run(cypher, params)
            .then(result => {
                console.debug("result", result);
                session.close();
                result.records.forEach(res => {
                    addNode(res.get("a"), 'award');
                    addNode(res.get("n"), 'notice');
                    addEdge(res.get("ref"));
                });
                reDraw();
            })
            .catch(error => {
                session.close();
            });
    }

    cytoscape.use(coseBilkent);

    useEffect(() => {
        if (!refVisible) {
            return
        }
        setCy(cytoscape({
            container: cyRef.current,
            zoomingEnabled: true,
            panningEnabled: true,
            style: [ // the stylesheet for the graph
                {
                    selector: 'node',
                    style: {
                        "label": "",
                        "shape": "polygon",
                        "background-fit": "cover",
                        "background-opacity": 0,
                    },
                },
                {
                    selector: 'node[fos_type="client"]',
                    style: {
                        "label": "data(name)",
                        "ghost": "yes",
                        "ghost-offset-x": 3,
                        "ghost-offset-y": 3,
                        "ghost-opacity": 0.2,
                        "width": 50,
                        "height": 50,
                        "background-image": "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMHB4IiBoZWlnaHQ9IjIwcHgiIHZpZXdCb3g9IjAgMCAxOTIwIDE3OTIiPjxwYXRoIGZpbGw9InJnYig1OSwxMDksMTI3KSIgZD0iTTU5MyA4OTZxLTE2MiA1LTI2NSAxMjhoLTEzNHEtODIgMC0xMzgtNDAuNXQtNTYtMTE4LjVxMC0zNTMgMTI0LTM1MyA2IDAgNDMuNSAyMXQ5Ny41IDQyLjUgMTE5IDIxLjVxNjcgMCAxMzMtMjMtNSAzNy01IDY2IDAgMTM5IDgxIDI1NnpNMTY2NCAxNTMzcTAgMTIwLTczIDE4OS41dC0xOTQgNjkuNWgtODc0cS0xMjEgMC0xOTQtNjkuNXQtNzMtMTg5LjVxMC01MyAzLjUtMTAzLjV0MTQtMTA5IDI2LjUtMTA4LjUgNDMtOTcuNSA2Mi04MSA4NS41LTUzLjUgMTExLjUtMjBxMTAgMCA0MyAyMS41dDczIDQ4IDEwNyA0OCAxMzUgMjEuNSAxMzUtMjEuNSAxMDctNDggNzMtNDggNDMtMjEuNXE2MSAwIDExMS41IDIwdDg1LjUgNTMuNSA2MiA4MSA0MyA5Ny41IDI2LjUgMTA4LjUgMTQgMTA5IDMuNSAxMDMuNXpNNjQwIDI1NnEwIDEwNi03NSAxODF0LTE4MSA3NS0xODEtNzUtNzUtMTgxIDc1LTE4MSAxODEtNzUgMTgxIDc1IDc1IDE4MXpNMTM0NCA2NDBxMCAxNTktMTEyLjUgMjcxLjV0LTI3MS41IDExMi41LTI3MS41LTExMi41LTExMi41LTI3MS41IDExMi41LTI3MS41IDI3MS41LTExMi41IDI3MS41IDExMi41IDExMi41IDI3MS41ek0xOTIwIDg2NXEwIDc4LTU2IDExOC41dC0xMzggNDAuNWgtMTM0cS0xMDMtMTIzLTI2NS0xMjggODEtMTE3IDgxLTI1NiAwLTI5LTUtNjYgNjYgMjMgMTMzIDIzIDU5IDAgMTE5LTIxLjV0OTcuNS00Mi41IDQzLjUtMjFxMTI0IDAgMTI0IDM1M3pNMTc5MiAyNTZxMCAxMDYtNzUgMTgxdC0xODEgNzUtMTgxLTc1LTc1LTE4MSA3NS0xODEgMTgxLTc1IDE4MSA3NSA3NSAxODF6Ii8+PC9zdmc+)"
                    },
                },
                {
                    selector: 'node[fos_type="notice"]',
                    style: {
                        "label": "Notice",
                        "background-image": "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMHB4IiBoZWlnaHQ9IjIwcHgiIHZpZXdCb3g9IjAgMCAxNTM2IDE3OTIiPjxwYXRoIGZpbGw9InJnYigxMjcsNTksNzUpIiBkPSJNMTQ2OCAzODBxMjggMjggNDggNzZ0MjAgODh2MTE1MnEwIDQwLTI4IDY4dC02OCAyOGgtMTM0NHEtNDAgMC02OC0yOHQtMjgtNjh2LTE2MDBxMC00MCAyOC02OHQ2OC0yOGg4OTZxNDAgMCA4OCAyMHQ3NiA0OHpNMTAyNCAxMzZ2Mzc2aDM3NnEtMTAtMjktMjItNDFsLTMxMy0zMTNxLTEyLTEyLTQxLTIyek0xNDA4IDE2NjR2LTEwMjRoLTQxNnEtNDAgMC02OC0yOHQtMjgtNjh2LTQxNmgtNzY4djE1MzZoMTI4MHpNMzg0IDgwMHEwLTE0IDktMjN0MjMtOWg3MDRxMTQgMCAyMyA5dDkgMjN2NjRxMCAxNC05IDIzdC0yMyA5aC03MDRxLTE0IDAtMjMtOXQtOS0yM3YtNjR6TTExMjAgMTAyNHExNCAwIDIzIDl0OSAyM3Y2NHEwIDE0LTkgMjN0LTIzIDloLTcwNHEtMTQgMC0yMy05dC05LTIzdi02NHEwLTE0IDktMjN0MjMtOWg3MDR6TTExMjAgMTI4MHExNCAwIDIzIDl0OSAyM3Y2NHEwIDE0LTkgMjN0LTIzIDloLTcwNHEtMTQgMC0yMy05dC05LTIzdi02NHEwLTE0IDktMjN0MjMtOWg3MDR6Ii8+PC9zdmc+)"
                    },
                },
                {
                    selector: 'node[fos_type="award"]',
                    style: {
                        "label": "Award",
                        "background-image": "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMHB4IiBoZWlnaHQ9IjIwcHgiIHZpZXdCb3g9IjAgMCAyMzA0IDE3OTIiPjxwYXRoIGZpbGw9InJnYigxMTEsNTksMTI3KSIgZD0iTTE5MiAxMTUycTQwIDAgNTYtMzJ0MC02NC01Ni0zMi01NiAzMiAwIDY0IDU2IDMyek0xNjY1IDEwOTRxLTEwLTEzLTM4LjUtNTB0LTQxLjUtNTQtMzgtNDktNDIuNS01My00MC41LTQ3LTQ1LTQ5bC0xMjUgMTQwcS04MyA5NC0yMDguNSA5MnQtMjA1LjUtOThxLTU3LTY5LTU2LjUtMTU4dDU4LjUtMTU3bDE3Ny0yMDZxLTIyLTExLTUxLTE2LjV0LTQ3LjUtNi01Ni41IDAuNS00OSAxcS05MiAwLTE1OCA2NmwtMTU4IDE1OGgtMTU1djU0NHE1IDAgMjEtMC41dDIyIDAgMTkuNSAyIDIwLjUgNC41IDE3LjUgOC41IDE4LjUgMTMuNWwyOTcgMjkycTExNSAxMTEgMjI3IDExMSA3OCAwIDEyNS00NyA1NyAyMCAxMTIuNS04dDcyLjUtODVxNzQgNiAxMjctNDQgMjAtMTggMzYtNDUuNXQxNC01MC41cTEwIDEwIDQzIDEwIDQzIDAgNzctMjF0NDkuNS01MyAxMi03MS41LTMwLjUtNzMuNXpNMTgyNCAxMTUyaDk2di01MTJoLTkzbC0xNTctMTgwcS02Ni03Ni0xNjktNzZoLTE2N3EtODkgMC0xNDYgNjdsLTIwOSAyNDNxLTI4IDMzLTI4IDc1dDI3IDc1cTQzIDUxIDExMCA1MnQxMTEtNDlsMTkzLTIxOHEyNS0yMyA1My41LTIxLjV0NDcgMjcgOC41IDU2LjVxMTYgMTkgNTYgNjN0NjAgNjhxMjkgMzYgODIuNSAxMDUuNXQ2NC41IDg0LjVxNTIgNjYgNjAgMTQwek0yMTEyIDExNTJxNDAgMCA1Ni0zMnQwLTY0LTU2LTMyLTU2IDMyIDAgNjQgNTYgMzJ6TTIzMDQgNTc2djY0MHEwIDI2LTE5IDQ1dC00NSAxOWgtNDM0cS0yNyA2NS04MiAxMDYuNXQtMTI1IDUxLjVxLTMzIDQ4LTgwLjUgODEuNXQtMTAyLjUgNDUuNXEtNDIgNTMtMTA0LjUgODEuNXQtMTI4LjUgMjQuNXEtNjAgMzQtMTI2IDM5LjV0LTEyNy41LTE0LTExNy01My41LTEwMy41LTgxbC0yODctMjgyaC0zNThxLTI2IDAtNDUtMTl0LTE5LTQ1di02NzJxMC0yNiAxOS00NXQ0NS0xOWg0MjFxMTQtMTQgNDctNDh0NDcuNS00OCA0NC00MCA1MC41LTM3LjUgNTEtMjUuNSA2Mi0xOS41IDY4LTUuNWgxMTdxOTkgMCAxODEgNTYgODItNTYgMTgxLTU2aDE2N3EzNSAwIDY3IDZ0NTYuNSAxNC41IDUxLjUgMjYuNSA0NC41IDMxIDQzIDM5LjUgMzkgNDIgNDEgNDggNDEuNSA0OC41aDM1NXEyNiAwIDQ1IDE5dDE5IDQ1eiIvPjwvc3ZnPg==)",
                    }
                },
                {
                    selector: '.highlight',
                    style: {
                        "border-color": "#fff000",
                        "border-width": 10,
                        "border-opacity": 0.7,
                        "border-style": "dotted",
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        "width": "1",
                        "line-style": "dotted",
                        "curve-style": "haystack"
                    },
                },
                {
                    selector: ".multiline-auto",
                    style: {
                        "text-wrap": "wrap",
                        "text-max-width": "140",
                    }
                }
            ],
        }));
    }, [refVisible]);

    useEffect(() => {
        visualizeAll();
    }, [cy]);

    function visualizeAll() {
        if (!refVisible) {
            return;
        }

        // console.log("Removing all elements");
        cy.remove(cy.$("*"));

        const session = driver.session();

        const cypher = "MATCH(c:Client)-[ref:PUBLISHED]-(n:Notice) " +
            "WHERE c.hidden=false AND ref.hidden=false AND n.hidden=false " +
            "RETURN c, ref, n LIMIT 50";
        const params = {};

        return session.run(cypher, params)
            .then(result => {
                session.close();
                result.records.forEach(res => {
                    addNode(res.get("c"), 'client');
                    addNode(res.get("n"), 'notice');
                    addEdge(res.get("ref"));
                });
                reDraw();
            })
            .catch(error => {
                session.close();
            });
    }

    function addNode(node: NodeDataDefinition, type: string) {
        const count = cy.$id("node_" + node.identity.low);
        if (count["length"] === 0) {
            let output: { [key: string]: any } = {
                id: "node_" + node.identity.low,
                neo4j_id: node.identity.low,
                neo4j_label: node.labels.join(),
                fos_type: type,
            };

            Object.keys(node.properties).forEach(key => {
                if (key === "id") {
                    output["fos_id"] = node.properties[key];
                } else {
                    output[key] = node.properties[key];
                }
            });

            let ele: ElementDefinition = {
                group: "nodes",
                data: output,
                classes: "multiline-auto" // todo make configurable .. currently everything wraps
            };
            console.debug(`Adding node ${output.id}:`, ele);
            cy.add(ele);
        }
    }

    //verify if edge exists, add it if it doesn't
    function addEdge(edge: EdgeDataDefinition) {
        const found = cy.$id("edge_" + edge.identity.low);
        if (found["length"] === 0) {
            let output: { [key: string]: any } = {
                id: "edge_" + edge.identity.low,
                neo4j_id: edge.identity.low,
                neo4j_type: edge.type,
                source: "node_" + edge.start.low,
                target: "node_" + edge.end.low
            };

            Object.keys(edge.properties).forEach(key => {
                output[key] = edge.properties[key];
            });

            let ele: ElementDefinition = {
                group: "edges",
                data: output,
            };
            console.debug("Adding edge:", ele);
            cy.add(ele);
            console.debug(`edge_${edge.identity.low} created between node_${edge.start.low} and node_${edge.end.low}`);
        } else {
            console.debug(`edge_${edge.identity.low} already exists`);
        }
    }

    function reDraw() {
        const layoutOptions = {
            name: "cose-bilkent",
            fit: false,
        };
        cy.resize();
        cy.elements().layout(layoutOptions).run();

        // add listener
        let nodes = cy.elements("node[!hasListener]");
        // console.log(`${nodes.size()} nodes match [!hasListener]`);
        nodes.on('tap', function (evt: {
            target: {
                data: () => { fos_id: string, fos_type: NodeMetadataType }
            }
        }) {
            setMetadata({
                    type: evt.target.data().fos_type,
                    id: evt.target.data().fos_id
                }
            );
        });
        // mark added so that we don't add twice
        nodes.data("hasListener", "tap");
        // console.debug(`${cy.elements("node[!hasListener]").size()} match`)
    }

    return (
        <>
            <NodeMetadata hidden={!showMetadata} hideCallback={hideMetadata} metadata={metadata}
                          setMetadataCallback={setMetadataViaCallback} showAwardDetailsCB={showAwardDetails}/>
            <div id={"cy"} className={"mt-0"}
                 ref={instance => {
                     cyRef.current = instance;
                     setRefVisible(!!instance);
                 }}>
            </div>
        </>
    )

};