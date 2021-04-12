export interface CompanyPositionDAO {
    companyId: string,
    companyName: string,
    position: string,
}

export interface PersonDAO {
    id: string,
    ocId: string,
    commonName: string,
    occupation: string,
    nationality: string,
    positions: CompanyPositionDAO[]
}