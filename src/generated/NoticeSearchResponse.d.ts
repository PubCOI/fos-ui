/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 2.30.840 on 2021-04-24 19:55:19.

export interface NoticeSearchResponse {
    ByRegion: ByRegion;
    ByStatus: ByStatus;
    ByType: ByType;
    HitCount?: number;
    MaxHits?: number;
    NoticeList: NoticeList;
}

export interface ByRegion {
    Items: RegionItems;
    Other?: number;
}

export interface ByStatus {
    Items: StatusItems;
    Other?: number;
}

export interface ByType {
    Items: TypeItems;
    Other?: number;
}

export interface NoticeList {
    HitOfNoticeIndex?: NoticeHitType[];
}

export interface RegionItems {
    KeyValuePairOfstringlong?: KVPType[];
}

export interface StatusItems {
    KeyValuePairOfNullableOfNoticeStatus?: KVPType[];
}

export interface TypeItems {
    KeyValuePairOfNullableOfNoticeType?: KVPType[];
}

export interface NoticeHitType {
    Score?: number;
    Item: NoticeIndex;
}

export interface KVPType {
    key: string;
    value?: number;
}

export interface NoticeIndex {
    Id: string;
    ParentId?: string;
    Title?: string;
    Description?: string;
    CpvDescription?: string;
    PublishedDate: Date;
    DeadlineDate: Date;
    ApproachMarketDate?: Date;
    ValueLow: number;
    ValueHigh: number;
    Postcode: string;
    IsSuitableForSme?: boolean;
    IsSuitableForVco?: boolean;
    NoticeType?: string;
    NoticeStatus?: string;
    Region: string;
    LastNotifiableUpdate: Date;
    OrganisationName: string;
    Sector: string;
    CpvCodes?: string[];
    Start: Date;
    End: Date;
    NoticeIdentifier: string;
    CpvDescriptionExpanded?: string;
    AwardedDate?: Date;
    AwardedSupplier?: string;
    AwardedValue: number;
    Coordinates?: string;
    IsSubNotice?: boolean;
    AwardedToSme?: boolean;
    AwardedToVcse?: boolean;
    CpvCodesExtended?: string[];
}
