import {SearchResultWrapper} from "./SearchInterfaces";
import {Badge, Button, ListGroup} from "react-bootstrap";
import React from "react";
import Moment from "react-moment";
import FontAwesome from "react-fontawesome";
import {Link} from "react-router-dom";

export const SearchResultsBlock = (props: { data: SearchResultWrapper, aggregated: boolean }) => {

    return (
        <>
            {Boolean(props.aggregated) && (
                <ListGroup>
                    {props.data.aggregated.map(item => (
                        <ListGroup.Item key={`fts_result_${item.key}`} action as={Link}
                                        to={`/view/cf/${item.attachmentId}/page/1`}>
                            <h5 className={"d-flex justify-content-between"}>{item.organisation} <small><Badge
                                variant={"info"} pill>pub. <Moment format={"DD MMM YY"}>{item.noticeDT}</Moment></Badge></small>
                            </h5>
                            <div className={"text-muted"}>
                                <span dangerouslySetInnerHTML={{__html: item.fragments[0]}}/>
                            </div>
                            <div className={"d-flex justify-content-between align-items-center mt-2"}>
                                <Badge variant={"primary"} pill>{item.hits} result(s)</Badge>
                                <div>
                                    <Button size={"sm"} variant={"outline-secondary"}>attachment <FontAwesome
                                        name={"external-link"}/></Button>
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}

            {Boolean(!props.aggregated) && (
                <ListGroup>
                    {props.data.paged.map(item => (
                        <ListGroup.Item key={`fts_result_${item.key}`} action as={Link}
                                        to={`/view/cf/${item.attachmentId}/page/${item.pageNumber}`}>
                            <h5 className={"d-flex justify-content-between"}>{item.organisation} <small><Badge
                                variant={"info"} pill>pub. <Moment format={"DD MMM YY"}>{item.noticeDT}</Moment></Badge></small>
                            </h5>
                            <div>
                                {item.fragments.map(fragment => (
                                    <><span dangerouslySetInnerHTML={{
                                        __html: fragment
                                    }}/>&#8230; </>))}
                            </div>
                            <div className={"d-flex justify-content-between align-items-center mt-2"}>
                                <div className={"text-muted"}>Notice {item.noticeId}</div>
                                <div>
                                    {/*<Button size={"sm"} className={"mx-2"} variant={"outline-primary"}>notice</Button>*/}
                                    <Button size={"sm"} variant={"outline-secondary"}>attachment <FontAwesome
                                        name={"external-link"}/></Button>
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </>
    )
};