import {Alert, Container} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {LoadingWrapper} from "../../components/LoadingWrapper";
import {AlertWrapper} from "../../components/AlertWrapper";
import axios from "axios";
import {PageTitle} from "../../components/PageTitle";
import Datatable from 'react-bs-datatable';
import {css} from "@emotion/css";
import {PotentialConflictDTO} from "../../generated/FosTypes";
import AppContext from "../../components/core/AppContext";
import {ResolvePotentialCOIModal} from "../../components/tasks/ResolvePotentialCOIModal";

export const Conflicts = () => {

    let url = "/api/datasets/conflicts";
    const [conflicts, setConflictsList] = useState<PotentialConflictDTO[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const {setModalBody} = useContext(AppContext);

    function getHeader() {
        return [
            {
                title: 'Subject',
                prop: 'sourceName',
                sortable: true,
                filterable: true,
            },
            {
                title: 'Relationship',
                prop: 'targetName',
                sortable: true,
                filterable: true,
            },
            {
                title: 'Resolved by',
                prop: 'resolvedBy',
            }
        ];
    }

    const tableClasses = {
        table: `table-striped table-hover mt-3`,
        tbodyRow: css`
            cursor: pointer
        `,
        paginationOptsFormText: css`
        &:first-of-type {
            margin-right: 8px;
        }
        &:last-of-type {
            margin-left: 8px;
        }`,
    };

    useEffect(() => {
        axios.get<PotentialConflictDTO[]>(url).then(response => {
            setConflictsList(response.data)
        })
            .then(() => setLoaded(true))
            .catch(() => setError(true));
    }, []);

    if (error) {
        return <AlertWrapper text={"Unable to load organisations data"}/>
    }

    if (!loaded) {
        return <LoadingWrapper/>
    }

    return (
        <>
            <Container fluid className={"p-3"}>

                <PageTitle title={"Conflicts of interest"}/>

                <Datatable tableHeaders={getHeader()} tableBody={conflicts}
                           initialSort={{prop: 'sourceName', isAscending: false}} classes={tableClasses}
                           rowsPerPage={10}
                           onRowClick={(row: PotentialConflictDTO) => {
                               if (row.id) {
                                   setModalBody(<ResolvePotentialCOIModal taskId={row.id}/>)
                               }
                           }}
                           rowsPerPageOption={[5, 10, 25, 50]}/>

            </Container>
        </>
    )
};