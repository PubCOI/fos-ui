import React from "react";
import {ApplicationConfig} from "../../interfaces/ApplicationConfig";

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
});

export default AppContext;
