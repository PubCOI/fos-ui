import React from "react";
import {ApplicationConfig} from "../../interfaces/ApplicationConfig";
import {INodeMetadata, NodeMetadataType} from "../../interfaces/INodeMetadata";
import {TimebaseDataEnum} from "../graphs/preferences/TimebaseDataEnum";
import {IGraphConfig} from "../graphs/preferences/IGraphConfig";

// pattern shamelessly copied from https://www.savaslabs.com/blog/using-react-global-state-hooks-and-context

const AppContext = React.createContext({
    config: {
        batch: false,
        debug: false
    },
    setApplicationConfig: (conf: ApplicationConfig) => {},
    displayName: "",
    setDisplayName: (name: string) => {console.error("not implemented")},
    showRightPane: false,
    setShowRightPane: (show: boolean) => {console.error("not implemented")},
    modalBody: <></>,
    setModalBody: (body: any) => {},
    hideModal: () => {},
    graphMetadata: {
        type: NodeMetadataType.client,
        id: "",
        neo4j_id: "",
        clear_graph: false,
    },
    setGraphMetadata: (metadata: INodeMetadata) => {},
    graphConfig: {
        show_timebase_data: TimebaseDataEnum.recent
    },
    setGraphConfig: (config: IGraphConfig) => {},
});

export default AppContext;
