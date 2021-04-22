import {AwardMDBDTO} from "./DTO/AwardMDBDTO";

export interface NoticeResponseDTO {
    id: string,
    title: string,
    postedDT: string,
    organisation: string,
    description: string,
    valueLow: number,
    valueHigh: number,
    awards: AwardMDBDTO[]
}