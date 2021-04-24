import React from "react";
import FontAwesome from "react-fontawesome";
import {Link} from "react-router-dom";
import {Col, Container, Row} from "react-bootstrap";
import {useWindowSize} from "../hooks/Utils";

export const Home = () => {
    const size = useWindowSize();
    return (
        <>
            <Container fluid className={"p-3"}>
                <Row>
                    <Col md={"10"}
                         className={`offset-md-1 p-5 mt-3 mb-0 my-md-5 rounded ${(size.width >= 768) ? "shadow" : ""}`}>
                        <div className={"display-4"}>Fos</div>
                        <div className={"lead"}>
                            Find and investigate links between public contracts, companies, officers and
                            politicians<span className={"text-muted text-superscript"}>*</span>
                        </div>
                        <div className={"small text-muted"}><span className={"text-superscript"}>*</span>work (very
                            much) in progress
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={"10"} className={`offset-md-1 p-5 rounded ${(size.width >= 768) ? "shadow" : ""}`}>
                        <p>
                            Fos is part of a wider set of tools that are being developed through the
                            parent <a href="https://pubcoi.org" target="_blank"
                                      rel={"noreferrer"}>PubCOI.org <FontAwesome name={"external-link"}/></a> project.
                        </p>
                        <p>
                            The platform and all of the data processing libraries are strictly open-source and released
                            on our
                            public <a href={"https://github.com/PubCOI"} target={"_blank"} rel={"noreferrer"}>GitHub
                            page <FontAwesome name={"external-link"}/></a>.
                        </p>
                        <h3>How can I help?</h3>
                        <p>
                            Thanks for asking! All of the outstanding 'tasks' needing a pair of human eyes are listed on
                            the <Link to={"/tasks"}>tasks</Link> page. Each of these is usually a ten-second job:
                            clicking to verify that a company on file is the same as <em>x</em> company in
                            Companies House, etc.
                        </p>
                        <p>
                            If you're a developer, head over to the GitHub page, download the source, and get hacking!
                            Contact the
                            project on <a href={"mailto:info@pubcoi.org"}>info@pubcoi.org</a> if you have issues getting
                            up and running.
                        </p>
                        <h3>Credits</h3>
                        <p>
                            We are indebted to <a href={"https://opencorporates.com"} target={"_blank"}
                                                  rel={"noreferrer"}>OpenCorporates <FontAwesome
                            name={"external-link"}/></a> for
                            access to their corporate info database. It makes cross-referencing data on Companies House
                            (approximately) a 6.022&times;10<sup>23</sup> times easier.
                        </p>
                    </Col>
                </Row>

                <div className={"my-5"}>&nbsp;</div>
            </Container>

        </>
    )
};