import React, {useContext, useEffect, useState} from 'react';
import {Modal} from "react-bootstrap";
import axios from "axios";
import {AwardDTO} from "../../interfaces/DTO/AwardDTO";
import {AwardDetailsModalBody} from "./AwardDetailsModalBody";
import {DataTypeEnum, FixDataIssueWidget} from "./FixDataIssueWidget";
import AppContext from "../core/AppContext";
import {LoadingGrow} from "../LoadingGrow";

export const AwardDetailsModal = (props: { id: string }) => {

    const {hideModal, showRightPane} = useContext(AppContext);
    const [loaded, setLoaded] = useState(false);
    const [award, setAward] = useState<AwardDTO>();

    useEffect(() => {
        axios.get<AwardDTO>(`/api/graphs/awards/${props.id}/metadata`)
            .then(response => {
                setAward(response.data);
                setLoaded(true);
            })
            .catch(error => {
                console.log(error);
            })
    }, [props]);

    let body = (loaded) ? <AwardDetailsModalBody award={award}/> : <LoadingGrow/>;

    return (
        <>
            <Modal backdrop={"static"} show centered size={"xl"} enforceFocus={!showRightPane}>
                <Modal.Header closeButton onClick={() => hideModal()}>
                    <Modal.Title>Award Details</Modal.Title>
                </Modal.Header>
                {body}
                <FixDataIssueWidget type={DataTypeEnum.award} id={props.id}/>
            </Modal>
        </>
    )
};
