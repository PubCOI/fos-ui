import {NoticeResponseDAO} from "./NoticeResponseDAO";

export interface ClientResponseDAO {
    id: string,
    name: string,
    postCode: string,
    noticeCount: number,
    normalisedPostCode: string,
    notices: NoticeResponseDAO[]
}