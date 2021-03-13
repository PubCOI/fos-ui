import {Alert, Table} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {LoadingWrapper} from "../components/LoadingWrapper";
import {AlertWrapper} from "../components/AlertWrapper";
import axios from "axios";
import NumberFormat from 'react-number-format';
import FontAwesome from "react-fontawesome";
import {PageTitle} from "../components/PageTitle";
import {MinMaxValueFormat} from "../components/MinMaxValueFormat";

interface Award {
    id: string,
    noticeID: string,
    organisation: string,
    supplierName: string,
    value: number,
    valueMin: number,
    valueMax: number,
    group_award: boolean,
}

export const Awards = () => {

    let url = "/api/ui/awards";
    const [awards, setAwardsList] = useState<Award[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        axios.get<Award[]>(url).then(response => {
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
            <PageTitle title={"Contracts Finder: Raw Data"}/>

            <Alert variant={"info"}>
                These records have been pulled from the HMG Contracts Finder
            </Alert>

            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Org / Dept</th>
                    <th>Company</th>
                    <th>Value</th>
                </tr>
                </thead>
                <tbody>
                {awards.map(award => (
                    <tr key={award.id}>
                        <td>{award.organisation}</td>
                        <td>{award.supplierName}</td>
                        {/*<Badge variant={"secondary"} className={`${award.group_award ? "" : "d-none"}`}>G</Badge>*/}
                        <td align={"right"} className={"text-nowrap"}><ContractValueFormat award={award}/>
                            <FontAwesome name={"users"} className={"ml-2"} hidden={!award.group_award} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    )
};

const ContractValueFormat = (props: { award: Award }) => {
    if (0 === props.award.value && 0 === props.award.valueMin && 0 === props.award.valueMax) {
        return (<>[No data] <FontAwesome name={"warning"}/></>)
    }
    if (0 !== props.award.value) {
        return (
            <NumberFormat thousandSeparator displayType={"text"} prefix={"£"} value={props.award.value}/>
        )
    }
    return <MinMaxValueFormat min={props.award.valueMin} max={props.award.valueMax}/>
};