import React from "react";

// pattern shamelessly copied from https://www.savaslabs.com/blog/using-react-global-state-hooks-and-context

const AppContext = React.createContext({
    displayName: "",
    setDisplayName: (name: string) => {},
});

export default AppContext;
