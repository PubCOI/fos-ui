export interface AttachmentDAO {
    id: string,
    noticeId: string,
    description: string,
    type: string,
    href: string,
    textData: string,
    mime: string,
    ocr: boolean,
}