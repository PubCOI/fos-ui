import {NoticeResponseDTO} from "./NoticeResponseDTO";

export interface ClientNodeResponseDTO {
    id: string,
    name: string,
    postCode: string,
    noticeCount: number,
    normalisedPostCode: string,
    notices: NoticeResponseDTO[]
}