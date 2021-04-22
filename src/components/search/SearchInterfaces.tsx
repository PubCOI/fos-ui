export interface AttachmentsSearchResultsWrapper {
    took: number,
    count: number,
    results: BaseAttachmentsSearchResult[];
}

export interface BaseAttachmentsSearchResult {
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

export interface InterestsSearchResultsWrapper {
    took: number,
    count: number,
    results: AggregatedInterestsResult[]
}

export interface AggregatedInterestsResult {
    personName: string,
    top_hits: InterestsSearchResult[]
}

export interface InterestsSearchResult {
    id: string,
    text: string,
    fragments: string[],
    registeredDate: string,
    valueSum: number,
    donation: boolean,
}