import React from 'react';
import {useParams} from "react-router-dom";
import {CFViewer} from "../components/viewer/CFViewer";
import {CFViewerRouteParams} from "../interfaces/CFViewerRouteParams";

export const CFViewerRouter = () => {
    let {attachment_id, page_number} = useParams<CFViewerRouteParams>();
    return (<CFViewer attachment_id={attachment_id} page_number={page_number}/>);
};