import React, {useEffect, useState} from "react";
import {Alert, Button, Col, Container} from "react-bootstrap";
import {AddDataForm} from "../components/addData/AddDataForm";
import {LoadingWrapper} from "../components/LoadingWrapper";
import {css} from "@emotion/css";
import Datatable from 'react-bs-datatable';
import Moment from "react-moment";
import FontAwesome from "react-fontawesome";
import {useToasts} from "react-toast-notifications";
import axios, {AxiosError} from "axios";
import firebase from "firebase";
import {NoticeHitType, NoticeIndex, NoticeSearchResponse} from "../generated/FosTypes";
import NumberFormat from "react-number-format";

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
        searchResponse?.noticeList?.hitOfNoticeIndices?.forEach((hit: NoticeHitType) => {
            if (undefined !== hit.item) objmap.push(hit.item);
        });
        setSearchResponseItems(objmap);
    }, [searchResponse]);

    function resetSearch() {
        setHasValidResponse(false);
        setSearchResponse(undefined);
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

    // auth
    const [authToken, setAuthToken] = useState("");
    useEffect(() => {
        firebase.auth().currentUser?.getIdToken(/* forceRefresh */ true).then(function (idToken) {
            setAuthToken(idToken);
        })
    }, [firebase.auth().currentUser]);

    // adding notices should be done from this component
    async function addNotice(id: string) {
        if (!authToken) {
            addToast(`Cannot add notice: you must be logged in`, {
                appearance: "error",
                autoDismiss: true
            });
            return;
        }
        console.log("Adding notice ID", id);
        addToast(`Adding notice ${id} to the system`, {
            appearance: "info",
            autoDismiss: true
        });
        return axios.put(`/api/notices/${id}`, null,
            {
                headers: {
                    authToken: authToken
                }
            })
            .then(() => {
                return 0;
            });
    }

    function openLink(url: string) {
        window.open(url);
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
                cell: (row: NoticeIndex) => {
                    return (
                        <>
                            <div>{row.title}</div>
                        </>
                    )
                }
            },
            {
                title: 'Value',
                prop: 'awardedValue',
                sortable: true,
                cell: (row: NoticeIndex) => {
                    return (<NumberFormat thousandSeparator
                                          displayType={"text"} prefix={"£"}
                                          value={row.awardedValue ? Math.round(row.awardedValue) : 0}/>)
                }
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
                    return (
                        <>
                            <div className={"d-flex"}>
                                <Button variant={"outline-primary"} size={"sm"}
                                        className={"rounded mr-1"}
                                        onClick={() => {
                                            openLink(`https://www.contractsfinder.service.gov.uk/Notice/${row.id}`)
                                        }}>
                                    <FontAwesome name={"external-link"} fixedWidth/>
                                </Button>
                                <FetchAddButton key={row.id} addNoticeCallback={addNotice} row={row}/>
                            </div>
                        </>
                    );
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

const FetchAddButton = (props: { row: NoticeIndex, addNoticeCallback: (id: string) => Promise<number | undefined> }) => {

    const {addToast} = useToasts();
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
        props.addNoticeCallback(id).then((response) => {
            setResponse((response) ? response : -1);
            setDoingUpdate(false);
            setIcon("check");
        }).catch((err: AxiosError) => {
            addToast(`Error: ${err.message}`, {
                autoDismiss: true,
                appearance: "error"
            });
            setDoingUpdate(false);
            setIcon("frown-o");
        });
    }

    return (

        <Button variant={"outline-success"} size={"sm"} className={"rounded"} disabled={disabled}
                onClick={() => {
                    if (props.row.id) addNotice(props.row.id)
                }}>
            <FontAwesome name={icon} fixedWidth spin={doingUpdate}/>
        </Button>

    )
};