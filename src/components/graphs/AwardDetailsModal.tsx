import React, {Context, useEffect, useState} from 'react';
import {Modal} from "react-bootstrap";
import {hide} from "react-functional-modal";
import axios from "axios";
import {AwardDAO} from "../../interfaces/AwardDAO";
import {AwardDetailsModalBody} from "./AwardDetailsModalBody";
import {DataTypeEnum, FixDataIssueWidget} from "./FixDataIssueWidget";

export const AwardDetailsModal = (props: { id: string}) => {

    const [loaded, setLoaded] = useState(false);
    const [award, setAward] = useState<AwardDAO>();

    useEffect(() => {
        axios.get<AwardDAO>(`/api/ui/awards/${props.id}`)
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
            <Modal backdrop={"static"} show centered size={"xl"}>
                <Modal.Header closeButton onClick={() => hide(props.id)}>
                    <Modal.Title>Award Details</Modal.Title>
                </Modal.Header>
                {body}
                <FixDataIssueWidget type={DataTypeEnum.award} id={props.id}/>
            </Modal>
        </>
    )
};



const LoadingGrow = () => {
        return (
            <div className="spinner-grow text-dark m-3" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        )
    }
;
