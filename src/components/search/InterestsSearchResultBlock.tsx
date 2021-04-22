import {InterestsSearchResultsWrapper} from "./SearchInterfaces";
import {Accordion, Alert, Card, ListGroup} from "react-bootstrap";
import React from "react";
import FontAwesome from "react-fontawesome";
import Moment from "react-moment";
import {ContextAwareToggle} from "../ContextAwareToggle";

export const InterestsSearchResultsBlock = (props: { data: InterestsSearchResultsWrapper }) => {

    return (
        <>
            <Alert variant={"primary"} className={"mb-2 text-muted"}>
                Returned {props.data.count} results
            </Alert>

            <ListGroup variant={"flush"}>
                {props.data.results.map((item) => (
                    <ListGroup.Item key={`fts_result_${item.mnisPersonId}`}>

                        <Alert variant={"info"} className={"mb-0 py-2"}>{item.personName}</Alert>

                        <Accordion>
                            {item.top_hits.map((hit) => (
                                <Card key={`fts_result_${item.mnisPersonId}_hit_${hit.id}`}>


                                    {/*<ContextAwareToggle callback={setCurrentEventKey} eventKey={`${hit.id}`}>*/}
                                    {/*    <div className={"d-flex align-items-start"}>*/}
                                    {/*        <div className={"mr-2 text-nowrap"}><FontAwesome*/}
                                    {/*            name={"caret-right"} className={"mr-1"}/> {hit.registeredDate}*/}
                                    {/*        </div>*/}
                                    {/*        <div className={"text-muted"}>*/}
                                    {/*            {hit.fragments.map((fragment, fidx) => (*/}
                                    {/*                <>*/}
                                    {/*                <span key={`interest_hit-${hit.id}_fragment_${fidx}`}*/}
                                    {/*                      dangerouslySetInnerHTML={{*/}
                                    {/*                          __html: fragment*/}
                                    {/*                      }}/>&#8230;*/}
                                    {/*                </>*/}
                                    {/*            ))}*/}
                                    {/*        </div>*/}
                                    {/*    </div>*/}
                                    {/*</ContextAwareToggle>*/}


                                    <Accordion.Toggle
                                        as={Card.Header} role={"button"}
                                        eventKey={`interest_hit-${hit.id}`}
                                        className={"bg-light"}>
                                        <div className={"d-flex align-items-start"}>
                                            <div className={"mr-2 text-nowrap"}><FontAwesome
                                                name={"caret-right"} className={"mr-1"}/> {hit.registeredDate}
                                            </div>
                                            <div className={"text-muted"}>
                                                {hit.fragments.map((fragment, fidx) => (
                                                    <>
                                                    <span key={`interest_hit-${hit.id}_fragment_${fidx}`}
                                                          dangerouslySetInnerHTML={{
                                                              __html: fragment
                                                          }}/>&#8230;
                                                    </>
                                                ))}
                                            </div>
                                        </div>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey={`interest_hit-${hit.id}`}>
                                        <Card.Body>
                                            <div>{hit.text}</div>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            ))}
                        </Accordion>

                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    )
};