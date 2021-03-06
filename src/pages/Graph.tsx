import React, {useContext, useEffect, useRef, useState} from 'react';
import cytoscape, {ElementDefinition} from "cytoscape";
import {NodeMetadata} from "../components/NodeMetadata";
import {INodeMetadata} from "../interfaces/INodeMetadata";
import {AwardDetailsModal} from "../components/graphs/AwardDetailsModal";
import AppContext from "../components/core/AppContext";
import axios, {AxiosResponse} from "axios";
import {INode, IRef} from "../interfaces/DTO/GraphDTO";
import {useToasts} from "react-toast-notifications";
import moment from 'moment';
import {TimebaseDataEnum} from "../components/graphs/preferences/TimebaseDataEnum";
import 'cytoscape-context-menus/cytoscape-context-menus.css';
// import {contextMenus} from 'cytoscape-context-menus';
import submenuIndicatorDefault from '../img/graph-context-submenu-indicator-default.svg';
import FontAwesome from "react-fontawesome";
import {renderTooltip} from "../hooks/Utils";
import {OverlayTrigger} from "react-bootstrap";

import imgNoticeWarning from '../img/graph-notice-warning.svg';
import imgNotice from '../img/graph-notice.svg';
import imgUser from '../img/graph-user.svg';
import imgUserFormer from '../img/graph-user-former.svg';
import imgOrgVerified from '../img/graph-org-verified.svg';
import imgOrgUnverified from '../img/graph-org-unverified.svg';
import {NodeTypeEnum} from "../generated/FosTypes";
import {useParams} from "react-router";

// import ctxAdd from '../img/graph-context-add.svg';
// image: {src: ctxAdd, width: 12, height: 12, x: 6, y: 4},

let contextMenus = require('cytoscape-context-menus');
let coseBilkent = require('cytoscape-cose-bilkent');

