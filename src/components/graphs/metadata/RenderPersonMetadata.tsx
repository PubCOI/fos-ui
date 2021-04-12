import {useToasts} from "react-toast-notifications";
import React, {useContext, useEffect, useState} from "react";
import {PersonDAO} from "../../../interfaces/DAO/PersonDAO";
import axios from "axios";
import {Alert, Button, Col, Row} from "react-bootstrap";
import {LoadingWrapper} from "../../LoadingWrapper";
import FontAwesome from "react-fontawesome";
import AppContext from "../../core/AppContext";
import {MergeRecordsModal} from "../modals/MergeRecordsModal";

export const RenderPersonMetadata = (props: { id: string }) => {
    const {addToast} = useToasts();
    const {setModalBody} = useContext(AppContext);
    const [loaded, setLoaded] = useState(false);
    const [person, setPerson] = useState<PersonDAO>({
        id: "",
        ocId: "",
        commonName: "",
        occupation: "",
        nationality: "",
        positions: [{
            companyId: "",
            companyName: "",
            position: ""
        }]
    });

    // to be honest, we could just pull this from the metadata client-side but
    // it's probably less brittle to just use the same pattern as elsewhere ...
    useEffect(() => {
        axios.get<PersonDAO>(`/api/graphs/persons/${props.id}/metadata`)
            .then((response) => {
                setLoaded(true);
                setPerson(response.data)
            })
            .catch((err) => {
                addToast(`Unable to load data for person ID ${props.id}`, {
                    appearance: "error",
                    autoDismiss: true,
                })
            })
    }, [props.id]);

    function mergeRecordsModal(id: string) {
        setModalBody(<MergeRecordsModal id={id}/>);
    }

    if (!loaded) {
        return <LoadingWrapper/>
    }

    return (
        <>
            <Row>
                <Col sm={3}>Name</Col>
                <Col>
                    {person.commonName}
                </Col>
            </Row>

            {Boolean(person.occupation) && (
                <Row>
                    <Col sm={3}>Occupation</Col>
                    <Col>
                        {person.occupation}
                    </Col>
                </Row>
            )}

            {Boolean(person.nationality) && (
                <Row>
                    <Col sm={3}>Nationality</Col>
                    <Col>
                        {person.nationality}
                    </Col>
                </Row>
            )}

            {Boolean(person.positions.length > 0) && (
                <Row>
                    <Col className={"mb-3"}>
                        <h6 className={"mt-3"}>Positions</h6>
                        {person.positions.map(item => (
                            <div key={`position_info_${item.companyId}`}>
                                <div className={"d-flex justify-content-between align-items-center"}>
                                    <div>{item.companyName}: {item.position}</div>
                                </div>
                            </div>
                        ))}
                    </Col>
                </Row>
            )}

            {Boolean(person.ocId) && (
                <Row>
                    <Col>
                        <Alert variant={"primary"} className={"mt-2 mb-0"}>
                            <div>Data for this object kindly provided by OpenCorporates under
                                their <a href={"https://opendatacommons.org/licenses/odbl/1-0/"}>ODbL license</a>
                            </div>
                            <Button
                                href={`https://opencorporates.com/officers/${person.ocId}`}
                                target={"_blank"}
                                variant={"primary"} block size={"sm"} className={"mt-2"}>
                                View on OpenCorporates <FontAwesome name={"external-link"}/>
                            </Button>
                        </Alert>
                    </Col>
                </Row>
            )}

            <hr/>

            <div>
                <Button
                    onClick={() => mergeRecordsModal(props.id)}
                    variant={"outline-secondary"} size={"sm"} block>
                    <FontAwesome name={"compress"}/> Merge records
                </Button>
            </div>
        </>
    )
};