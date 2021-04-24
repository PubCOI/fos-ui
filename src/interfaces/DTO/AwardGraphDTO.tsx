import {AttachmentDTO} from "../AttachmentDTO";

// note this is returning a list of awards from the GRAPH, not the MDB (so we use 'awardee' instead of 'supplier')
export interface AwardGraphDTO {
    id: string,
    noticeId: string,
    client: string,
    awardee: string,
    supplierNumTotalAwards: number,
    value: number,
    valueMin: number,
    valueMax: number,
    groupAward: boolean,
    attachments: AttachmentDTO[],
    awardDate: string,
    startDate: string,
    endDate: string,
    knownAs: KnownAs
}

export interface KnownAs {
    id: string,
    name: string
}