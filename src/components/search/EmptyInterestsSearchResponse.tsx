import {Button, Col, Form, Jumbotron, Row} from "react-bootstrap";
import React from "react";

export const EmptyInterestsSearchResponse = () => {
    return (
        <Row>
            <Col md={8} className={"offset-md-2"}>
                <Jumbotron className={"rounded bg-light mt-5 m-3"}>
                    <h2 className={"lead"}>No results found</h2>
                    <pre>:(</pre>
                </Jumbotron>
            </Col>
        </Row>
    )
};