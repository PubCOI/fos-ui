import React from "react";
import {Route, Switch} from "react-router";
import {CFViewerRouter} from "./CFViewerRouter";


export const Viewer = () => {
    return (
        <>
            <Switch>
                <Route path={"/view/cf/:attachment_id/page/:page_number"} component={CFViewerRouter}/>
            </Switch>
        </>
    )
};