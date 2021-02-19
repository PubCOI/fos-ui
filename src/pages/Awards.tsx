import {Alert, Table} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {LoadingWrapper} from "../components/LoadingWrapper";
import {AlertWrapper} from "../components/AlertWrapper";
import axios from "axios";
import NumberFormat from 'react-number-format';
import FontAwesome from "react-fontawesome";

interface Award {
    id: string,
    noticeID: string,
    organisation: string,
    supplierName: string,
    value: number,
    valueMin: number,
    valueMax: number,
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
            <h2>Contracts Finder Awards Data</h2>
            <Alert variant={"info"}>Awards that have been granted will appear on this page</Alert>

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
                        <td align={"right"}><ContractValueFormat award={award}/></td>
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
    if (0 === props.award.valueMin) {
        return (<>[Up to <NumberFormat thousandSeparator
                                       displayType={"text"} prefix={"£"}
                                       value={props.award.valueMax}/>]</>)
    }
    if (0 === props.award.valueMax) {
        return (<>[At least <NumberFormat thousandSeparator
                                          displayType={"text"} prefix={"£"}
                                          value={props.award.valueMin}/>]</>)
    }
    if (props.award.valueMin === props.award.valueMax) {
        return (<><NumberFormat thousandSeparator displayType={"text"} prefix={"£"} value={props.award.valueMax}/></>)
    }
    else {
        return (
            <>
                ({<NumberFormat thousandSeparator
                                  displayType={"text"} prefix={"£"}
                                  value={props.award.valueMin}/>}-{<NumberFormat
                thousandSeparator displayType={"text"} prefix={""}
                value={props.award.valueMax}/>})
            </>
        )
    }
};