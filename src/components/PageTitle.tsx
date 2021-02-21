import React from "react";

export const PageTitle = (props: {title: string}) => {
    return (
        <>
            <h1 className={"mt-3"}>{props.title}</h1>
        </>
    )
};