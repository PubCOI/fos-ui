import {AttachmentDAO} from "../AttachmentDAO";

export interface AwardDAO {
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
    attachments: AttachmentDAO[]
}