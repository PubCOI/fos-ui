import {Col, Container, Row} from "react-bootstrap";
import React from "react";
import FontAwesome from "react-fontawesome";
import {FosDropZone} from "../components/FosDropZone";

export const Upload = () => {
    return (
        <>
            <Container fluid className={"p-3"}>
                <Row>
                    <Col md={8} className={"offset-md-2 mt-3"}>
                        <h2>Contracts Finder: data upload</h2>
                        <p>
                            This allows you to add contract data to the standalone version of Fos.
                        </p>
                        <dl>
                            <dt>Step 1</dt>
                            <dd>
                                Browse to the <a href={"https://www.contractsfinder.service.gov.uk/"} rel={"noreferrer"}
                                                 target={"_blank"}>HMG “Contracts Finder”&nbsp;<FontAwesome
                                name={"external-link"}/></a> site and perform a search using your terms of choice. Make
                                sure that you're only
                                returning “Awarded” contracts.
                            </dd>
                            <dt>Step 2</dt>
                            <dd>
                                Download the results as XML. The results can take ~30 seconds to be downloaded in your
                                browser. Note that a maximum of 1,000 records will be returned.
                            </dd>
                            <dt>Step 3</dt>
                            <dd>
                                Drag the XML file to the window below. For large requests, the data processing can take
                                some minutes.
                            </dd>
                        </dl>
                    </Col>
                </Row>
                <Row>
                    <Col md={8} className={"offset-md-2"}>
                        <FosDropZone/>
                    </Col>
                </Row>
            </Container>
        </>
    )
};