export interface INode {
    neo4j_id: number,
    labels: string[],
    properties: any
}

export interface IRef {
    neo4j_id: number,
    start: number, // IMPORTANT this is 64 bits so will have issues w/lots of nodes
    end: number, // as above
    type: string,
    properties: any
}