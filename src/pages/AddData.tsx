import React, {useEffect, useState} from "react";
import {Alert, Button, Col, Container} from "react-bootstrap";
import {AddDataForm} from "../components/addData/AddDataForm";
import {NoticeIndex, NoticeSearchResponse} from "../generated/NoticeSearchResponse";
import {LoadingWrapper} from "../components/LoadingWrapper";
import {css} from "@emotion/css";
import Datatable from 'react-bs-datatable';
import Moment from "react-moment";
import FontAwesome from "react-fontawesome";
import {useToasts} from "react-toast-notifications";

export const AddData = () => {

    const [searchResponse, setSearchResponse] = useState<NoticeSearchResponse>();
    const [searchResponseItems, setSearchResponseItems] = useState<NoticeIndex[] | undefined>();
    const [doingSearch, setDoingSearch] = useState(false);
    const [hasValidResponse, setHasValidResponse] = useState(false);

    useEffect(() => {
        if (null === searchResponse || undefined === searchResponse) return setHasValidResponse(false);
        if (undefined === searchResponse.hitCount || searchResponse.hitCount < 1) return setHasValidResponse(false);
        setHasValidResponse(true);
    }, [searchResponse]);

    useEffect(() => {
        // if we were being clever about this, we'd do it as a map reduce
        let objmap: NoticeIndex[] = [] as NoticeIndex[];
        searchResponse?.noticeList?.hitOfNoticeIndex?.forEach((hit) => {
            if (undefined !== hit.item) objmap.push(hit.item);
        });
        setSearchResponseItems(objmap);
    }, [searchResponse]);

    function resetSearch() {
        setHasValidResponse(false);
    }

    return (
        <>
            <Container fluid className={"p-3"}>
                <Col md={10} className={"offset-md-1 mt-md-4"}>
                    <div className={"shadow p-4 rounded"}>
                        <h3>Add new contract data</h3>

                        {Boolean(!hasValidResponse) && (
                            <AddDataForm
                                doingSearch={doingSearch}
                                setDoingSearchCallback={setDoingSearch}
                                setSearchResponseCallback={setSearchResponse}
                            />
                        )}

                        {Boolean(doingSearch || (searchResponse && hasValidResponse)) && (
                            <>
                                {Boolean(doingSearch) && (
                                    <LoadingWrapper/>
                                )}

                                {Boolean(searchResponse) && (
                                    <RenderNoticesSearchResponse data={searchResponseItems} wrapper={searchResponse}
                                                                 resetSearchCallback={resetSearch}/>
                                )}
                            </>
                        )}
                    </div>
                </Col>
            </Container>
        </>
    )
};

export const RenderNoticesSearchResponse = (
    props: {
        data: NoticeIndex[] | undefined,
        wrapper: NoticeSearchResponse | undefined,
        resetSearchCallback: () => void,
    }
) => {

    useEffect(() => {
        console.log(props.wrapper?.noticeList)
    }, []);

    return (
        <>
            {Boolean(props.wrapper?.hitCount) && (
                <Alert variant={"primary"} className={"mt-3"}>
                    <div className={"d-flex justify-content-between align-items-center"}>
                        <div>
                            {props.wrapper?.hitCount} notice{(props.wrapper?.hitCount && props.wrapper?.hitCount === 1) ? "" : "s"} returned
                        </div>
                        <div>
                            <Button variant={"outline-primary"} size={"sm"} onClick={() => props.resetSearchCallback()}>New
                                search</Button>
                        </div>
                    </div>
                </Alert>
            )}

            <RenderResponseTable data={props.data}/>
        </>
    )
};

const RenderResponseTable = (props: { data: NoticeIndex[] | undefined }) => {

    const {addToast} = useToasts();

    // adding notices should be done from this component
    function addNotice(id: string) {
        console.log("doing add for ID", id);
        addToast(`Adding award ${id} to the system`, {
            appearance: "info",
            autoDismiss: true
        });
        return 0;
    }

    function getHeader() {
        return [
            {
                title: 'Awarded',
                prop: 'awardedDate',
                filterable: true,
                sortable: true,
                cell: (row: NoticeIndex) => {
                    return <Moment date={row.awardedDate} format={"yyyy-MM-DD"}/>
                }
            },
            {
                title: 'Published',
                prop: 'publishedDate',
                filterable: true,
                sortable: true,
                cell: (row: NoticeIndex) => {
                    return <Moment date={row.publishedDate} format={"yyyy-MM-DD"}/>
                }
            },
            {
                title: 'Title',
                prop: 'title',
                sortable: true,
                filterable: true,
            },
            {
                title: 'Awarded to',
                prop: 'awardedSupplier',
                sortable: true,
                filterable: true,
            },
            {
                title: '',
                prop: 'text',
                filterable: true,
                cell: (row: NoticeIndex) => {
                    return (<FetchAddButton addNoticeCallback={addNotice} row={row}/>);
                }
            }
        ];
    }

    const tableClasses = {
        table: `table-striped table-hover mt-3`,
        paginationOptsFormText: css`
        &:first-of-type {
          margin-right: 8px;
        }
        &:last-of-type {
          margin-left: 8px;
        }`,
        theadCol: css`
          &:nth-of-type(1), &:nth-of-type(1) span {
            white-space: nowrap;
            float: none!important;
          }
          &:nth-of-type(2), &:nth-of-type(2) span {
            white-space: nowrap;
            float: none!important;
          }
        `
    };

    if (undefined === props.data) {
        return (<></>);
    }

    return (
        <>
            <Datatable tableHeaders={getHeader()}
                       tableBody={props.data}
                       initialSort={{prop: 'publishedDate', isAscending: false}}
                       classes={tableClasses}
                       rowsPerPage={5}
                       rowsPerPageOption={[5, 10]}
            />
        </>
    )
};

const FetchAddButton = (props: { row: NoticeIndex, addNoticeCallback: (id: string) => number }) => {

    const [icon, setIcon] = useState((props.row.alreadyLoaded) ? "check" : "plus");
    const [doingUpdate, setDoingUpdate] = useState(false);
    const [response, setResponse] = useState(-1);
    const [disabled, setDisabled] = useState((props.row.alreadyLoaded));
    const [showOverlay, setShowOverlay] = useState(true);

    useEffect(() => {
        if (response === 0) {
            setDoingUpdate(false);
            setIcon("check");
        }
        setShowOverlay(false);
    }, [response]);

    function addNotice(id: string) {
        setDisabled(true);
        setIcon("spinner");
        setDoingUpdate(true);
        setResponse(props.addNoticeCallback(id));
    }

    return (

        <Button variant={"outline-success"} size={"sm"} className={"rounded"} disabled={disabled} onClick={() => {
            if (props.row.id) addNotice(props.row.id)
        }}>
            <FontAwesome name={icon} fixedWidth spin={doingUpdate}/>
        </Button>

    )
};