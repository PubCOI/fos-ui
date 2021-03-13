import React, {useEffect, useState} from "react";
import {Alert, Badge, ListGroup} from "react-bootstrap";
import {FirebaseAuthConsumer} from "@react-firebase/auth";
import FontAwesome from "react-fontawesome";
import axios from "axios";
import {AlertWrapper} from "../components/AlertWrapper";
import {LoadingWrapper} from "../components/LoadingWrapper";
import {ResolveClientModal} from "../components/tasks/ResolveClientModal";
import {show} from "react-functional-modal";
import {FosToastContainer} from "../components/FosToastContainer";
import {ToastProvider} from "react-toast-notifications";
import {PageTitle} from "../components/PageTitle";

interface Task {
    taskId: string,
    taskType: string,
    description: string,
    entity: string,
}

export const TASK_MODAL_ID_PREFIX = "modal_task_key#";

export const Tasks = () => {

    let url = "/api/ui/tasks?completed=false";
    const [openTasks, setOpenTasks] = useState<Task[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

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

    function openResolveModal(taskType: string, taskID: string, entity: string, removeTaskCallback: (taskID: string) => void) {
        show(
            <ToastProvider components={{ToastContainer: FosToastContainer}}>
                <ResolveClientModal id={entity} taskId={taskID} removeTaskCB={removeTaskCallback}/>
            </ToastProvider>, {key: TASK_MODAL_ID_PREFIX + taskID}
        )
    }

    return (
        <>
            <PageTitle title={"Data reconciliation tasks"}/>

            <TasksInfobox/>

            {Boolean(!loaded && <LoadingWrapper/>)}

            {Boolean(loaded) && (
                <ListGroup>
                    {
                        openTasks.length > 0 ?
                            openTasks.map(task => (
                                <ListGroup.Item action key={task.taskId}
                                                onClick={() => openResolveModal(task.taskType, task.taskId, task.entity, removeTask)}>
                                    <div className={"d-flex"}>
                                        <div className={"mr-3"}>
                                            <Badge variant={"info"}>{task.taskType}</Badge>
                                        </div>
                                        <div className={"text-left"}>{task.description}</div>
                                    </div>
                                </ListGroup.Item>
                            )) :
                            <ListGroup.Item>No tasks found</ListGroup.Item>
                    }
                </ListGroup>
            )}
            {/*<h2 className={"mt-3"}>Recently completed tasks</h2>*/}
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