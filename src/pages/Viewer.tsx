import React from "react";
import {Route, Switch} from "react-router";
import {CFViewer} from "./CFViewer";


export const Viewer = () => {
    return (
        <>
            <Switch>
                <Route path={"/view/cf/:attachment_id/page/:page_number"} component={CFViewer}/>
            </Switch>
        </>
    )
};