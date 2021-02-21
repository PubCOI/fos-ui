import {Col, Row} from "react-bootstrap";
import React from "react";
import FontAwesome from "react-fontawesome";
import {FOSDropZone} from "../components/FOSDropZone";

export const Upload = () => {
    return (
        <>
            <Row>
                <Col md={8} className={"offset-md-2"}>
                    <h2>Contracts Finder: data upload</h2>
                    <p>
                        Right now, we're just allowing you to upload XML data from the <a
                        href={"https://www.contractsfinder.service.gov.uk/"}
                        rel={"noreferrer"}
                        target={"_blank"}>HMG “Contracts Finder”&nbsp;<FontAwesome
                        name={"external-link"}/></a>. Follow the steps below to get the data in the correct format.
                    </p>
                    <dl>
                        <dt>Step 1</dt>
                        <dd>
                            Browse to the Contracts Finder site and perform a search using your terms of choice. Make
                            sure that you're only returning “Awarded” contracts.
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
                    <p>
                        Please note this site is still under development. If errors occur, please email <a
                        href={"mailto:info@pubcoi.org"}>info@pubcoi.org</a> with details of what you were doing etc at
                        the time; it's much appreciated.
                    </p>
                </Col>
            </Row>
            <Row>
                <Col md={8} className={"offset-md-2"}>
                    <FOSDropZone/>
                </Col>
            </Row>
        </>
    )
};