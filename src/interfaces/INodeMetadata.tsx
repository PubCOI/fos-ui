import {NodeTypeEnum} from "../generated/FosTypes";


export interface INodeMetadata {
    fosId: string,
    type: NodeTypeEnum,
    neo4j_id: string,
    clear_graph: boolean,
}