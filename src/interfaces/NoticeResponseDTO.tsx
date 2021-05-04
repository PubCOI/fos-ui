import {AwardDTO} from "../generated/FosTypes";

export interface NoticeResponseDTO {
    id: string,
    title: string,
    postedDT: string,
    organisation: string,
    description: string,
    valueLow: number,
    valueHigh: number,
    awards: AwardDTO[]
}