import {Col, Row} from "react-bootstrap";
import React from "react";
import {useWindowSize} from "../../hooks/Utils";

export const SearchInfoBlock = () => {
    const size = useWindowSize();
    return (
        <Row>

            <Col md={"8"} className={`offset-md-2 p-5 my-5 rounded ${(size.width >= 768) ? "shadow" : ""}`}>
                <h2 className={"lead"}>Search contracts data</h2>
                <p>Enter your term(s) in the box above</p>
                <div className={"text-muted"}>
                    <p>This searches contracts data that has been scanned and automatically OCR'd by our system</p>
                </div>
            </Col>

        </Row>
    )
};