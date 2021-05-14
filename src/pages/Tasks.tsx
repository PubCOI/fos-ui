import React, {useContext, useEffect, useState} from "react";
import {Alert, Container} from "react-bootstrap";
import {FirebaseAuthConsumer} from "@react-firebase/auth";
import FontAwesome from "react-fontawesome";
import axios from "axios";
import {AlertWrapper} from "../components/AlertWrapper";
import {LoadingWrapper} from "../components/LoadingWrapper";
import {ResolveClientModal} from "../components/tasks/ResolveClientModal";
import {PageTitle} from "../components/PageTitle";
import Datatable from 'react-bs-datatable';
import AppContext from "../components/core/AppContext";
import {css} from "@emotion/css";
import {ResolvePotentialCOIModal} from "../components/tasks/ResolvePotentialCOIModal";

interface Task {
    taskId: string,
    taskType: string,
    description: string,
    entity: string,
}

export const Tasks = () => {

    let url = "/api/ui/tasks?completed=false";
    const [openTasks, setOpenTasks] = useState<Task[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const {setModalBody} = useContext(AppContext);

    useEffect(() => {
        axios.get<Task[]>(url).then(response => {
            setOpenTasks(response.data)
        })
            .then(() => setLoaded(true))
            .catch(() => setError(true));
    }, []);

    function removeTask(taskID: string) {
        const newList = openTasks.filter((item) => item.taskId !== taskID);
        setOpenTasks(newList);
    }

    if (error) {
        return <AlertWrapper text={"Unable to load tasks data"}/>
    }

    function openResolveModal(taskType: string, taskId: string, entity: string, removeTaskCallback: (taskID: string) => void) {
        console.debug(`Opening ${taskType} task ${taskId}`);
        if (taskType === "resolve_client") {
            setModalBody(<ResolveClientModal id={entity} taskId={taskId} removeTaskCB={removeTaskCallback}/>)
        } else if (taskType === "resolve_potential_coi") {
            setModalBody(<ResolvePotentialCOIModal taskId={taskId} removeTaskCB={removeTaskCallback}/>)
        } else {
            console.log("Not implemented")
        }
    }

    function getHeader() {
        return [
            {
                title: 'Type',
                prop: 'taskType',
                filterable: true,
            },
            {
                title: 'Description',
                prop: 'description',
                filterable: true,
            },
        ];
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

    return (
        <>
            <Container fluid className={"p-3"}>
                <PageTitle title={"Data reconciliation tasks"}/>

                <TasksInfobox/>

                {Boolean(!loaded && <LoadingWrapper/>)}

                {Boolean(loaded) && (

                    <Datatable tableHeaders={getHeader()}
                               tableBody={openTasks}
                               initialSort={{prop: 'created', isAscending: false}}
                               classes={tableClasses}
                               rowsPerPage={10}
                               rowsPerPageOption={[5, 10, 25, 50]}
                               onRowClick={(o) => openResolveModal(o.taskType, o.taskId, o.entity, removeTask)}
                    />

                )}

            </Container>
        </>
    )
};

const TasksInfobox = () => {

    return (
        <FirebaseAuthConsumer>
            {({isSignedIn, user, providerId}) => {
                if (isSignedIn) {
                    return (
                        <Alert variant={"info"}>
                            These are short data reconciliation tasks that could not be resolved automatically and
                            need to be done by hand: Click on one to get started.
                        </Alert>
                    )
                } else {
                    return (
                        <Alert variant={"warning"}>
                            <FontAwesome name={"warning"} className={"mr-1"}/> You are not currently signed in: you can
                            view the tasks below but will not be able to
                            help edit them until you have signed in.
                        </Alert>
                    )
                }
            }}
        </FirebaseAuthConsumer>
    )
};