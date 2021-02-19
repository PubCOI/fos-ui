import {DefaultToastContainer} from "react-toast-notifications";
import React from "react";

export const FOSToastContainer = (props: any) => (
    <DefaultToastContainer
        className="fos-toast-container"
        {...props}
    />
);