import {AttachmentDTO} from "../AttachmentDTO";

export interface AwardDTO {
    id: string,
    noticeId: string,
    noticeTitle: string,
    organisation: string,
    supplierName: string,
    supplierNumTotalAwards: number,
    value: number,
    valueMin: number,
    valueMax: number,
    group_award: boolean,
    attachments: AttachmentDTO[]
}