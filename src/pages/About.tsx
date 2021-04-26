import React from "react";
import {PageTitle} from "../components/PageTitle";

export const About = () => {
    return (
        <>
            <PageTitle title={"About"}/>
            <p>
                This application is part of a suite of tools that are being developed under the banner of PubCOI.org.
            </p>
            <p>
                While the data stored and analysed here is predominantly for the purposes of identifying and tracking
                conflicts of interest in healthcare, it is hoped these tools can find some use in other industries.
            </p>
        </>
    )
};