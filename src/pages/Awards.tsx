import {Container, OverlayTrigger} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {LoadingWrapper} from "../components/LoadingWrapper";
import {AlertWrapper} from "../components/AlertWrapper";
import axios from "axios";
import FontAwesome from "react-fontawesome";
import {PageTitle} from "../components/PageTitle";
import Datatable from 'react-bs-datatable';
import {ContractValueFormat} from "../components/ContractValueFormat";
import {css} from "@emotion/css";
import {AwardDetailsModal} from "../components/graphs/AwardDetailsModal";
import AppContext from "../components/core/AppContext";
import {renderTooltip} from "../hooks/Utils";
import {AwardDTO, AwardsGraphListResponseDTO, NodeTypeEnum} from "../generated/FosTypes";
import {GraphPanelBadge} from "../components/graphs/GraphPanelBadge";

export const Awards = () => {

    let url = "/api/awards";
    const [awards, setAwardsList] = useState<AwardsGraphListResponseDTO[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const {setModalBody} = useContext(AppContext);

    function getHeader() {
        return [
            {
                title: 'Organisation',
                prop: 'client',
                sortable: true,
                filterable: true,
            },
            {
                title: 'Supplier',
                prop: 'awardee',
                sortable: true,
                filterable: true,
                cell: (row: AwardsGraphListResponseDTO) => {
                    return (
                        // if there's an "aka" link, we want to render it below
                        <div className={"d-flex justify-content-start"}>
                            <GraphPanelBadge type={NodeTypeEnum.award} id={row.id}/>
                            <div>
                                {Boolean(row.knownAs) && (
                                    <>
                                        <div>{row.awardee}</div>
                                        <OverlayTrigger
                                            placement="left"
                                            delay={{show: 100, hide: 200}}
                                            overlay={renderTooltip(
                                                {text: `Company is known as ${row.knownAs?.name}`}
                                            )}>
                                            <div
                                                className={"d-flex justify-items-start align-items-center text-muted font-italic"}>
                                                <FontAwesome name={"long-arrow-right"} fixedWidth/>
                                                <div>{row.knownAs?.name}</div>
                                            </div>
                                        </OverlayTrigger>
                                    </>
                                )}
                                {Boolean(!row.knownAs) && (
                                    <>{row.awardee}</>
                                )}
                            </div>
                        </div>
                    )
                }
            },
            {
                title: 'Start',
                prop: 'startDate',
                sortable: true,
            },
            {
                title: 'End',
                prop: 'endDate',
                sortable: true,
            },
            {
                title: '',
                prop: '',
                cell: (row: AwardsGraphListResponseDTO) => {
                    return <OverlayTrigger
                        placement="auto"
                        delay={{show: 100, hide: 250}}
                        overlay={renderTooltip(
                            {text: "Group award (ie multiple suppliers): only total contract value shown"}
                        )}><FontAwesome name={"users"} className={"ml-2"} hidden={!row.groupAward}/></OverlayTrigger>
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
        tbodyCol: css`
            &:nth-of-type(3) {
                white-space: nowrap
            }
            &:nth-of-type(4) {
                white-space: nowrap
            }
        `
    };

    useEffect(() => {
        axios.get<AwardsGraphListResponseDTO[]>(url).then(response => {
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

                <PageTitle title={"Contract Awards"}/>

                <Datatable tableHeaders={getHeader()}
                           tableBody={awards}
                           initialSort={{prop: 'created', isAscending: false}}
                           classes={tableClasses}
                           rowsPerPage={10}
                           rowsPerPageOption={[5, 10, 25, 50]}
                           onRowClick={(o) => {
                               openModal(o.id);
                           }}
                />

            </Container>
        </>
    )
};