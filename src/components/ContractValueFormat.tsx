import FontAwesome from "react-fontawesome";
import NumberFormat from "react-number-format";
import {MinMaxValueFormat} from "./MinMaxValueFormat";
import React from "react";
import {AwardDAO} from "../interfaces/DAO/AwardDAO";

export const ContractValueFormat = (props: { award: AwardDAO }) => {
    if (0 === props.award.value && 0 === props.award.valueMin && 0 === props.award.valueMax) {
        return (<>[Data unavailable] <FontAwesome name={"warning"}/></>)
    }
    if (0 !== props.award.value) {
        return (
            <NumberFormat thousandSeparator displayType={"text"} prefix={"£"} value={props.award.value}/>
        )
    }
    return <MinMaxValueFormat min={props.award.valueMin} max={props.award.valueMax}/>
};