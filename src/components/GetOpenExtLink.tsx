import FontAwesome from "react-fontawesome";
import React, {useEffect, useState} from "react";

export const GetOpenExtLink = (props: {href: string}) => {

    const [url, setUrl] = useState("");

    useEffect(() => {
        let newUrl = props.href.match(/^https?:\/\//i) ? props.href : `http://${props.href}`;
        setUrl(newUrl);
    }, [props]);

    return (
        <a href={props.href} onClick={() => window.open(url)}><FontAwesome name={"external-link"}/></a>
    )
};