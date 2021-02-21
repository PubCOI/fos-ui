import React, {useEffect, useRef, useState} from "react";
import useResizeAware from "react-resize-aware";
import PropTypes from "prop-types";
import Neovis from "neovis.js";
import ILabelConfig from "neovis.js";

const credentials = {
    username: "neo4j",
    password: "password",
    endpoint: "bolt://127.0.0.1:7687"
};

const NeoGraph = (props: any) => {
    const {
        containerId
    } = props;

    const visRef = useRef<HTMLDivElement|null>(null);
    const [refVisible, setRefVisible] = useState(false);

    const neovisConfig = {
        container_id: visRef.current?.id || "",
        server_url: credentials.endpoint,
        server_user: credentials.username,
        server_password: credentials.password,
        relationships: {
            PUBLISHED: {
                caption: false,
            },
        },
        arrows: true,
        labels: {
            "Client": {
                caption: "clientName",
                size: "40",
            },
            "Tender": {
                caption: "id",
                size: "20"
            }
        },
        initial_cypher: "MATCH(c:Client)-[ref:PUBLISHED]-(t:Tender) " +
            "WHERE c.hidden=false AND ref.hidden=false AND t.hidden=false " +
            "RETURN c, ref, t LIMIT 50"
        // "MATCH (c:Client)-[rel:PUBLISHED]->(t:Tender) RETURN c, t, rel LIMIT 10",
    };
    const vis = new Neovis(neovisConfig);

    useEffect(() => {
        if (!refVisible) {
            return
        }
        console.debug("Got div ref: rendering graph");
        vis.render();
    }, [refVisible]);

    return (
        <>
            <div
                id={containerId}
                ref={el => {
                    visRef.current = el;
                    setRefVisible(!!el);
                }}
                style={{
                    width: `100%`,
                    height: `100vh`,
                }}/>
        </>
    );
};

NeoGraph.defaultProps = {
    width: 600,
    height: 600,
    backgroundColor: "#d3d3d3",
};

NeoGraph.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    containerId: PropTypes.string.isRequired,
};

const ResponsiveNeoGraph = (props: any) => {
    const [resizeListener, sizes] = useResizeAware();
    const side = Math.max(sizes.width || 600, sizes.height || 600) / 2;
    const neoGraphProps = {...props, width: side, height: side};
    return (
        <div style={{position: "relative"}}>
            {resizeListener}
            <NeoGraph {...neoGraphProps} />
        </div>
    );
};

ResponsiveNeoGraph.defaultProps = {
    backgroundColor: "#d3d3d3",
};

ResponsiveNeoGraph.propTypes = {
    containerId: PropTypes.string.isRequired,
};

export {NeoGraph, ResponsiveNeoGraph};