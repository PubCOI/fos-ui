export interface AddRelationshipDTO {
    isNewObject: boolean,
    relId: string,
    relName: string,
    relType: string,
    coiType: string,
    coiSubtype: string,
    comments: string,
    evidenceComments: boolean,
    evidenceFile: boolean,
    evidenceURL: string,
}