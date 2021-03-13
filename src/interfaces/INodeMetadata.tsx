export enum NodeMetadataType {
    client = "client",
    notice = "notice"
}

export interface INodeMetadata {
    id: string,
    type: NodeMetadataType,
}