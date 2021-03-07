export interface SearchResultWrapper {
    tookInMillis: number,
    results: SearchResult[];
}

export interface SearchResult {
    fragments: string[],
    attachmentId: string,
    noticeId: string,
    pageNumber: number,
    key: string
    noticeInfo: string,
    organisation: string,
    noticeDT: string,
}