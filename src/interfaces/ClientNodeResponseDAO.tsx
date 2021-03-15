import {NoticeResponseDAO} from "./NoticeResponseDAO";

export interface ClientNodeResponseDAO {
    id: string,
    name: string,
    postCode: string,
    noticeCount: number,
    normalisedPostCode: string,
    notices: NoticeResponseDAO[]
}