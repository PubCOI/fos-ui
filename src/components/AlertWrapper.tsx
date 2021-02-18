import React from 'react';
import {Alert} from 'react-bootstrap';

export const AlertWrapper = (props: { text: string }) => {
    return (
        <>
            <Alert className={"block"} variant={"danger"}>
                <h5>Error</h5>
                <div>{props.text}</div>
            </Alert>
        </>
    )
};