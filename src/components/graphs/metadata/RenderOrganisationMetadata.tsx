import {useToasts} from "react-toast-notifications";
import {Alert, Button, Col, Row} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {OrganisationMetadataDAO} from "../../../interfaces/DAO/OrganisationMetadataDAO";
import axios from "axios";
import {LoadingWrapper} from "../../LoadingWrapper";
import FontAwesome from "react-fontawesome";
import AppContext from "../../core/AppContext";
import {VerifyCompanyModal} from "../modals/VerifyCompanyModal";

export const RenderOrganisationMetadata = (props: {id: string}) => {
    const {addToast} = useToasts();
    const {setModalBody, hideModal} = useContext(AppContext);
    const [loaded, setLoaded] = useState(false);
    const [org, setOrg] = useState<OrganisationMetadataDAO>({
        id: "",
        name: "",
        verified: false
    });
    const [companyNumber, setCompanyNumber] = useState("");
    const [jurisdiction, setJurisdiction] = useState("");

    useEffect(() => {
        if (undefined === org || "" === org.id) return;
        setJurisdiction(org.id.split(":")[0]);
        setCompanyNumber(org.id.split(":")[1]);
    }, [org]);

    useEffect(() =>{
        axios.get<OrganisationMetadataDAO>(`/api/graphs/organisations/${props.id}/metadata`)
            .then(res => {
                setLoaded(true);
                setOrg(res.data);
            })
            .catch(() => {
                addToast(`Unable to load data for org ${props.id}`, {
                    appearance: "error",
                    autoDismiss: true
                })
            })
    }, [props.id]);

    function verifyCompany(id: string) {
        setModalBody(<VerifyCompanyModal id={id}/>)
    }

    if (!loaded) {
        return <LoadingWrapper/>
    }

    return (
        <>
            {Boolean(!org.verified) && (
                <Alert variant={"dark"}>
                    <div className={"d-flex justify-content-between align-items-center"}>
                        <span>Not verified</span>
                        <Button
                            onClick={() => verifyCompany(org.id)}
                            variant={"outline-secondary"} size={"sm"} className={"ml-3"}>Click to verify</Button>
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
        </>
    )
};