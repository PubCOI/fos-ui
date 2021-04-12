import React, {useContext, useEffect, useState} from "react";
import AppContext from "../../core/AppContext";
import {useToasts} from "react-toast-notifications";
import {Alert, Button, ListGroup, Modal} from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import axios, {AxiosResponse} from "axios";
import {VerifyCompanySearchResponse} from "../../../interfaces/DAO/VerifyCompanySearchResponse";
import firebase from "firebase";
import {LoadingWrapper} from "../../LoadingWrapper";
import {NoticeResponseDAO} from "../../../interfaces/NoticeResponseDAO";
import {AwardDAO} from "../../../interfaces/DAO/AwardDAO";

export const VerifyCompanyModal = (props: { id: string}) => {
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
                }
                else {
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
    }]);

    function selectRecord(id: string) {

    }

    function doSearch() {
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

    if (!loadedToken) {
        return <LoadingWrapper/>
    }

    return (
        <>
            <Modal backdrop={"static"} show centered size={"xl"}>
                <Modal.Header closeButton onClick={() => hideModal()}>
                    <Modal.Title>Verify company</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant={"primary"}>
                        We need your help: This entry could not be automatically resolved in Companies House
                        and so, we ask that you search and select the one that you think matches this
                        entry
                    </Alert>

                    <Button
                        variant={"outline-secondary"}
                        className={"mr-2"}
                        size={"sm"}
                        block
                        target={"_blank"}
                        href={`https://www.contractsfinder.service.gov.uk/Notice/${assocNotices[0]}`}><FontAwesome name={"external-link"}/> Show associated notice</Button>

                    <div className={"light text-muted small mt-1 mb-3"}>
                        It is recommended that you read the notice to double-check that the company returned in the search
                        is exactly the same one as on the linked example notice
                    </div>

                    {Boolean(!authToken) && (
                        <Alert variant={"warning"}>
                            <strong>Not logged in</strong>
                            <div>You won't be able to perform searches unless you're logged in</div>
                        </Alert>
                    )}

                    <h5>Search OpenCorporates database</h5>
                    <Button
                        variant={"outline-primary"} block size={"sm"} onClick={() => doSearch()}><FontAwesome
                        name={doSearchIcon} spin={spinSearchIcon}/> Click here to perform search</Button>

                    {Boolean(searchComplete && searchResponse.length === 0) && (
                        <Alert variant={"secondary"} className={"mt-3"}>
                            <p>No results found :(</p>
                            <div>In future, we'll allow you to enter the details by hand but for now the company will
                                remain unverified
                            </div>
                        </Alert>
                    )}

                    {Boolean(searchComplete && searchResponse.length > 0) && (
                        <ListGroup className={"mt-3"}>
                            {searchResponse.map(item => (
                                <ListGroup.Item key={`${item.id}_key`}>
                                    <div>
                                        <h6>{item.name}</h6>
                                    </div>
                                    <div className={"small text-muted"}>
                                        {item.address}
                                    </div>
                                    <div className={"d-flex justify-content-between mt-2"}>
                                        <div>
                                        {Boolean(item.chUrl) && (
                                            <Button
                                                variant={"outline-primary"}
                                                className={"mr-2"}
                                                size={"sm"}
                                                target={"_blank"}
                                                href={item.chUrl}><FontAwesome name={"external-link"}/> CH</Button>
                                        )}
                                        {Boolean(item.ocUrl) && (
                                            <Button
                                                variant={"outline-primary"}
                                                className={"mr-2"}
                                                size={"sm"}
                                                target={"_blank"}
                                                href={item.chUrl}><FontAwesome name={"external-link"}/> OC</Button>
                                        )}
                                        </div>
                                        <div>
                                            <Button
                                                variant={"outline-success"}
                                                size={"sm"}
                                                onClick={() => selectRecord(item.id)}><FontAwesome name={"check"}/> Use this record</Button>
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => hideModal()}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
};