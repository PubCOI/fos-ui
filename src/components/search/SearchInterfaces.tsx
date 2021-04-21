export interface AttachmentSearchResultWrapper {
    took: number,
    count: number,
    results: BaseAttachmentSearchResult[];
}

export interface BaseAttachmentSearchResult {
    key: string
    fragments: string[],
    attachmentId: string,
    noticeId: string,
    noticeInfo: string,
    noticeDescription: string,
    client: string,
    noticeDT: string,
    firstAwardDT: string,
    hits: number,
    pageNumber: string,
}
