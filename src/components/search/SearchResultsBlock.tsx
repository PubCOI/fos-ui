import {BaseSearchResult, SearchResultWrapper} from "./SearchInterfaces";
import {Badge, Button, Col, ListGroup, Media, OverlayTrigger, Row, Table} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import Moment from "react-moment";
import FontAwesome from "react-fontawesome";
import PaneContext from "../core/PaneContext";
import {CFViewer} from "../viewer/CFViewer";

export const SearchResultsBlock = (props: { data: SearchResultWrapper, aggregated: boolean }) => {

    const {setPaneTitle, setPaneContents, openPane} = useContext(PaneContext);

    function openPDFPane(attachment_id: string, page_number: string) {
        setPaneTitle("PDF: attachment " + attachment_id);
        setPaneContents(<CFViewer attachment_id={attachment_id} page_number={page_number}/>);
        openPane();
    }

    return (
        <>
            {Boolean(props.aggregated) && (
                <ListGroup variant={"flush"}>
                    {props.data.results.map(item => (
                        <ListGroup.Item key={`fts_result_${item.key}`} action
                                        onClick={() => openPDFPane(item.attachmentId, "1")}>

                            <Media className={"py-3"}>
                                <FontAwesome name={"file-pdf-o"} size={"2x"} className={"pr-4"}/>
                                <Media.Body>
                                    <div className={"pt-1 d-flex justify-content-between"}>

                                        <h5>Attachment #{item.attachmentId} <small
                                            className={"ml-1 text-muted font-italic"}>{item.hits} hits</small></h5>

                                    </div>

                                    <SearchMetadataBlock item={item}/>

                                    <div className={"text-muted shadow rounded p-3 mt-3"}
                                         hidden={item.fragments.length < 1}>
                                        {item.fragments.map((fragment, index) => (
                                            <><span key={`${item.key}_fragment_${index}`} dangerouslySetInnerHTML={{
                                                __html: fragment
                                            }}/>&#8230; </>))}
                                    </div>

                                </Media.Body>
                            </Media>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}

            {Boolean(!props.aggregated) && (
                <ListGroup>
                    {props.data.results.map(item => (
                        <ListGroup.Item key={`fts_result_${item.key}`} action
                                        onClick={() => openPDFPane(item.attachmentId, item.pageNumber)}>
                            <div>
                                <Badge
                                    variant={"dark"}>Page {item.pageNumber}</Badge> {item.fragments.map((fragment, index) => (
                                <><span key={`${item.key}_fragment_${index}`} dangerouslySetInnerHTML={{
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

const SearchMetadataBlock = (props: { item: BaseSearchResult}) => {
    return (
        <>
            <SearchMetadataRow icon={"building-o"} label={"Purchaser"} value={props.item.client}/>
            <SearchMetadataRow icon={"calendar"} label={"First award date"} value={<Moment date={props.item.firstAwardDT} format={"DD MMM yyyy"}/>}/>
            <SearchMetadataRow icon={"calendar"} label={"Published"} value={<>
                <Moment date={props.item.noticeDT} format={"DD MMM yyyy"}/> (<Moment duration={props.item.firstAwardDT} date={props.item.noticeDT} format={"D"}/> days later)
            </>}/>
            <SearchMetadataRow icon={"quote-right"} label={"Contract description"} value={props.item.noticeDescription}/>
        </>
    )
};

const SearchMetadataRow = (props: {icon: string, label: string, value: any}) => {
    return (
        <Row className={"small"}>
            <Col md={3} className={"text-nowrap"}>
                <FontAwesome name={props.icon} className={"mr-1"}/> {props.label}
            </Col>
            <Col className={"mb-2 mb-md-0"}>{props.value}</Col>
        </Row>
    )
};