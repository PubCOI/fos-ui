import React, {useContext} from "react";
import {AccordionContext, Card, useAccordionToggle} from "react-bootstrap";

export function ContextAwareToggle(
    props:
        {
            children: any,
            eventKey: string,
            callback: (eventKey: string) => void,
            className?: string
        }
) {
    const currentEventKey = useContext(AccordionContext);

    const decoratedOnClick = useAccordionToggle(
        props.eventKey,
        () => props.callback && props.callback(props.eventKey),
    );

    const isCurrentEventKey = currentEventKey === props.eventKey;

    return (
        <Card.Header className={props.className} onClick={decoratedOnClick} role={"button"}>
            {props.children}
        </Card.Header>
    );
}