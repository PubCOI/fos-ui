import React, {useEffect, useRef, useState} from 'react';
import {auth, driver as neo4j_driver} from "neo4j-driver";
import cytoscape, {
    EdgeDataDefinition,
    ElementDefinition,
    EventHandler,
    NodeDataDefinition,
    NodeSingular,
} from "cytoscape";
import {NodeMetadata} from "../components/NodeMetadata";
import {INodeMetadata, NodeMetadataType} from "../interfaces/INodeMetadata";

let coseBilkent = require('cytoscape-cose-bilkent');


export const Graph = () => {
    const driver = neo4j_driver("bolt://localhost", auth.basic("neo4j", "password"));

    const cyRef = useRef<HTMLDivElement | null>(null);
    const [refVisible, setRefVisible] = useState(false);
    const [cy, setCy] = useState({} as cytoscape.Core);
    const [showMetadata, setShowMetadata] = useState(false);
    const [metadata, setMetadata] = useState<INodeMetadata>({type: NodeMetadataType.client, id: ""});

    useEffect(() => {
        if (undefined !== metadata.type && undefined !== metadata.id && metadata.id !== "") {
            setShowMetadata(true);
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
            // console.debug("Adding element", ele);
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

            cy.add({
                group: "edges",
                data: output
            });
            // console.debug("edge_" + edge.identity.low + " created between node_" + edge.start.low + " and node_" + edge.end.low);
        } else {
            // console.debug("edge_" + edge.identity.low + " already exists");
        }
    }

    function reDraw() {
        const layoutOptions = {
            name: "cose-bilkent",
            fit: false,
        };
        cy.resize();
        cy.elements().layout(layoutOptions).run();
        cy.on('tap', 'node', function (evt: {
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
    }

    return (
        <>
            <NodeMetadata hidden={!showMetadata} hideCallback={hideMetadata} metadata={metadata} setMetadataCallback={setMetadataViaCallback}/>
            <div id={"cy"} className={"mt-0"}
                 ref={instance => {
                     cyRef.current = instance;
                     setRefVisible(!!instance);
                 }}>
            </div>
        </>
    )

};