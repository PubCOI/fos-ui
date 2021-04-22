export interface MemberInterestsDTO {
    personName: string,
    personNodeId: string,
    pwPersonId: string,
    mnisPersonId: number,
    interests: MemberInterestDTO[]
}

export interface MemberInterestDTO {
    category: number,
    description: string,
    source: string,
    text: string,
    donation: boolean,
    donor: string
}