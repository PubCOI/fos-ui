import {Col, Media, Row} from "react-bootstrap";
import React from "react";
import {useWindowSize} from "../../hooks/Utils";
import {SearchType} from "../../pages/Search";
import FontAwesome from "react-fontawesome";

export const SearchInfoBlock = (props: { type: SearchType }) => {
    const size = useWindowSize();
    return (
        <Row>
            <Col md={"8"} className={`offset-md-2 p-5 my-5 rounded ${(size.width >= 768) ? "shadow" : ""}`}>

                {Boolean(props.type === SearchType.contracts) && (
                    <>
                        <h2 className={"lead"}>Search contracts data</h2>
                        <p>Enter your term(s) in the box above</p>
                        <div className={"text-muted mt-5"}>

                            <Media>
                                <FontAwesome name={"hand-o-right"} className={"ml-1 mr-3"} size={"2x"}/>
                                <Media.Body>
                                    <p>
                                        When contracts are added to the contracts finder, they sometimes include links to
                                        attachments and other data. When you import a contract onto Fos, it automagically
                                        fetches, converts and OCRs this data so as to make it fully searchable.
                                    </p>
                                    <p>
                                        The process sometimes takes a few hours to complete though, so if you've only
                                        just added a contract please check back in a couple of hours.
                                    </p>
                                </Media.Body>
                            </Media>


                        </div>
                    </>
                )}

                {Boolean(props.type === SearchType.interests) && (
                    <>
                        <h2 className={"lead"}>Search members' interests</h2>
                        <p>Enter your term(s) in the box above</p>
                        <div className={"text-muted"}>
                            <p>Performs a search on the content of all records holding members' interests</p>
                        </div>
                    </>
                )}

            </Col>
        </Row>
    )
};