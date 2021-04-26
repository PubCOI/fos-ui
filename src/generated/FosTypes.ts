/* tslint:disable */
/* eslint-disable */

export interface NoticeSearchResponse {
    byRegion?: ByRegion;
    byStatus?: ByStatus;
    byType?: ByType;
    hitCount?: number;
    maxHits?: number;
    noticeList?: NoticeList;
}

export interface AddRelationshipDTO {
    relId?: string;
    relName?: string;
    relType?: AddRelTypeEnum;
    coiType?: AddRelCoiTypeEnum;
    coiSubtype?: AddRelCoiSubtypeEnum;
    comments?: string;
    evidenceComments?: boolean;
    evidenceFile?: boolean;
    evidenceURL?: string;
    newObject?: boolean;
}

export interface UpdateProfileResponseDTO {
    displayName?: string;
    uid?: string;
}

export interface UpdateProfileRequestDTO {
    displayName?: string;
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
    hitOfNoticeIndices?: NoticeHitType[];
}

export interface RegionItems {
    keyValuePairOfstringlongs?: KVPType[];
}

export interface StatusItems {
    keyValuePairOfNullableOfNoticeStatuses?: KVPType[];
}

export interface TypeItems {
    keyValuePairOfNullableOfNoticeTypes?: KVPType[];
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
    cpvCodesExtendeds?: string[];
    alreadyLoaded?: boolean;
}

export enum AddRelTypeEnum {
    person = "person",
    organisation = "organisation",
}

export enum AddRelCoiTypeEnum {
    direct_financial = "direct_financial",
    indirect_financial = "indirect_financial",
    non_financial_professional = "non_financial_professional",
    non_financial_personal = "non_financial_personal",
    indirect = "indirect",
}

export enum AddRelCoiSubtypeEnum {
    director = "director",
    shareholder = "shareholder",
    management_consultant = "management_consultant",
    secondary_income = "secondary_income",
    expenses = "expenses",
    spouse = "spouse",
    relative = "relative",
    friend = "friend",
    financial = "financial",
    business_partner = "business_partner",
    lobbying = "lobbying",
    advocate = "advocate",
    professional_body = "professional_body",
    voluntary = "voluntary",
    trustee = "trustee",
}
