import {AttachmentDTO} from "../AttachmentDTO";

// note this is returning award details straight from the MDB
export interface AwardMDBDTO {
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