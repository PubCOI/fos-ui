import {NodeMetadataType} from "./INodeMetadata";

export interface GraphAutocompleteResult {
    name: string,
    score: number,
    id: string,
    type: NodeMetadataType
}