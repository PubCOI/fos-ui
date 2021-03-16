import FontAwesome from "react-fontawesome";
import NumberFormat from "react-number-format";
import {MinMaxValueFormat} from "./MinMaxValueFormat";
import React from "react";
import {AwardDAO} from "../interfaces/DAO/AwardDAO";
import {renderTooltip} from "../hooks/Utils";
import {OverlayTrigger} from "react-bootstrap";

export const ContractValueFormat = (props: { award: AwardDAO }) => {
    if (0 === props.award.value && 0 === props.award.valueMin && 0 === props.award.valueMax) {
        return (<>[Data unavailable] <OverlayTrigger
            placement="auto"
            delay={{show: 100, hide: 250}}
            overlay={renderTooltip({text: "Data missing from this record"})}><FontAwesome name={"warning"}/></OverlayTrigger></>)
    }
    if (0 !== props.award.value) {
        return (
            <NumberFormat thousandSeparator displayType={"text"} prefix={"£"} value={props.award.value}/>
        )
    }
    return <MinMaxValueFormat min={props.award.valueMin} max={props.award.valueMax}/>
};