export interface CreateTaskRequestDAO {
    type: string,
    id: string,
    errorType: string,
    notes: string,
}

export interface CreateTaskResponseDAO {
    taskId: string,
    message: string,
}