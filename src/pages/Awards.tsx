import {Alert} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {LoadingWrapper} from "../components/LoadingWrapper";
import {AlertWrapper} from "../components/AlertWrapper";
import axios from "axios";
import FontAwesome from "react-fontawesome";
import {PageTitle} from "../components/PageTitle";
import {AwardDAO} from "../interfaces/AwardDAO";
import Datatable from 'react-bs-datatable';
import {ContractValueFormat} from "../components/ContractValueFormat";
import {css} from "@emotion/css";
import {AwardDetailsModal} from "../components/graphs/AwardDetailsModal";
import PaneContext from "../components/core/PaneContext";
import AppContext from "../components/core/AppContext";

export const Awards = () => {

    let url = "/api/ui/awards";
    const [awards, setAwardsList] = useState<AwardDAO[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const appContext = useContext(AppContext);
    const {showRightPane, setModalBody} = useContext(AppContext);
    const paneContext = useContext(PaneContext);

    function getHeader() {
        return [
            {
                title: 'Organisation',
                prop: 'organisation',
                sortable: true,
                filterable: true,
            },
            {
                title: 'Supplier',
                prop: 'supplierName',
                sortable: true,
                filterable: true,
            },
            {
                title: '',
                prop: '',
                cell: (row: AwardDAO) => <FontAwesome name={"users"} className={"ml-2"} hidden={!row.group_award}/>
            },
            {
                title: 'Value',
                prop: 'value',
                sortable: true,
                cell: (row: AwardDAO) => <ContractValueFormat award={row}/>
            }
        ];
    }

    function openModal(id: string) {
        setModalBody(<AwardDetailsModal id={id}/>)
    }

    const tableClasses = {
        table: `table-striped table-hover mt-3`,
        paginationOptsFormText: css`
        &:first-of-type {
          margin-right: 8px;
        }
        &:last-of-type {
          margin-left: 8px;
        }`
    };

    useEffect(() => {
        axios.get<AwardDAO[]>(url).then(response => {
            setAwardsList(response.data)
        })
            .then(() => setLoaded(true))
            .catch(() => setError(true));
    }, []);

    if (error) {
        return <AlertWrapper text={"Unable to load awards data"}/>
    }

    if (!loaded) {
        return <LoadingWrapper/>
    }

    return (
        <>
            <PageTitle title={"Contracts Finder: raw data"}/>

            <Alert variant={"info"} className={"text-muted"}>
                These records have been pulled from the HMG Contracts Finder; note that these names are not 'corrected'
                as on the graph(s)
            </Alert>

            <Datatable tableHeaders={getHeader()}
                       tableBody={awards}
                       initialSort={{prop: 'created', isAscending: false}}
                // onSort={onSort}
                       classes={tableClasses}
                       rowsPerPage={10}
                       rowsPerPageOption={[5, 10, 25, 50]}
                       onRowClick={(o) => openModal(o.id)}
            />

            {/*<Table striped bordered hover>*/}
            {/*
            {/*    <tbody>*/}
            {/*    {awards.map(award => (*/}
            {/*        <tr key={award.id}>*/}
            {/*            <td>{award.organisation}</td>*/}
            {/*            <td>{award.supplierName}</td>*/}
            {/*            /!*<Badge variant={"secondary"} className={`${award.group_award ? "" : "d-none"}`}>G</Badge>*!/*/}
            {/*            <td align={"right"} className={"text-nowrap"}><ContractValueFormat award={award}/>*/}
            {/*                <FontAwesome name={"users"} className={"ml-2"} hidden={!award.group_award} />*/}
            {/*            </td>*/}
            {/*        </tr>*/}
            {/*    ))}*/}
            {/*    </tbody>*/}
            {/*</Table>*/}
        </>
    )
};