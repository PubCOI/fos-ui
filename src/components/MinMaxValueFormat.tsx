import NumberFormat from "react-number-format";
import React from "react";

export const MinMaxValueFormat = (props: { min?: number, max?: number, rounded?: boolean }) => {
    let min = (props.rounded) ? Math.round(props.min || 0) : props.min;
    let max = (props.rounded) ? Math.round(props.max || 0) : props.max;
    if (0 === min) {
        return (<>up to <NumberFormat thousandSeparator
                                       displayType={"text"} prefix={"£"}
                                       value={max}/></>)
    }
    if (0 === max) {
        return (<>at least <NumberFormat thousandSeparator
                                          displayType={"text"} prefix={"£"}
                                          value={min}/></>)
    }
    if (min === max) {
        return (<><NumberFormat thousandSeparator displayType={"text"} prefix={"£"} value={max}/></>)
    } else {
        return (
            <>
                {<NumberFormat thousandSeparator
                                displayType={"text"} prefix={"£"}
                                value={min}/>} &mdash; {<NumberFormat
                thousandSeparator displayType={"text"} prefix={"£"}
                value={max}/>}
            </>
        )
    }
};