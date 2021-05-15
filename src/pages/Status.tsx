import React, {useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {ApplicationStatsDTO} from "../generated/FosTypes";
import {PageTitle} from "../components/PageTitle";
import {Card, CardGroup, Container} from "react-bootstrap";

export const Status = () => {

    const [stats, setStats] = useState<ApplicationStatsDTO>();

    useEffect(() => {
        axios.get<string, AxiosResponse<ApplicationStatsDTO>>("/api/stats")
            .then((res) => {
                setStats(res.data);
            })
    }, []);

    return (
        <>
            <Container fluid className={"p-3"}>
                <PageTitle title={"System stats"}/>
                <CardGroup>
                    <CardStats text={"Awards"} number={stats?.awards}/>
                    <CardStats text={"Declared interests"} number={stats?.interests}/>
                    <CardStats text={"Pages scanned"} number={stats?.ocrPages}/>
                    <CardStats text={"Persons known"} number={stats?.persons}/>
                </CardGroup>
            </Container>
        </>
    )
};


const CardStats = (props: {
    text: string,
    number?: number
}) => {
    return (
        <Card style={{width: '10rem'}} className={"rounded shadow m-3"}>
            <Card.Body>
                <Card.Title>{props.text}</Card.Title>
                <Card.Text>
                    <div className={"d-flex justify-content-end"}>
                        <h4 className={"lead-3 text-muted"}>{props.number}</h4>
                    </div>
                </Card.Text>
            </Card.Body>
        </Card>
    )
}