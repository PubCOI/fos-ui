import {Alert, Container, OverlayTrigger} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {LoadingWrapper} from "../components/LoadingWrapper";
import {AlertWrapper} from "../components/AlertWrapper";
import axios from "axios";
import FontAwesome from "react-fontawesome";
import {PageTitle} from "../components/PageTitle";
import {AwardDTO} from "../interfaces/DTO/AwardDTO";
import Datatable from 'react-bs-datatable';
import {ContractValueFormat} from "../components/ContractValueFormat";
import {css} from "@emotion/css";
import {AwardDetailsModal} from "../components/graphs/AwardDetailsModal";
import AppContext from "../components/core/AppContext";
import {renderTooltip} from "../hooks/Utils";

export const Awards = () => {

    let url = "/api/awards";
    const [awards, setAwardsList] = useState<AwardDTO[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const {setModalBody} = useContext(AppContext);

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
                cell: (row: AwardDTO) => {
                    return <OverlayTrigger
                        placement="auto"
                        delay={{show: 100, hide: 250}}
                        overlay={renderTooltip(
                            {text: "Group award (ie multiple suppliers): only total contract value shown"}
                        )}><FontAwesome name={"users"} className={"ml-2"} hidden={!row.group_award}/></OverlayTrigger>
                }
            },
            {
                title: 'Value',
                prop: 'value',
                sortable: true,
                cell: (row: AwardDTO) => <ContractValueFormat award={row}/>
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
        axios.get<AwardDTO[]>(url).then(response => {
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
            <Container fluid className={"p-3"}>

                <PageTitle title={"Contracts Finder: raw data"}/>

                <Alert variant={"info"} className={"text-muted"}>
                    These records have been pulled from the HMG Contracts Finder; note that these names are not
                    'corrected'
                    as on the graph(s)
                </Alert>

                <Datatable tableHeaders={getHeader()}
                           tableBody={awards}
                           initialSort={{prop: 'created', isAscending: false}}
                           classes={tableClasses}
                           rowsPerPage={10}
                           rowsPerPageOption={[5, 10, 25, 50]}
                           onRowClick={(o) => openModal(o.id)}
                />

            </Container>
        </>
    )
};