import {InterestsSearchResultsWrapper} from "./SearchInterfaces";
import {Accordion, Alert, Card, ListGroup} from "react-bootstrap";
import React, {useState} from "react";
import FontAwesome from "react-fontawesome";
import {ContextAwareToggle} from "../ContextAwareToggle";

export const InterestsSearchResultsBlock = (props: { data: InterestsSearchResultsWrapper }) => {

    const [currentEventKey, setCurrentEventKey] = useState("");

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

                                    <ContextAwareToggle
                                        key={`_hit_${hit.id}`} eventKey={hit.id}
                                        callback={setCurrentEventKey}>
                                        <div className={"d-flex align-items-start"}>
                                            <div className={"mr-2 text-nowrap"}>
                                                <FontAwesome
                                                    fixedWidth
                                                    name={currentEventKey === `${hit.id}` ?
                                                        "caret-down" : "caret-right"}/>{hit.registeredDate}
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
                                    </ContextAwareToggle>

                                    <Accordion.Collapse
                                        eventKey={hit.id}
                                        key={`_accordion_${hit.id}`}>
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