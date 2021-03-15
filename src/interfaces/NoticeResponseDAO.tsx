import {AwardDAO} from "./DAO/AwardDAO";

export interface NoticeResponseDAO {
    id: string,
    title: string,
    postedDT: string,
    organisation: string,
    description: string,
    valueLow: number,
    valueHigh: number,
    awards: AwardDAO[]
}