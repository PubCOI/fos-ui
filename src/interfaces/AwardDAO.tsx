export interface AwardDAO {
    id: string,
    noticeId: string,
    organisation: string,
    supplierName: string,
    value: number,
    valueMin: number,
    valueMax: number,
    group_award: boolean
}