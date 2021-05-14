import React, {useContext, useEffect, useState} from "react";
import AppContext from "../../core/AppContext";
import {useToasts} from "react-toast-notifications";
import {Alert, Button, Col, ListGroup, Modal, OverlayTrigger, Row} from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import axios, {AxiosResponse} from "axios";
import {VerifyCompanySearchResponse} from "../../../interfaces/DTO/VerifyCompanySearchResponse";
import firebase from "firebase";
import {LoadingWrapper} from "../../LoadingWrapper";
import {FosTasksEnum} from "../../../interfaces/FosTasksEnum";
import {DataTypeEnum} from "../FixDataIssueWidget";
import {FixDataPaneContents} from "../FixDataPaneContents";
import PaneContext from "../../core/PaneContext";
import {renderTooltip} from "../../../hooks/Utils";
import {NodeTypeEnum, OrganisationDTO} from "../../../generated/FosTypes";

interface VerifyCompanyResponse {
    response: string
}

export const VerifyCompanyModal = (props: { id: string }) => {
    const {hideModal} = useContext(AppContext);
    const {addToast} = useToasts();

    const [loadedToken, setLoadedToken] = useState(false);
    const [authToken, setAuthToken] = useState("");
    useEffect(() => {
        firebase.auth().currentUser?.getIdToken(/* forceRefresh */ true).then(function (idToken) {
            setAuthToken(idToken);
        }).then(() => {
            setLoadedToken(true);
        });
    }, [firebase.auth().currentUser]);

    const [assocNotices, setAssocNotices] = useState<string[]>([""]);
    useEffect(() => {
        axios.get<string, AxiosResponse<string[]>>(`/api/graphs/organisations/${props.id}/notices`, {
            params: {
                count: 1
            }
        })
            .then((res) => {
                if (res.data.length > 0) {
                    setAssocNotices(res.data)
                } else {
                    addToast("Unable to find any notices on item " + props.id, {
                        autoDismiss: true,
                        appearance: "error"
                    })
                }
            })
            .catch(e => {
                addToast("Unable to load sample notice", {
                    autoDismiss: true,
                    appearance: "error"
                })
            })
    }, []);

    const [doSearchIcon, setDoSearchIcon] = useState("search");
    const [spinSearchIcon, setSpinSearchIcon] = useState(false);
    const [searchComplete, setSearchComplete] = useState(false);
    const [searchResponse, setSearchResponse] = useState<VerifyCompanySearchResponse[]>([{
        id: "",
        address: "",
        name: "",
        chUrl: "",
        ocUrl: "",
        flagged: false
    }]);

    const [recordMeta, setRecordMeta] = useState<OrganisationDTO>({
        fosId: "",
        name: "",
        verified: false
    });
    useEffect(() => {
        axios.get<string, AxiosResponse<OrganisationDTO>>(`/api/graphs/organisations/${props.id}/metadata`)
            .then((res) => {
                setRecordMeta(res.data);
            })
    }, []);

    function manualDetails(id: string) {
        hideModal();
        addToast("Not implemented yet", {
            autoDismiss: true,
            appearance: "info"
        })
    }

    function mergeRecord(targetId: string) {
        axios.put<VerifyCompanyResponse>(`/api/ui/tasks/${FosTasksEnum.verify_company}`, {
            source: props.id,
            target: targetId
        }, {
            headers: {
                authToken: authToken
            }
        }).then(value => {
            addToast(value.data.response, {
                appearance: "success",
                autoDismiss: true
            });
            hideModal();
        })
            .catch(reason => {
                addToast(reason.toString(), {
                    appearance: "error",
                    autoDismiss: true
                })
            })
    }

    function doSearch() {
        setSearchComplete(false);
        setDoSearchIcon("spinner");
        setSpinSearchIcon(true);
        axios.post<string, AxiosResponse<VerifyCompanySearchResponse[]>>(`/api/ui/tasks/verify_company/_search`, {
            companyId: props.id
        }, {
            headers: {
                authToken: authToken
            }
        })
            .then((res) => {
                console.debug(res);
                setSearchResponse(res.data);
                setSearchComplete(true);
            })
            .then(() => {
                setDoSearchIcon("search");
                setSpinSearchIcon(false);
            })
    }

    function setFlag(flagStatus: boolean, itemId: string) {
        if (flagStatus) {
            axios.put(`/api/ui/flags/${NodeTypeEnum.organisation}/${itemId}`, null, {
                headers: {
                    authToken: authToken
                }
            })
                .then(() => {
                    addToast("Flagged item ID " + itemId, {
                        appearance: "success",
                        autoDismiss: true
                    });
                })
                .catch(() => {
                    addToast("Error flagging item, please try again later", {
                        autoDismiss: true,
                        appearance: "error"
                    })
                })
        } else {
            axios.delete(`/api/ui/flags/${NodeTypeEnum.organisation}/${itemId}`, {
                headers: {
                    authToken: authToken
                }
            })
                .then(() => {
                    addToast("Removed flag for " + itemId, {
                        autoDismiss: true,
                        appearance: "info"
                    })
                })
        }
    }

    const {setPaneTitle, setPaneSubtitle, setPaneContents, openPane} = useContext(PaneContext);
    const {showRightPane} = useContext(AppContext);

    function showPane() {
        setPaneTitle("Report data issue");
        setPaneSubtitle(`Reporting issue with ${DataTypeEnum.company} ${props.id}`);
        setPaneContents(<FixDataPaneContents type={DataTypeEnum.company} id={props.id}/>);
        openPane();
    }

    if (!loadedToken) {
        return <LoadingWrapper/>
    }

    return (
        <>
            <Modal backdrop={"static"} show centered size={"xl"} enforceFocus={!showRightPane}>
                <Modal.Header closeButton onClick={() => hideModal()}>
                    <Modal.Title>Verify company</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Alert variant={"primary"}>
                        Some data was missing in this notice and so this record could not be matched with a record
                        in Companies House. Please search below and merge the most appropriate record.
                    </Alert>
                    <p>The records we are trying to match are for the following company</p>
                    <Alert variant={"secondary"}>
                        <div className={"small text-monospace"}>{recordMeta.fosId}</div>
                        <div className={"small text-monospace"}>{recordMeta.name}</div>
                    </Alert>

                    <Button
                        variant={"outline-secondary"}
                        className={"mr-2"}
                        size={"sm"}
                        block
                        target={"_blank"}
                        href={`https://www.contractsfinder.service.gov.uk/Notice/${assocNotices[0]}`}><FontAwesome
                        name={"external-link"}/> Show associated notice</Button>

                    <div className={"light text-muted small mt-1 mb-3"}>
                        It is recommended that you read the notice to double-check that the company returned in the
                        search
                        is exactly the same one as on the linked example notice
                    </div>

                    {Boolean(!authToken) && (
                        <Alert variant={"warning"}>
                            <strong>Not logged in</strong>
                            <div>You can't perform merges unless you're logged in</div>
                        </Alert>
                    )}

                    <h5>Search OpenCorporates database</h5>
                    <Button
                        variant={"outline-primary"} block size={"sm"} onClick={() => doSearch()}><FontAwesome
                        name={doSearchIcon} spin={spinSearchIcon}/> Click here to perform search</Button>

                    {Boolean(searchComplete && searchResponse.length === 0) && (
                        <Alert variant={"secondary"} className={"mt-3"}>
                            <div>No results found :(</div>
                        </Alert>
                    )}

                    {Boolean(searchComplete && searchResponse.length > 0) && (
                        <ListGroup className={"mt-3"}>
                            {searchResponse.map(item => (
                                <OCSearchResponseItem
                                    key={`oc_response_${item.id}`}
                                    item={item}
                                    mergeRecordCallback={mergeRecord}
                                    setFlagCallback={setFlag}
                                />
                            ))}
                        </ListGroup>
                    )}

                    {Boolean(searchComplete) && (
                        <Alert variant={"primary"} className={"mt-3"}>
                            <h5 className={"text-muted"}>Unable to find a matching entry?</h5>
                            <div>
                                In some cases, such as when the wrong company name is used on a contract, the company
                                cannot
                                be resolved to a valid record. You have a couple of options:
                            </div>
                            <Row className={"my-2 d-flex align-items-center"}>
                                <Col sm={4}>
                                    <Button block variant={"primary"} className={"mr-3"} onClick={() => showPane()}>Report
                                        issue</Button>
                                </Col>
                                <Col>
                                    if you want to flag this record as needing another pair of eyes
                                </Col>
                            </Row>
                            <Row className={"mb-2 d-flex align-items-center"}>
                                <Col sm={4}>
                                    <Button block variant={"outline-primary"} className={"mr-3"}
                                            onClick={() => manualDetails(props.id)}>Enter details manually</Button>
                                </Col>
                                <Col>
                                    if you have found the company number elsewhere
                                </Col>
                            </Row>
                        </Alert>
                    )}

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => hideModal()}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
};

const OCSearchResponseItem = (props: {
    item: VerifyCompanySearchResponse,
    mergeRecordCallback: (id: string) => void,
    setFlagCallback: (flag: boolean, id: string) => void
}) => {

    const {addToast} = useToasts();
    const [flagged, setFlagged] = useState(props.item.flagged);

    const [alreadyClicked, setClickedOnce] = useState(false);

    function doMerge() {
        if (alreadyClicked) {
            props.mergeRecordCallback(props.item.id)
        } else {
            setClickedOnce(true);
        }
    }

    function toggleFlag() {
        props.setFlagCallback(!flagged, props.item.id);
        setFlagged(!flagged);
    }

    return (
        <ListGroup.Item key={`${props.item.id}_key`}>
            <div className={"d-flex justify-content-between"}>
                <h6>{props.item.name}</h6>
                <div>
                    <OverlayTrigger
                        placement="auto"
                        delay={{show: 100, hide: 150}}
                        overlay={renderTooltip({text: "Flag this record so that you can come back to it later"})}><FontAwesome
                        onClick={() => toggleFlag()}
                        role={"button"} name={"flag"}
                        className={(flagged) ? "text-danger" : "text-grey"}
                    /></OverlayTrigger>
                </div>
            </div>
            <div className={"small text-muted"}>
                {props.item.address}
            </div>
            <div className={"d-flex justify-content-between mt-2 align-items-baseline"}>
                <div>
                    {Boolean(props.item.chUrl) && (
                        <Button
                            variant={"outline-primary"}
                            className={"mr-2"}
                            size={"sm"}
                            target={"_blank"}
                            href={props.item.chUrl}><FontAwesome name={"external-link"}/> CH</Button>
                    )}
                    {Boolean(props.item.ocUrl) && (
                        <Button
                            variant={"outline-primary"}
                            className={"mr-2"}
                            size={"sm"}
                            target={"_blank"}
                            href={props.item.ocUrl}><FontAwesome name={"external-link"}/> OC</Button>
                    )}
                </div>
                <div>
                    <Button
                        variant={"outline-success"}
                        size={"sm"}
                        onClick={() => doMerge()}>{(alreadyClicked) ? <>Sure the records match?<br/>Click again to
                        confirm</> : <><FontAwesome name={"check"}/> Use this record</>}</Button>
                </div>
            </div>
        </ListGroup.Item>
    )
};