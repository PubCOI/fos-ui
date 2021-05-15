import {Alert, Container} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {LoadingWrapper} from "../../components/LoadingWrapper";
import {AlertWrapper} from "../../components/AlertWrapper";
import axios from "axios";
import {PageTitle} from "../../components/PageTitle";
import Datatable from 'react-bs-datatable';
import {css} from "@emotion/css";
import {ClientsGraphListResponseDTO, NodeTypeEnum} from "../../generated/FosTypes";
import {Graph} from "../Graph";
import PaneContext from "../../components/core/PaneContext";

export const Clients = () => {

    let url = "/api/datasets/clients";
    const [clients, setClientsList] = useState<ClientsGraphListResponseDTO[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const {setPaneTitle, setPaneSubtitle, setPaneContents, openPane} = useContext(PaneContext);

    function getHeader() {
        return [
            {
                title: 'Client',
                prop: 'name',
                sortable: true,
                filterable: true,
            },
            {
                title: 'Notices',
                prop: 'notices',
                sortable: true,
                cell: (row: ClientsGraphListResponseDTO) => {
                    return (
                        <>
                            {row.notices?.length}
                        </>
                    )
                }
            },
        ];
    }

    const onSort = {
        notices: (value: string[]) => {
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
        axios.get<ClientsGraphListResponseDTO[]>(url).then(response => {
            setClientsList(response.data)
        })
            .then(() => setLoaded(true))
            .catch(() => setError(true));
    }, []);

    if (error) {
        return <AlertWrapper text={"Unable to load clients data"}/>
    }

    if (!loaded) {
        return <LoadingWrapper/>
    }

    return (
        <>
            <Container fluid className={"p-3"}>

                <PageTitle title={"Commissioning bodies / organisations"}/>

                <Alert variant={"info"}>Note that metrics refer to total awards loaded onto this system</Alert>

                <Datatable tableHeaders={getHeader()} tableBody={clients}
                           initialSort={{prop: 'created', isAscending: false}} classes={tableClasses} rowsPerPage={10}
                           onRowClick={(row: ClientsGraphListResponseDTO) => {
                               console.debug(row);
                               setPaneTitle(`Details for commissioning body ${row.name}`);
                               setPaneSubtitle(`Showing all relationships for entity ${row.fosId}`);
                               setPaneContents(<Graph object_type={NodeTypeEnum.client} object_id={row.fosId}/>);
                               openPane();
                           }} onSort={onSort} rowsPerPageOption={[5, 10, 25, 50]}/>

            </Container>
        </>
    )
};