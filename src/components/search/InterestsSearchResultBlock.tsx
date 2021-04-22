import {InterestsSearchResultsWrapper} from "./SearchInterfaces";
import {Accordion, Alert, Card, ListGroup, OverlayTrigger} from "react-bootstrap";
import React, {useContext, useState} from "react";
import FontAwesome from "react-fontawesome";
import {ContextAwareToggle} from "../ContextAwareToggle";
import {renderTooltip} from "../../hooks/Utils";
import AppContext from "../core/AppContext";
import {ViewAllInterestsModal} from "./modals/ViewAllInterestsModal";

export const InterestsSearchResultsBlock = (props: { data: InterestsSearchResultsWrapper }) => {

    const {setModalBody} = useContext(AppContext);
    const [currentEventKey, setCurrentEventKey] = useState("");

    function viewRecords(id: number) {
        setModalBody(<ViewAllInterestsModal id={id}/>)
    }

    return (
        <>
            <Alert variant={"primary"} className={"mb-2 text-muted"}>
                Returned {(props.data.count === 10) ? "first" : ""} {props.data.count} results
            </Alert>

            <ListGroup variant={"flush"}>
                {props.data.results.map((item) => (
                    <ListGroup.Item key={`fts_result_${item.mnisPersonId}`}>

                        <Alert variant={"info"} className={"mb-0 py-2 px-3"}>
                            <div className={"d-flex justify-content-between align-items-center"}>
                                <div>{item.personName}</div>
                                <div>
                                    <div>
                                        <OverlayTrigger
                                            placement="auto"
                                            delay={{show: 0, hide: 250}}
                                            overlay={renderTooltip({text: `View all records for ${item.personName}`})}>
                                            <FontAwesome
                                                onClick={() => viewRecords(item.mnisPersonId)}
                                                name={"eye"} fixedWidth role={"button"}/>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                            </div>
                        </Alert>

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
                                                {Boolean(hit.fragments.length > 0) && (
                                                    <>
                                                        {hit.fragments.map((fragment, fidx) => (
                                                            <>
                                                    <span key={`interest_hit-${hit.id}_fragment_${fidx}`}
                                                          dangerouslySetInnerHTML={{
                                                              __html: fragment
                                                          }}/>&#8230;
                                                            </>
                                                        ))}
                                                    </>
                                                )}

                                                {Boolean(hit.fragments.length === 0) && (
                                                    <>
                                                        [multiple hits within text, click for details]
                                                    </>
                                                )}

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