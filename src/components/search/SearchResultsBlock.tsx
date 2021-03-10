import {SearchResultWrapper} from "./SearchInterfaces";
import {Badge, Button, ListGroup, Media} from "react-bootstrap";
import React from "react";
import Moment from "react-moment";
import FontAwesome from "react-fontawesome";
import {Link} from "react-router-dom";

export const SearchResultsBlock = (props: { data: SearchResultWrapper, aggregated: boolean }) => {

    return (
        <>
            {Boolean(props.aggregated) && (
                <ListGroup variant={"flush"}>
                    {props.data.aggregated.map(item => (
                        <ListGroup.Item key={`fts_result_${item.key}`} action as={Link}
                                        to={`/view/cf/${item.attachmentId}/page/1`}>

                            <Media className={"py-3"}>
                                <FontAwesome name={"file-pdf-o"} size={"2x"} className={"pr-4"}/>
                                <Media.Body>
                                    <div className={"pt-1 d-flex justify-content-between"}>

                                        <h5>{item.organisation} <small
                                            className={"ml-1 text-muted font-italic"}>{item.hits} hits</small></h5>

                                        <div>
                                            <Badge
                                                variant={"info"} pill>pub. <Moment
                                                format={"DD MMM YY"}>{item.noticeDT}</Moment></Badge>
                                        </div>
                                    </div>
                                    <div className={"text-muted font-italic"}>{item.noticeDescription}</div>

                                    <div className={"text-muted shadow rounded p-3 mt-3"} hidden={item.fragments.length < 1}>
                                        {item.fragments.map(fragment => (
                                            <><span dangerouslySetInnerHTML={{
                                                __html: fragment
                                            }}/>&#8230; </>))}
                                    </div>

                                </Media.Body>
                            </Media>

                            {/*<div className={"d-flex justify-content-between align-items-center mt-2"}>*/}
                            {/*    <div>*/}
                            {/*        <Button size={"sm"} variant={"outline-secondary"}>attachment <FontAwesome*/}
                            {/*            name={"external-link"}/></Button>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
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