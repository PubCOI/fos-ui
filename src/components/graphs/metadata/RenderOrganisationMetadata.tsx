import {useToasts} from "react-toast-notifications";
import {Alert, Button, Col, Row} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {LoadingWrapper} from "../../LoadingWrapper";
import FontAwesome from "react-fontawesome";
import AppContext from "../../core/AppContext";
import {VerifyCompanyModal} from "../modals/VerifyCompanyModal";
import {AddRelationshipModal} from "../modals/AddRelationshipModal";
import {OrganisationDTO} from "../../../generated/FosTypes";
import {INodeMetadata} from "../../../interfaces/INodeMetadata";

export const RenderOrganisationMetadata = (props: {metadata: INodeMetadata}) => {
    const {addToast} = useToasts();
    const {setModalBody} = useContext(AppContext);
    const [doingRequest, setDoingRequest] = useState(false);
    const [org, setOrg] = useState<OrganisationDTO>({
        fosId: "",
        name: "",
        verified: false
    });
    const [companyNumber, setCompanyNumber] = useState<string | undefined>("");
    const [jurisdiction, setJurisdiction] = useState<string | undefined>("");

    useEffect(() => {
        if (undefined === org || "" === org.fosId) return;
        setJurisdiction(org.fosId?.split(":")[0]);
        setCompanyNumber(org.fosId?.split(":")[1]);
    }, [org]);

    useEffect(() =>{
        setDoingRequest(true);
        axios.get<OrganisationDTO>(`/api/graphs/organisations/${props.metadata.fosId}/metadata`)
            .then(res => {
                setDoingRequest(false);
                setOrg(res.data);
            })
            .catch(() => {
                addToast(`Unable to load data for org ${props.metadata.fosId}`, {
                    appearance: "error",
                    autoDismiss: true
                });
                setDoingRequest(false);
            })
    }, [props.metadata.fosId]);

    function verifyCompany(id: string | undefined) {
        if (id) {
            setModalBody(<VerifyCompanyModal id={id}/>)
        }
    }

    function addRelationshipModal(metadata: INodeMetadata) {
        setModalBody(<AddRelationshipModal metadata={metadata}/>);
    }

    if (doingRequest) {
        return <LoadingWrapper/>
    }

    return (
        <>
            {Boolean(!org.verified) && (
                <Alert variant={"dark"}>
                    <div className={"d-flex justify-content-between align-items-center"}>
                        <span>Not verified</span>
                        <Button
                            onClick={() => verifyCompany(org.fosId)}
                            variant={"outline-secondary"} size={"sm"} className={"ml-3"}>verify</Button>
                    </div>
                </Alert>
            )}
            <Row>
                <Col sm={4}>Company name</Col>
                <Col>{org.name}</Col>
            </Row>
            {Boolean(org.verified) && (
                <Row>
                    <Col>
                        <Alert variant={"primary"} className={"mt-2 mb-0"}>
                            <div>Data for this object kindly provided by OpenCorporates under
                                their <a href={"https://opendatacommons.org/licenses/odbl/1-0/"}>ODbL license</a>
                            </div>
                            <Button
                                href={`https://opencorporates.com/companies/${jurisdiction}/${companyNumber}`}
                                target={"_blank"}
                                variant={"primary"} block size={"sm"} className={"mt-2"}>
                                View on OpenCorporates <FontAwesome name={"external-link"}/>
                            </Button>
                        </Alert>
                    </Col>
                </Row>
            )}
            <Row className={"mt-3"}>
                <Col>
                <Button
                    onClick={() => addRelationshipModal(props.metadata)}
                    variant={"outline-secondary"} size={"sm"} block><FontAwesome name={"plus"}/> Add relationship</Button>
                </Col>
            </Row>
        </>
    )
};