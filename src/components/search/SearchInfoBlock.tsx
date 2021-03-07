import {Button, Col, Form, Jumbotron, Row} from "react-bootstrap";
import React from "react";

export const SearchInfoBlock = () => {
    return (
        <Row>
            <Col md={8} className={"offset-md-2"}>
                <Jumbotron className={"rounded bg-light mt-5 m-3"}>
                    {/*<Form onSubmit={props.handler}>*/}
                    {/*    <Form.Group controlId="search">*/}
                    {/*        <Form.Label className={"lead"}>Search contracts data</Form.Label>*/}
                    {/*        <Form.Control type="text" placeholder="Search term(s)"/>*/}
                    {/*    </Form.Group>*/}
                    {/*    <Button variant="primary" type="submit">*/}
                    {/*        Go*/}
                    {/*    </Button>*/}
                    {/*</Form>*/}
                    <h2 className={"lead"}>Search contracts data</h2>
                    <p>Enter your term(s) in the box above</p>
                    <div className={"text-muted"}>
                        <p>This searches contracts data that has been scanned and automatically OCR'd by our system</p>
                    </div>
                </Jumbotron>
            </Col>
        </Row>
    )
};