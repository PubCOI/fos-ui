import React, {useEffect, useRef, useState} from 'react';
import {auth, driver as neo4j_driver} from "neo4j-driver";
import cytoscape, {
    EdgeDataDefinition,
    NodeDataDefinition,
} from "cytoscape";
let coseBilkent = require('cytoscape-cose-bilkent');

export const Graph = () => {
    const driver = neo4j_driver("bolt://localhost", auth.basic("neo4j", "password"));

    const cyRef = useRef<HTMLDivElement | null>(null);
    const [refVisible, setRefVisible] = useState(false);
    const [cy, setCy] = useState(cytoscape.prototype);

    cytoscape.use( coseBilkent );

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
                        'background-color': '#aaa',
                        'label': 'data(name)'
                    }
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
    },[cy]);

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
                    console.log(res);
                    checkandaddNode(res.get("c"));
                    checkandaddNode(res.get("t"));
                    checkandaddEdge(res.get("ref"));
                });
                reDraw();
            })
            .catch(error => {
                session.close();
            });
    }

    function checkandaddNode(node: NodeDataDefinition) {
        const found = cy.$id("node_" + node.identity.low);
        if (found["length"] === 0) {
            let output: { [key: string]: any } = {
                id: "node_" + node.identity.low,
                neo4j_id: node.identity.low,
                neo4j_label: node.labels.join()
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
    function checkandaddEdge(edge: EdgeDataDefinition) {
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