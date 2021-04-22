export interface CompanyPositionDTO {
    companyId: string,
    companyName: string,
    position: string,
}

export interface PersonDTO {
    id: string,
    ocId: string,
    commonName: string,
    occupation: string,
    nationality: string,
    positions: CompanyPositionDTO[]
}