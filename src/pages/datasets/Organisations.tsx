import {Alert, Container} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {LoadingWrapper} from "../../components/LoadingWrapper";
import {AlertWrapper} from "../../components/AlertWrapper";
import axios from "axios";
import {PageTitle} from "../../components/PageTitle";
import Datatable from 'react-bs-datatable';
import {css} from "@emotion/css";
import {NodeTypeEnum, OrganisationsGraphListResponseDTO} from "../../generated/FosTypes";
import PaneContext from "../../components/core/PaneContext";
import {Graph} from "../Graph";

export const Organisations = () => {

    let url = "/api/datasets/organisations";
    const [awards, setClientsList] = useState<OrganisationsGraphListResponseDTO[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const {setPaneTitle, setPaneSubtitle, setPaneContents, openPane} = useContext(PaneContext);

    function getHeader() {
        return [
            {
                title: 'Organisation',
                prop: 'name',
                sortable: true,
                filterable: true,
                cell: (row: OrganisationsGraphListResponseDTO) => {
                    return (
                        <>
                            {row.organisation?.name}
                        </>
                    )
                }
            },
            {
                title: 'Total awards',
                prop: 'awards',
                sortable: true,
                cell: (row: OrganisationsGraphListResponseDTO) => {
                    return (
                        <>
                            {row.awards?.length}
                        </>
                    )
                }
            },
        ];
    }

    const onSort = {
        awards: (value: string[]) => {
            return value.length;
        }
    };

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
        axios.get<OrganisationsGraphListResponseDTO[]>(url).then(response => {
            setClientsList(response.data)
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

                <PageTitle title={"Contract awardees"}/>

                <Alert variant={"info"}>Note that metrics refer to total awards loaded onto this system</Alert>

                <Datatable tableHeaders={getHeader()} tableBody={awards}
                           initialSort={{prop: 'created', isAscending: false}} classes={tableClasses} rowsPerPage={10}
                           onSort={onSort} onRowClick={(row: OrganisationsGraphListResponseDTO) => {
                    console.debug("returning details for entity", row);
                    setPaneTitle(`Details for company ${row.organisation?.name}`);
                    setPaneSubtitle(`Showing all relationships for entity ${row.organisation?.fosId}`);
                    setPaneContents(<Graph object_type={NodeTypeEnum.organisation}
                                           object_id={row.organisation?.fosId}/>);
                    openPane();
                }} rowsPerPageOption={[5, 10, 25, 50]}/>

            </Container>
        </>
    )
};