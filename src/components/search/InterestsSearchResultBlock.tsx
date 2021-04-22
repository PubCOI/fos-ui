import {InterestsSearchResultsWrapper} from "./SearchInterfaces";
import {Accordion, Alert, Button, Card, ListGroup} from "react-bootstrap";
import React from "react";
import FontAwesome from "react-fontawesome";

export const InterestsSearchResultsBlock = (props: { data: InterestsSearchResultsWrapper }) => {

    return (
        <>
            <Alert variant={"primary"} className={"mb-2 text-muted"}>
                Returned {props.data.count} results
            </Alert>

            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="abc">
                    Click me!
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="abc">
                    <Card.Body>Hello! I'm the body</Card.Body>
                </Accordion.Collapse>
            </Card>

            <ListGroup variant={"flush"}>



                {props.data.results.map((item, idx) => (
                    <ListGroup.Item key={`fts_result_${idx}`}>

                        <Alert variant={"info"} className={"mb-0 py-2"}>{item.personName}</Alert>

                        {item.top_hits.map((hit, hidx) => (
                            <Card key={`fts_result_${idx}_hit_${hidx}`}>
                                <div>{idx} hit {hidx}</div>
                                <Card.Header>
                                <Accordion.Toggle as={Button} eventKey={`interest_hit-${idx}-${hidx}`} className={"bg-light"}>
                                    <div className={"d-flex align-items-start"}>
                                        <div className={"mr-2 text-nowrap"}><FontAwesome name={"caret-right"}
                                                                                         className={"mr-1"}/> {hit.registeredDate}
                                        </div>
                                        <div className={"text-muted"}>
                                            {hit.fragments.map((fragment, fidx) => (
                                                <><span key={`${hit.id}_fragment_${hidx}`} dangerouslySetInnerHTML={{
                                                    __html: fragment
                                                }}/>&#8230; </>)
                                            )}
                                        </div>
                                    </div>
                                </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey={`interest_hit-${idx}-${hidx}`}>
                                    <Card.Body>
                                        <div>{hit.text}</div>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        ))}

                        {/*<ListGroup variant={"flush"}>*/}
                        {/*    {item.top_hits.map((hit, hidx) => (*/}
                        {/*        <ListGroup.Item key={`fts_result_${idx}_hit_${hidx}`}>*/}
                        {/*            <div className={"d-flex align-items-start"}>*/}
                        {/*                <div className={"mr-2 text-nowrap"}><FontAwesome name={"caret-right"}*/}
                        {/*                                                                 className={"mr-1"}/> {hit.registeredDate}*/}
                        {/*                </div>*/}
                        {/*                <div className={"text-muted"}>*/}
                        {/*                    {hit.fragments.map((fragment, fidx) => (*/}
                        {/*                        <><span key={`${hit.id}_fragment_${hidx}`} dangerouslySetInnerHTML={{*/}
                        {/*                            __html: fragment*/}
                        {/*                        }}/>&#8230; </>)*/}
                        {/*                    )}*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        </ListGroup.Item>*/}
                        {/*    ))}*/}
                        {/*</ListGroup>*/}

                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    )
};