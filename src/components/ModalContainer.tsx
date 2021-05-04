import React from "react";

export const ModalContainer = (props: { modalBody: any }) => {
    return (
        <>
            <div>
                {props.modalBody}
            </div>
        </>
    )
};