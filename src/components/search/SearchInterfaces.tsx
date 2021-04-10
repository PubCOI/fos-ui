export interface SearchResultWrapper {
    took: number,
    count: number,
    results: BaseSearchResult[];
}

export interface BaseSearchResult {
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
