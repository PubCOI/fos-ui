import React from "react";

const PaneContext = React.createContext({
    paneContents: <></>,
    setPaneContents: (children: any) => {},
    paneTitle: "",
    setPaneTitle: (title: string) => {},
    paneSubtitle: "",
    setPaneSubtitle: (subtitle: string) => {},
    openPane: () => {},
    closePane: () => {}
});

export default PaneContext;
