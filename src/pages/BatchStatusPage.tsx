import {PageTitle} from "../components/PageTitle";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {LoadingWrapper} from "../components/LoadingWrapper";
import {Accordion, Button, Card, Container, ListGroup} from "react-bootstrap";
import {AlertWrapper} from "../components/AlertWrapper";
import FontAwesome from "react-fontawesome";
import Moment from "react-moment";
import {Link} from "react-router-dom";
import {ContextAwareToggle} from "../components/ContextAwareToggle";

enum BatchStatus {
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}

interface BatchStep {
    id: number,
    stepName: string,
    startTime: string,
    endTime: string,
    status: BatchStatus
}

interface BatchExecution {
    jobId: number,
    attachmentId: string,
    status: BatchStatus,
    startTime: string,
    endTime: string,
    steps: BatchStep[]
}

export const BatchStatusPage = () => {

    let url = "/api/batch/jobs/executions";
    const [executionData, setExecutionData] = useState<BatchExecution[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [startAt, setStartAt] = useState(0);
    const [currentEventKey, setCurrentEventKey] = useState("");

    useEffect(() => {
        axios.get<BatchExecution[]>(url, {
            params: {
                start: startAt
            }
        }).then(response => {
            setExecutionData(executionData.concat(response.data));
            setError(false);
        })
            .then(() => setLoaded(true))
            .catch(() => setError(true));
    }, [startAt]);

    if (!loaded) return <LoadingWrapper/>;
    if (error) return <AlertWrapper text={"Unable to load stats data"}/>;

    return (
        <>
            <Container fluid className={"p-3"}>
                <PageTitle title={"System stats"}/>
                <h3>Recent batch jobs</h3>
                <Accordion>
                    {executionData.map((job) => (
                        <Card key={`_card_${job.jobId}`}>
                            <ContextAwareToggle
                                className={job.status === BatchStatus.FAILED ? "bg-danger" : ""}
                                callback={setCurrentEventKey} eventKey={`${job.jobId}`}>

                                <div className={"d-flex justify-content-between"}>
                                    <div>
                                        <FontAwesome fixedWidth
                                                     name={currentEventKey === `${job.jobId}` ? "caret-down" : "caret-right"}/> Job {job.jobId}
                                    </div>
                                    <div hidden={job.status !== BatchStatus.FAILED}>
                                        <FontAwesome name={job.status === BatchStatus.FAILED ? "warning" : ""}/> Job
                                        failed
                                    </div>
                                    <div hidden={job.status === BatchStatus.FAILED}>
                                        Completed in <Moment from={job.startTime} ago>{job.endTime}</Moment>
                                    </div>
                                </div>
                            </ContextAwareToggle>
                            <Accordion.Collapse eventKey={`${job.jobId}`} key={`_accordion_${job.jobId}`}>
                                <Card.Body>

                                    <Card.Header className={job.status === BatchStatus.COMPLETED ? "" : "d-none"}>
                                        <FontAwesome name={"file-pdf-o"} className={"mr-1"}/> Attachment <Link
                                        to={"/view/cf/" + job.attachmentId + "/page/1"}>{job.attachmentId}</Link>
                                    </Card.Header>

                                    <ListGroup>
                                        {job.steps.map(step => (
                                            <ListGroup.Item
                                                className={"d-flex justify-content-between align-items-center"}
                                                key={step.id}>
                                                <div>
                                                    {step.id}: {step.stepName}
                                                </div>
                                                <div>
                                                    <div hidden={step.status !== BatchStatus.FAILED}>
                                                        Error <FontAwesome
                                                        className={"ml-2"}
                                                        name={step.status === BatchStatus.FAILED ? "warning" : ""}/>
                                                    </div>
                                                    <div hidden={step.status === BatchStatus.FAILED}>
                                                        <Moment duration={step.startTime} date={step.endTime}
                                                                format={"HH:mm:ss"}/>
                                                    </div>
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>

                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    ))}
                </Accordion>
                <Button block variant={"outline-primary"}
                        className={"mb-5"}
                        onClick={() => setStartAt(startAt + 10)}>Load more <FontAwesome name={"caret-down"}/></Button>

            </Container>
        </>
    )
};