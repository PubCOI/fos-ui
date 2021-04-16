import {NodeMetadataType} from "./INodeMetadata";

export interface GraphAutocompleteResult {
    name: string,
    score: number,
    id: string,
    type: NodeMetadataType,
    details: string[] // used for any additional data we want to add to the object
}