export const Graph = (props: { object_type?: string, object_id?: string }) => {
    let {object_type, object_id} = useParams<{ object_type: string, object_id: string }>();
    const {setModalBody, graphMetadata, setGraphMetadata, graphConfig} = useContext(AppContext);

    cytoscape.use(coseBilkent);

    const {addToast} = useToasts();
    const cyRef = useRef<HTMLDivElement | null>(null);
    const [refVisible, setRefVisible] = useState(false);
    const [cy, setCy] = useState({} as cytoscape.Core);
    const [showMetadata, setShowMetadata] = useState(false);

    useEffect(() => {
        if (cyIsNull()) return;
        if ((object_id && object_type) || (props.object_type && props.object_id)) {
            setMetadataViaCallback({
                type: props.object_type as NodeTypeEnum || props.object_type as NodeTypeEnum,
                fosId: props.object_id || object_id,
                clear_graph: true,
                neo4j_id: "",
            });
        }
    }, [cy]);

    useEffect(() => {
        if (undefined !== graphMetadata.type && undefined !== graphMetadata.fosId && graphMetadata.fosId !== "") {
            setShowMetadata(true);
            if (graphMetadata.type === NodeTypeEnum.notice) {
                getNoticeNodes(graphMetadata);
            }
            if (graphMetadata.type === NodeTypeEnum.award) {
                getAwardNodes(graphMetadata);
            }
            if (graphMetadata.type === NodeTypeEnum.organisation) {
                getOrgNodes(graphMetadata);
            }
            if (graphMetadata.type === NodeTypeEnum.person) {
                getPersonNodes(graphMetadata);
            }
        }
    }, [graphMetadata]);

    useEffect(() => {
        console.debug("got graph config update, explicitly calling redraw", graphConfig);
        reDraw();
    }, [graphConfig]);

    function doTimeFilter() {
        if (cyIsNull()) return;
        let timeFilter = (graphConfig.show_timebase_data as TimebaseDataEnum === TimebaseDataEnum.current ? 100 : (graphConfig.show_timebase_data as TimebaseDataEnum === TimebaseDataEnum.recent ? 50 : 0));
        cy.elements(`*[hasTimeFilter][timeFilter_numeric < ${timeFilter}]`).css({
            "display": "none"
        });
        cy.elements(`*[hasTimeFilter][timeFilter_numeric >= ${timeFilter}]`).css({
            "display": "element"
        });
    }

    function cyIsNull() {
        if (undefined === cy || undefined === cy.$id) {
            console.debug("Cytoscape not yet initialised");
            return true;
        }
        return false;
    }

    useEffect(() => {
        if (cyIsNull()) return;
        if (graphMetadata.type === undefined || graphMetadata.fosId === "") return;
        console.debug("Got update", graphMetadata);
        if (graphMetadata.clear_graph) {
            console.debug("clearing graph");
            let nodes = cy.elements("node[hasListener]");
            nodes.removeListener('tap');
            nodes.removeData('hasListener');
            cy.remove(cy.$("*"));
        }
        if (graphMetadata.type as NodeTypeEnum === NodeTypeEnum.client) {
            // get notices
            axios.get<string, AxiosResponse<{
                c: INode,
                n: INode,
                ref: IRef,
            }[]>>(
                `/api/graphs/clients/${graphMetadata.fosId}`
            ).then((r) => {
                if (r.data.length > 0) {
                    r.data.forEach(res => {
                        addNode(res.c, 'client');
                        addNode(res.n, 'notice');
                        addEdge(res.ref);
                    });
                    reDraw(`node[neo4j_id=${r.data[0].c.neo4j_id}]`);
                }
            });
            // get persons (if any)
            axios.get<string, AxiosResponse<{
                c: INode,
                p: INode,
                ref: IRef,
            }[]>>(
                `/api/graphs/clients/${graphMetadata.fosId}/relationships`
            ).then((r) => {
                if (r.data.length > 0) {
                    r.data.forEach(res => {
                        addNode(res.c, 'client');
                        addNode(res.p, 'person');
                        addEdge(res.ref);
                    });
                    reDraw(`node[neo4j_id=${r.data[0].c.neo4j_id}]`);
                }
            });
        }
        if (graphMetadata.type as NodeTypeEnum === NodeTypeEnum.organisation) {
            axios.get<string, AxiosResponse<{
                o: INode,
                a: INode,
                ref: IRef,
            }[]>>(
                `/api/graphs/organisations/${graphMetadata.fosId}`
            ).then((r) => {
                if (r.data.length > 0) {
                    r.data.forEach(res => {
                        addNode(res.o, 'organisation');
                        if (null !== res.a) {
                            addNode(res.a, 'award');
                        }
                        if (null !== res.ref) {
                            addEdge(res.ref);
                        }
                    });
                    reDraw(`node[neo4j_id=${r.data[0].o.neo4j_id}]`);
                }
            });
        }
    }, [graphMetadata]);

    function setMetadataViaCallback(data: INodeMetadata) {
        let ele = `node[fosId="${data.fosId}"]`;
        console.debug("Updating node", ele);
        cy.elements(ele).flashClass("highlight", 1500);
        setGraphMetadata(data);
    }

    function hideMetadata() {
        setShowMetadata(false);
    }

    function showAwardDetails(id: string) {
        console.log("Getting award details for", id);
        setModalBody(<AwardDetailsModal id={id}/>);
    }

    function getNoticeNodes(metadata: INodeMetadata) {
        console.debug("getNoticeNodes: Requesting children of", metadata.fosId);
        let dataAdded = false;
        axios.get<string, AxiosResponse<{
            a: INode,
            n: INode,
            ref: IRef,
        }[]>>(
            `/api/graphs/notices/${metadata.fosId}/children`,
            {
                params: {
                    max: 25
                }
            }
        )
            .then((r) => {
                if (r.data.length > 0) {
                    r.data.forEach(res => {
                        dataAdded = addNode(res.a, 'award') || dataAdded;
                        dataAdded = addNode(res.n, 'notice') || dataAdded;
                        dataAdded = addEdge(res.ref) || dataAdded;
                    });
                } else {
                    addToast(`No awards found on notice ${metadata.fosId}`, {
                        appearance: "warning",
                        autoDismiss: true,
                    })
                }
            })
            .then(() => {
                axios.get<string, AxiosResponse<{
                    c: INode,
                    n: INode,
                    ref: IRef,
                }[]>>(
                    `/api/graphs/notices/${metadata.fosId}/parents`,
                    {
                        params: {
                            max: 25
                        }
                    }
                ).then((r) => {
                    if (r.data.length > 0) {
                        r.data.forEach(res => {
                            dataAdded = addNode(res.c, 'client') || dataAdded;
                            dataAdded = addNode(res.n, 'notice') || dataAdded;
                            dataAdded = addEdge(res.ref) || dataAdded;
                        });
                    } else {
                        addToast(`No clients found on notice ${metadata.fosId}`, {
                            appearance: "warning",
                            autoDismiss: true,
                        })
                    }
                })
                    .then(() => {
                        if (dataAdded) {
                            reDrawViaMeta(metadata);
                        }
                    });
            })
    }

    function reDrawViaMeta(metadata: INodeMetadata) {
        if (metadata.neo4j_id) {
            console.debug("Redrawing via neo4j_id");
            return reDraw(`node[neo4j_id=${metadata.neo4j_id}]`);
        }
        if (metadata.fosId) {
            console.debug("Redrawing via fosId");
            return reDraw(`node[fosId="${metadata.fosId}"]`);
        }
        if (undefined === metadata.neo4j_id && undefined === metadata.fosId) {
            console.debug("Unable to redraw with center, meta is", metadata);
        }
        reDraw();
    }

    function getAwardNodes(metadata: INodeMetadata) {
        console.debug("getAwardNodes: Requesting children of", metadata.fosId);
        let dataAdded = false;
        axios.get<string, AxiosResponse<{
            a: INode,
            o: INode,
            ref: IRef,
        }[]>>(
            `/api/graphs/awards/${metadata.fosId}/children`,
            {
                params: {
                    max: 25
                }
            }
        ).then((r) => {
            if (r.data.length > 0) {
                r.data.forEach(res => {
                    dataAdded = addNode(res.a, 'award') || dataAdded;
                    dataAdded = addNode(res.o, 'organisation') || dataAdded;
                    dataAdded = addEdge(res.ref) || dataAdded;
                });
            } else {
                addToast(`No org data found on notice ${metadata.fosId}`, {
                    appearance: "warning",
                    autoDismiss: true,
                })
            }
        }).then(() => {
            console.debug("Requesting parents of", metadata.fosId);
            return axios.get<string, AxiosResponse<{
                a: INode,
                n: INode,
                ref: IRef,
            }[]>>(
                `/api/graphs/awards/${metadata.fosId}/parents`
            ).then((r) => {
                if (r.data.length > 0) {
                    r.data.forEach(res => {
                        res.n.properties["has_awards"] = true;
                        dataAdded = addNode(res.a, 'award') || dataAdded;
                        dataAdded = addNode(res.n, 'notice') || dataAdded;
                        dataAdded = addEdge(res.ref) || dataAdded;
                    });
                } else {
                    addToast(`No notice data found on award ${metadata.fosId}`, {
                        appearance: "warning",
                        autoDismiss: true,
                    })
                }
            });
        })
            .then(() => {
                if (dataAdded) {
                    reDrawViaMeta(metadata);
                }
            });
    }

    function getOrgNodes(metadata: INodeMetadata) {
        console.debug("getOrgNodes: requesting relationships for", metadata.fosId);
        let dataAdded = false;
        axios.get<string, AxiosResponse<{
            o: INode,
            p: INode,
            ref: IRef
        }[]>>(`/api/graphs/organisations/${metadata.fosId}/relationships`, {params: {max: 50}})
            .then((r) => {
                if (r.data.length > 0) {
                    r.data.forEach(res => {
                        if (res.p.labels.includes("Person")) {
                            handleOrgPersonLink(res);
                        }
                        dataAdded = addNode(res.p) || dataAdded; // will be org or person
                        dataAdded = addNode(res.o, 'organisation') || dataAdded;
                        dataAdded = addEdge(res.ref) || dataAdded;
                    });
                } else {
                    addToast(`No relationships found for organisation ${metadata.fosId}`, {
                        appearance: "warning",
                        autoDismiss: true,
                    })
                }
            })
            .then(() => {
                if (dataAdded) {
                    reDrawViaMeta(metadata);
                }
            })
    }

    function handleOrgPersonLink(res: {
        o: INode,
        p: INode,
        ref: IRef
    }) {
        // if the ref has an end date, it's a FORMER position - mark node and ref as such

        // first mark that we're using time filters on these objects
        Object.assign(res.ref.properties, {hasTimeFilter: true});
        Object.assign(res.p.properties, {hasTimeFilter: true});

        // NB - NUMERIC time filter should allow us to filter by '... x > y'
        // 100 = current
        // 0 = most historic
        // at some point we might be adding a sliding scale ...

        // now find out if the person is 'current'
        // note that the time data is on the RELATIONSHIP
        let org_person_current = !('endDT' in res.ref.properties);

        if (org_person_current) {
            Object.assign(res.ref.properties, {timeFilter_numeric: 100});
            Object.assign(res.p.properties, {timeFilter_numeric: 100});
        } else {
            // if it's not current, try find if it's recent ...
            let sDT = res.ref.properties['startDT'];
            let eDT = res.ref.properties['endDT'];
            let msDT = moment(sDT);
            let meDT = moment(eDT);

            // if we're seeing more than 3 years' difference, mark as historic (0),
            // otherwise mark as recent (50)
            let days = Math.abs(msDT.diff(meDT, 'days'));
            let timeFilter = {timeFilter_numeric: (days > (365 * 3)) ? 0 : 50};
            Object.assign(res.ref.properties, timeFilter);
            Object.assign(res.p.properties, timeFilter);
        }
    }

    function getPersonNodes(metadata: INodeMetadata) {
        console.debug("getPersonNodes: Requesting relationships for", metadata.fosId);
        let dataAdded = false;
        axios.get<string, AxiosResponse<{
            p: INode,
            o: INode,
            ref: IRef,
        }[]>>(
            `/api/graphs/persons/${metadata.fosId}/relationships`, {
                params: {
                    max: 50,
                    reqType: "org"
                }
            }
        ).then((r) => {
            if (r.data.length > 0) {
                r.data.forEach(res => {
                    handleOrgPersonLink(res);
                    dataAdded = addNode(res.p, 'person') || dataAdded;
                    dataAdded = addNode(res.o, 'organisation') || dataAdded;
                    dataAdded = addEdge(res.ref) || dataAdded;
                });
            }
        })
            .then(() => {
                axios.get<string, AxiosResponse<{
                    p: INode,
                    c: INode,
                    ref: IRef,
                }[]>>(
                    `/api/graphs/persons/${metadata.fosId}/relationships`, {
                        params: {
                            max: 50,
                            reqType: "client"
                        }
                    }
                ).then((r) => {
                    if (r.data.length > 0) {
                        r.data.forEach(res => {
                            dataAdded = addNode(res.p, 'person') || dataAdded;
                            dataAdded = addNode(res.c, 'client') || dataAdded;
                            dataAdded = addEdge(res.ref) || dataAdded;
                        });
                    }
                })
            })
            .then(() => {
                if (dataAdded) {
                    reDrawViaMeta(metadata);
                }
            })
    }

    useEffect(() => {
        if (!refVisible || !cytoscape) {
            return
        }
        setCy(cytoscape({
            container: cyRef.current,
            zoomingEnabled: true,
            panningEnabled: true,
            style: [
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
                    selector: 'node[type="client"]',
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
                    selector: 'node[type="notice"]',
                    style: {
                        "label": "Notice",
                        "background-image": imgNotice
                    },
                },
                {
                    selector: 'node[type="notice"][!has_awards]',
                    style: {
                        "background-image": imgNoticeWarning
                    },
                },
                {
                    selector: 'node[type="award"]',
                    style: {
                        "label": "Award",
                        "background-image": "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMHB4IiBoZWlnaHQ9IjIwcHgiIHZpZXdCb3g9IjAgMCAyMzA0IDE3OTIiPjxwYXRoIGZpbGw9InJnYigxMTEsNTksMTI3KSIgZD0iTTE5MiAxMTUycTQwIDAgNTYtMzJ0MC02NC01Ni0zMi01NiAzMiAwIDY0IDU2IDMyek0xNjY1IDEwOTRxLTEwLTEzLTM4LjUtNTB0LTQxLjUtNTQtMzgtNDktNDIuNS01My00MC41LTQ3LTQ1LTQ5bC0xMjUgMTQwcS04MyA5NC0yMDguNSA5MnQtMjA1LjUtOThxLTU3LTY5LTU2LjUtMTU4dDU4LjUtMTU3bDE3Ny0yMDZxLTIyLTExLTUxLTE2LjV0LTQ3LjUtNi01Ni41IDAuNS00OSAxcS05MiAwLTE1OCA2NmwtMTU4IDE1OGgtMTU1djU0NHE1IDAgMjEtMC41dDIyIDAgMTkuNSAyIDIwLjUgNC41IDE3LjUgOC41IDE4LjUgMTMuNWwyOTcgMjkycTExNSAxMTEgMjI3IDExMSA3OCAwIDEyNS00NyA1NyAyMCAxMTIuNS04dDcyLjUtODVxNzQgNiAxMjctNDQgMjAtMTggMzYtNDUuNXQxNC01MC41cTEwIDEwIDQzIDEwIDQzIDAgNzctMjF0NDkuNS01MyAxMi03MS41LTMwLjUtNzMuNXpNMTgyNCAxMTUyaDk2di01MTJoLTkzbC0xNTctMTgwcS02Ni03Ni0xNjktNzZoLTE2N3EtODkgMC0xNDYgNjdsLTIwOSAyNDNxLTI4IDMzLTI4IDc1dDI3IDc1cTQzIDUxIDExMCA1MnQxMTEtNDlsMTkzLTIxOHEyNS0yMyA1My41LTIxLjV0NDcgMjcgOC41IDU2LjVxMTYgMTkgNTYgNjN0NjAgNjhxMjkgMzYgODIuNSAxMDUuNXQ2NC41IDg0LjVxNTIgNjYgNjAgMTQwek0yMTEyIDExNTJxNDAgMCA1Ni0zMnQwLTY0LTU2LTMyLTU2IDMyIDAgNjQgNTYgMzJ6TTIzMDQgNTc2djY0MHEwIDI2LTE5IDQ1dC00NSAxOWgtNDM0cS0yNyA2NS04MiAxMDYuNXQtMTI1IDUxLjVxLTMzIDQ4LTgwLjUgODEuNXQtMTAyLjUgNDUuNXEtNDIgNTMtMTA0LjUgODEuNXQtMTI4LjUgMjQuNXEtNjAgMzQtMTI2IDM5LjV0LTEyNy41LTE0LTExNy01My41LTEwMy41LTgxbC0yODctMjgyaC0zNThxLTI2IDAtNDUtMTl0LTE5LTQ1di02NzJxMC0yNiAxOS00NXQ0NS0xOWg0MjFxMTQtMTQgNDctNDh0NDcuNS00OCA0NC00MCA1MC41LTM3LjUgNTEtMjUuNSA2Mi0xOS41IDY4LTUuNWgxMTdxOTkgMCAxODEgNTYgODItNTYgMTgxLTU2aDE2N3EzNSAwIDY3IDZ0NTYuNSAxNC41IDUxLjUgMjYuNSA0NC41IDMxIDQzIDM5LjUgMzkgNDIgNDEgNDggNDEuNSA0OC41aDM1NXEyNiAwIDQ1IDE5dDE5IDQ1eiIvPjwvc3ZnPg==)",
                    }
                },
                {
                    selector: 'node[type="organisation"][verified]',
                    style: {
                        "label": "data(name)",
                        "background-image": imgOrgVerified
                    }
                },
                {
                    selector: 'node[type="organisation"][!verified]',
                    style: {
                        "label": "data(name)",
                        "background-image": imgOrgUnverified
                    }
                },
                {
                    selector: 'node[type="person"]',
                    style: {
                        "label": "data(commonName)",
                        "background-image": imgUserFormer
                    }
                },
                {
                    selector: 'node[type="person"][hasTimeFilter][timeFilter_numeric > 50]',
                    style: {
                        "label": "data(commonName)",
                        "background-image": imgUser
                    }
                },
                {
                    selector: 'edge[neo4j_type="CONFLICT"]',
                    style: {
                        "label": "data(relationshipType)",
                        "line-color": "#FF0000",
                        "width": 2
                    }
                },
                {
                    selector: 'edge[neo4j_type="LEGAL_ENTITY"]',
                    style: {
                        "label": "[AKA]",
                        "line-color": "#ffab51",
                        "width": 2,
                        "font-size": "10"
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
        defaultVisualisation();
    }, [cy]);

    useEffect(() => {
        if (cytoscape && typeof (cytoscape as any).contextMenus === undefined) {
            console.debug("Loading contextMenus extension");
            cytoscape.use(contextMenus);
        }
    }, [cytoscape]);

    function defaultVisualisation() {
        if (!refVisible) {
            return;
        }

        // remove all elements
        cy.remove(cy.$("*"));

        if ((object_id && object_type) || (props.object_id && props.object_type)) {
            return;
        }

        return axios.get<string, AxiosResponse<{
            c: INode,
            n: INode,
            ref: IRef,
        }[]>>(
            "/api/graphs/_meta/initial",
            {
                params: {
                    max: 50
                }
            }
        ).then((r) => {
            if (r.data.length > 0) {
                r.data.forEach(res => {
                    addNode(res.c, 'client');
                    addNode(res.n, 'notice');
                    addEdge(res.ref);
                });
                reDraw();
            }
        });
    }

    function addNode(node: INode, type?: string) {
        if (cyIsNull()) return;
        const count = cy.$id("node_" + node.neo4j_id);
        if (count["length"] === 0) {
            let output: { [key: string]: any } = {
                id: "node_" + node.neo4j_id,
                neo4j_id: node.neo4j_id,
                neo4j_label: node.labels.join(),
                type: type || node.labels[0].toLowerCase()
            };

            Object.keys(node.properties).forEach(key => {
                if (key === "id") {
                    output["fosId"] = node.properties[key];
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
            return true;
        }
        return false;
    }

    // verify if edge exists, add it if it doesn't
    function addEdge(edge: IRef) {
        if (cyIsNull()) return;
        const found = cy.$id(`edge_${edge.neo4j_id}`);
        if (found["length"] === 0) {
            let output: { [key: string]: any } = {
                id: "edge_" + edge.neo4j_id,
                neo4j_id: edge.neo4j_id,
                neo4j_type: edge.type,
                source: "node_" + edge.start,
                target: "node_" + edge.end
            };

            Object.keys(edge.properties).forEach(key => {
                if (key === "id") {
                    output["fosId"] = edge.properties[key];
                } else {
                    output[key] = edge.properties[key];
                }
            });

            let ele: ElementDefinition = {
                group: "edges",
                data: output,
            };
            console.debug("Adding edge:", ele);
            cy.add(ele);
            console.debug(`edge_${edge.neo4j_id} created between node_${edge.start} and node_${edge.end}`);
            return true;
        }
        console.debug(`edge_${edge.neo4j_id} already exists`);
        return false;
    }

    function reDraw(center?: string) {
        if (cyIsNull()) return;
        console.debug("redrawing, center is", center);
        const layoutOptions = {
            name: "cose-bilkent",
            fit: false,
            nodeDimensionsIncludeLabels: true,
        };

        doTimeFilter();

        cy.resize();
        var layout = cy.elements().layout(layoutOptions);

        layout.promiseOn('layoutstop').then(function (event) {
            if (center) {
                const eles = cy.elements(center);
                if (eles.first()) {
                    let ele = eles.nodes('node').first();
                    // todo would be nice to offset this by x if the metadata panel is showing
                    cy.animate({
                        zoom: 1,
                        easing: "ease-in-out-sine",
                        duration: 400,
                        center: {
                            eles: ele
                        }
                    });
                    ele.flashClass("highlight", 1500);
                }
            }
        });
        layout.run();

        // add listener
        let nodes = cy.elements("node[!hasListener]");
        // console.log(`${nodes.size()} nodes match [!hasListener]`);
        nodes.on('tap', function (evt: {
            target: {
                data: () => { fosId: string, type: NodeTypeEnum, neo4j_id: string }
            }
        }) {
            let metadata = {
                type: evt.target.data().type,
                fosId: evt.target.data().fosId,
                neo4j_id: evt.target.data().neo4j_id,
                clear_graph: false,
            };
            setGraphMetadata(metadata);
        });
        // todo add cytoscape.js-popper
        // mark added so that we don't add twice
        nodes.data("hasListener", "tap");
    }

    useEffect(() => {
        //if (!cytoscape || !cy || typeof (cy as any).contextMenus === "undefined") return;
        if (!cytoscape || !cy) return;
        let calls = 0;
        let interval = setInterval(function () {
            if (typeof (cy as any).contextMenus == 'undefined' && calls < 3) {
                console.debug("Waiting for contextMenus extension to load", calls);
                calls += 1;
                return;
            }
            clearInterval(interval);
            if (calls >= 3) {
                console.log("unable to load ext");
                return;
            }
            let contextMenu = (cy as any).contextMenus({
                menuItems: [
                    {
                        id: 'add-relationship',
                        content: 'add relationship',
                        selector: 'node',
                        coreAsWell: true,
                        show: true,
                        submenu: [
                            {
                                id: 'personal',
                                content: 'personal',
                                tooltipText: 'Add personal relationship',
                                onClickFunction: function (event: any) {
                                    // let target = event.target || event.cyTarget;
                                    console.log("got click", event)
                                },
                            },
                        ]
                    },
                ],
                submenuIndicator: {src: submenuIndicatorDefault, width: 12, height: 12}
            });
        }, 1000);
    }, [cy]);

    return (
        <>
            <div className={"graph-redraw-block"}>
                <div
                    role={"button"} onClick={() => reDraw()}
                    className={"shadow graph-redraw-button p-1 bg-light"}>

                    <OverlayTrigger
                        placement="auto"
                        delay={{show: 100, hide: 250}}
                        overlay={renderTooltip({text: "Force redraw and reset positions"})}><FontAwesome
                        name={"refresh"} fixedWidth/></OverlayTrigger>
                </div>
            </div>
            <NodeMetadata hidden={!showMetadata} hideCallback={hideMetadata} metadata={graphMetadata}
                          setMetadataCallback={setMetadataViaCallback} showAwardDetailsCB={showAwardDetails}/>
            <div id={"cy"} className={"mt-0"}
                 ref={instance => {
                     cyRef.current = instance;
                     setRefVisible(!!instance);
                 }}>
            </div>
        </>
    );
};