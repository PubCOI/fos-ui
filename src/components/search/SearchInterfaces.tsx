interface SearchByAggregationResult extends BaseSearchResult {
    hits: number,
}

export interface SearchResultWrapper {
    tookInMillis: number,
    results: number,
    paged: SearchByPageResult[];
    aggregated: SearchByAggregationResult[];
}

export interface SearchByPageResult extends BaseSearchResult {
    pageNumber: string
}

interface BaseSearchResult {
    fragments: string[],
    attachmentId: string,
    noticeId: string,
    key: string
    noticeInfo: string,
    noticeDescription: string,
    organisation: string,
    noticeDT: string,
}