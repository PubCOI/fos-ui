import {Col, Jumbotron, Row} from "react-bootstrap";
import React from "react";

export const EmptyAttachmentSearchResponse = () => {
    return (
        <Row>
            <Col md={8} className={"offset-md-2"}>
                <Jumbotron className={"rounded bg-light mt-5 m-3"}>
                    <h2 className={"lead"}>No results found</h2>
                    <pre>:(</pre>
                    <p>Either the data isn't loaded or hasn't been fully scanned yet</p>
                    <div className={"text-muted"}>
                        <p>If you've just added data to the system, note it can take some hours for data to be
                            scanned</p>
                    </div>
                </Jumbotron>
            </Col>
        </Row>
    )
};