import {Alert, Button, Modal} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import AppContext from "../../core/AppContext";
import {useToasts} from "react-toast-notifications";
import axios from "axios";
import {LoadingWrapper} from "../../LoadingWrapper";
import {MemberInterestDTO, MemberInterestsDTO} from "../../../interfaces/DTO/MemberInterestsDTO";
import Datatable from 'react-bs-datatable';
import {css} from "@emotion/css";

export const ViewAllInterestsModal = (props: { id: number }) => {

    const {hideModal} = useContext(AppContext);
    const {addToast} = useToasts();
    const [loaded, setLoaded] = useState(false);
    const [memberInterests, setMemberInterests] = useState<MemberInterestsDTO>();

    useEffect(() => {
        axios.get<MemberInterestsDTO>(`/api/interests/${props.id}`)
            .then(response => {
                setMemberInterests(response.data);
            })
            .catch(error => {
                addToast(error.toString(), {
                    appearance: "error",
                    autoDismiss: true
                })
            })
            .then(() => {
                setLoaded(true);
            })
    }, []);

    return (
        <>
            <Modal backdrop={"static"} show centered size={"xl"}>
                <Modal.Header closeButton onClick={() => hideModal()}>
                    <Modal.Title>All interests associated with user {props.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    {Boolean(!loaded) && (
                        <LoadingWrapper/>
                    )}

                    {Boolean(loaded && undefined !== memberInterests) && (
                        <>
                            <Alert variant={"secondary"}>
                                <h5 className={"mb-0"}>Interests for {memberInterests?.personName}</h5>
                            </Alert>
                            <RenderInterests data={memberInterests?.interests}/>
                        </>
                    )}

                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="outline-secondary"
                        onClick={() => hideModal()}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
};

const RenderInterests = (props: { data?: MemberInterestDTO[] }) => {

    function getHeader() {
        return [
            {
                title: 'Date',
                prop: 'registeredDate',
                sortable: true,
            },
            {
                title: 'Category',
                prop: 'description',
                sortable: true,
            },
            {
                title: 'Description',
                prop: 'text',
                filterable: true,
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
        tbodyCol: css`
          &:nth-of-type(1) {
            white-space: nowrap
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
                       initialSort={{prop: 'created', isAscending: false}}
                       classes={tableClasses}
                       rowsPerPage={5}
                       rowsPerPageOption={[5, 10]}
            />
        </>
    )
};