/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 2.30.840 on 2021-04-24 20:20:29.

export interface NoticeSearchResponse {
    byRegion?: ByRegion;
    byStatus?: ByStatus;
    byType?: ByType;
    hitCount?: number;
    maxHits?: number;
    noticeList?: NoticeList;
}

export interface ByRegion {
    items?: RegionItems;
    other?: number;
}

export interface ByStatus {
    items?: StatusItems;
    other?: number;
}

export interface ByType {
    items?: TypeItems;
    other?: number;
}

export interface NoticeList {
    hitOfNoticeIndex?: NoticeHitType[];
}

export interface RegionItems {
    keyValuePairOfstringlong?: KVPType[];
}

export interface StatusItems {
    keyValuePairOfNullableOfNoticeStatus?: KVPType[];
}

export interface TypeItems {
    keyValuePairOfNullableOfNoticeType?: KVPType[];
}

export interface NoticeHitType {
    score?: number;
    item?: NoticeIndex;
}

export interface KVPType {
    key?: string;
    value?: number;
}

export interface NoticeIndex {
    id?: string;
    parentId?: string;
    title?: string;
    description?: string;
    cpvDescription?: string;
    publishedDate?: Date;
    deadlineDate?: Date;
    approachMarketDate?: Date;
    valueLow?: number;
    valueHigh?: number;
    postcode?: string;
    isSuitableForSme?: boolean;
    isSuitableForVco?: boolean;
    noticeType?: string;
    noticeStatus?: string;
    region?: string;
    lastNotifiableUpdate?: Date;
    organisationName?: string;
    sector?: string;
    cpvCodes?: string[];
    start?: Date;
    end?: Date;
    noticeIdentifier?: string;
    cpvDescriptionExpanded?: string;
    awardedDate?: Date;
    awardedSupplier?: string;
    awardedValue?: number;
    coordinates?: string;
    isSubNotice?: boolean;
    awardedToSme?: boolean;
    awardedToVcse?: boolean;
    cpvCodesExtended?: string[];
}
