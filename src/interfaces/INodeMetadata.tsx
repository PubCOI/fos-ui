export enum NodeMetadataType {
    client = "client",
    notice = "notice",
    award = "award",
}

export interface INodeMetadata {
    id: string,
    type: NodeMetadataType,
}