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

export interface GraphDetailedSearchResponseDTO extends GraphSearchResponseDTO {
    details?: string[];
}

export interface OrganisationDTO {
    fosId?: string;
    name?: string;
    verified?: boolean;
}

export interface AwardDTO {
    id: string;
    noticeId: string;
    noticeTitle?: string;
    organisation?: string;
    supplierName?: string;
    supplierNumTotalAwards?: number;
    value: number;
    valueMin?: number;
    valueMax?: number;
    awardDate: Date;
    startDate?: Date;
    endDate?: Date;
    attachments?: AttachmentDTO[];
    group_award?: boolean;
}

export interface AwardsGraphListResponseDTO {
    id: string;
    noticeId: string;
    client?: string;
    awardee?: string;
    value?: number;
    valueMin?: number;
    valueMax?: number;
    awardDate: Date;
    startDate?: Date;
    endDate?: Date;
    groupAward?: boolean;
    knownAs?: KnownAsDTO;
}

export interface ClientsGraphListResponseDTO {
    fosId?: string;
    name?: string;
    total?: number;
    canonical?: boolean;
    hidden?: boolean;
    firstNotice?: Date;
    lastNotice?: Date;
    notices?: string[];
}

export interface OrganisationsGraphListResponseDTO {
    organisation?: OrganisationDTO;
    totalAwards?: number;
    awards?: string[];
    awardDetails?: AwardDTO[];
}

export interface ResolvePotentialCOIDTO extends TaskDTO {
    organisation?: FosOrganisation;
    memberInterest?: MemberInterest;
}

export interface ResolvedCOIDTOResponse {
    nextTaskId?: string;
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

export interface GraphSearchResponseDTO extends GenericIDNameFTSResponse {
    type?: NodeTypeEnum;
}

export interface AttachmentDTO {
    id: string;
    noticeId: string;
    description?: string;
    type: string;
    href?: string;
    textData?: string;
    mime?: string;
    ocr?: boolean;
}

export interface KnownAsDTO {
    id: string;
    name: string;
}

export interface FosOrganisation extends FosEntity {
    jurisdiction?: string;
    companyName?: string;
    companyAddress?: string;
    referenceType?: string;
    reference?: string;
    verified?: boolean;
}

export interface MemberInterest {
    id?: string;
    personNodeId?: string;
    mnisInterestId?: number;
    pwInterestId?: string;
    pwPersonId?: string;
    mnisPersonId?: number;
    personFullName?: string;
    text?: string;
    registeredDate?: Date;
    pwCategory?: number;
    pwCategoryDescription?: string;
    mnisCategory?: number;
    mnisCategoryDescription?: string;
    donation?: boolean;
    donorName?: string;
    datasets?: string[];
    valueSum?: number;
    source?: SourceEnum;
}

export interface TaskDTO {
    taskId?: string;
    taskType?: FosTaskType;
    entity?: string;
    description?: string;
    linkedEntity?: string;
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

export interface GenericIDNameFTSResponse {
    id?: string;
    name?: string;
    score?: number;
}

export interface FosEntity {
    fosId?: string;
    hidden?: boolean;
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

export enum NodeTypeEnum {
    client = "client",
    organisation = "organisation",
    person = "person",
    notice = "notice",
    award = "award",
}

export enum FosTaskType {
    resolve_client = "resolve_client",
    resolve_potential_coi = "resolve_potential_coi",
    resolve_company = "resolve_company",
}

export enum SourceEnum {
    pw = "pw",
    mnis = "mnis",
}
