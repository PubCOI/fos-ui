import React, {useEffect, useRef, useState} from 'react';
import {auth, driver as neo4j_driver} from "neo4j-driver";
import cytoscape, {EdgeDataDefinition, NodeDataDefinition,} from "cytoscape";

let coseBilkent = require('cytoscape-cose-bilkent');

export const Graph = () => {
    const driver = neo4j_driver("bolt://localhost", auth.basic("neo4j", "password"));

    const cyRef = useRef<HTMLDivElement | null>(null);
    const [refVisible, setRefVisible] = useState(false);
    const [cy, setCy] = useState(cytoscape.prototype);

    cytoscape.use(coseBilkent);

    useEffect(() => {
        if (!refVisible) {
            return
        }
        console.debug("Got div ref: rendering graph");
        setCy(cytoscape({
            container: cyRef.current,
            zoomingEnabled: true,
            panningEnabled: true,
            style: [ // the stylesheet for the graph
                {
                    selector: 'node',
                    style: {
                        'label': 'data(name)',
                    },
                },
                {
                    selector: 'node[fos_type="client"]',
                    style: {
                        'label': 'data(name)',
                        "shape": "polygon",
                        "shape-polygon-points": "4",
                        "background-fit": "cover",
                        "background-opacity": 0,
                        "width": 50,
                        "height": 50,
                        "background-image": "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMHB4IiBoZWlnaHQ9IjIwcHgiIHZpZXdCb3g9IjAgMCAxOTIwIDE3OTIiPjxwYXRoIGZpbGw9InJnYig0NCw4NCw5NCkiIGQ9Ik01OTMgODk2cS0xNjIgNS0yNjUgMTI4aC0xMzRxLTgyIDAtMTM4LTQwLjV0LTU2LTExOC41cTAtMzUzIDEyNC0zNTMgNiAwIDQzLjUgMjF0OTcuNSA0Mi41IDExOSAyMS41cTY3IDAgMTMzLTIzLTUgMzctNSA2NiAwIDEzOSA4MSAyNTZ6TTE2NjQgMTUzM3EwIDEyMC03MyAxODkuNXQtMTk0IDY5LjVoLTg3NHEtMTIxIDAtMTk0LTY5LjV0LTczLTE4OS41cTAtNTMgMy41LTEwMy41dDE0LTEwOSAyNi41LTEwOC41IDQzLTk3LjUgNjItODEgODUuNS01My41IDExMS41LTIwcTEwIDAgNDMgMjEuNXQ3MyA0OCAxMDcgNDggMTM1IDIxLjUgMTM1LTIxLjUgMTA3LTQ4IDczLTQ4IDQzLTIxLjVxNjEgMCAxMTEuNSAyMHQ4NS41IDUzLjUgNjIgODEgNDMgOTcuNSAyNi41IDEwOC41IDE0IDEwOSAzLjUgMTAzLjV6TTY0MCAyNTZxMCAxMDYtNzUgMTgxdC0xODEgNzUtMTgxLTc1LTc1LTE4MSA3NS0xODEgMTgxLTc1IDE4MSA3NSA3NSAxODF6TTEzNDQgNjQwcTAgMTU5LTExMi41IDI3MS41dC0yNzEuNSAxMTIuNS0yNzEuNS0xMTIuNS0xMTIuNS0yNzEuNSAxMTIuNS0yNzEuNSAyNzEuNS0xMTIuNSAyNzEuNSAxMTIuNSAxMTIuNSAyNzEuNXpNMTkyMCA4NjVxMCA3OC01NiAxMTguNXQtMTM4IDQwLjVoLTEzNHEtMTAzLTEyMy0yNjUtMTI4IDgxLTExNyA4MS0yNTYgMC0yOS01LTY2IDY2IDIzIDEzMyAyMyA1OSAwIDExOS0yMS41dDk3LjUtNDIuNSA0My41LTIxcTEyNCAwIDEyNCAzNTN6TTE3OTIgMjU2cTAgMTA2LTc1IDE4MXQtMTgxIDc1LTE4MS03NS03NS0xODEgNzUtMTgxIDE4MS03NSAxODEgNzUgNzUgMTgxeiIvPjwvc3ZnPg==)"
                    },
                },
                {
                    selector: 'node[fos_type="tender"]',
                    style: {
                        'background-color': '#2c545e',
                        'label': 'data(name)',
                        'background-blacken': -0.5,
                        'background-opacity': 0.6
                    },
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'line-color': '#ccc',
                        'target-arrow-color': '#ccc',
                        'target-arrow-shape': 'triangle'
                    }
                }
            ],
        }));
    }, [refVisible]);

    useEffect(() => {
        console.log("useEffect() running visualise all");
        visualizeAll();
    }, [cy]);

    function visualizeAll() {
        if (!refVisible) {
            console.debug("cyRef not yet visible");
            return;
        }

        console.log("Removing all elements");
        cy.remove(cy.$("*"));

        const session = driver.session();

        const cypher = "MATCH(c:Client)-[ref:PUBLISHED]-(t:Tender) " +
            "WHERE c.hidden=false AND ref.hidden=false AND t.hidden=false " +
            "RETURN c, ref, t LIMIT 50";
        const params = {};

        return session.run(cypher, params)
            .then(result => {
                session.close();
                result.records.forEach(res => {
                    addNode(res.get("c"), 'client');
                    addNode(res.get("t"), 'tender');
                    addEdge(res.get("ref"));
                });
                reDraw();
            })
            .catch(error => {
                session.close();
            });
    }

    function addNode(node: NodeDataDefinition, type: string) {
        const found = cy.$id("node_" + node.identity.low);
        if (found["length"] === 0) {
            let output: { [key: string]: any } = {
                id: "node_" + node.identity.low,
                neo4j_id: node.identity.low,
                neo4j_label: node.labels.join(),
                fos_type: type
            };

            Object.keys(node.properties).forEach(key => {
                if (key === "id") {
                    output["node_id"] = node.properties[key];
                } else {
                    output[key] = node.properties[key];
                }
            });

            cy.add({
                group: "nodes",
                data: output
            });
            // console.debug("node_" + node.identity.low + " created");
        } else {
            // console.debug("node_" + node.identity.low + " already exists");
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
        console.debug("Redrawing ...");
        const layoutOptions = {
            name: "cose-bilkent",
            animate: 'end',
            animationDuration: 1000,
            tilingPaddingHorizontal: 20,
            gravityRangeCompound: 9,
            fit: true,
        };
        cy.resize();
        cy.elements().layout(layoutOptions).run();
        console.debug("Finished redraw");
    }

    return (
        <>

            <div id={"cy"} className={"mt-0"}
                 ref={instance => {
                     cyRef.current = instance;
                     setRefVisible(!!instance);
                 }}>
            </div>

        </>
    )

};