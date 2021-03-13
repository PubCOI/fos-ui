import {DefaultToastContainer} from "react-toast-notifications";
import React from "react";

export const FosToastContainer = (props: any) => (
    <DefaultToastContainer
        className="fos-toast-container"
        {...props}
    />
);