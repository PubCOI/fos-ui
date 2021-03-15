export enum NodeMetadataType {
    client = "client",
    notice = "notice",
    award = "award",
    organisation = "organisation",
}

export interface INodeMetadata {
    id: string,
    type: NodeMetadataType,
    neo4j_id?: string,
}