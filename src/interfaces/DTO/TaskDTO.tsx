export interface CreateTaskRequestDTO {
    type: string,
    id: string,
    errorType: string,
    notes: string,
}

export interface CreateTaskResponseDTO {
    taskId: string,
    message: string,
}