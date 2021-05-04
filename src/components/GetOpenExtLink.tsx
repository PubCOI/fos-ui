import FontAwesome from "react-fontawesome";
import React, {useEffect, useState} from "react";

export const GetOpenExtLink = (props: { href?: string }) => {

    const [url, setUrl] = useState("");

    useEffect(() => {
        if (undefined === props.href) return;
        let newUrl = null !== props.href ? props.href.match(/^https?:\/\//i) ? props.href : `http://${props.href}` : "";
        setUrl(newUrl);
    }, [props]);

    return (
        (url === "") ? (<></>) :
            <a href={url} onClick={() => window.open(url)}><FontAwesome name={"external-link"}/></a>
    )
};