import {Menu, MenuItem, MenuProps, TypeaheadResult} from "react-bootstrap-typeahead";

import React from "react";
import {GraphDetailedSearchResponseDTO} from "../../../generated/FosTypes";

export const RenderAutocompleteResults = (props: { results: Array<TypeaheadResult<GraphDetailedSearchResponseDTO>>, menuProps: MenuProps }) => {
    return (
        <Menu {...props.menuProps} className={"typeahead-pos-normal"}>
            {props.results.map((result, index) => (
                <MenuItem option={result} position={index} key={"search_result_" + index}>
                    <div>
                        <div>{result.name}</div>
                        <div><small className={"text-muted"}>ID {result.id}</small></div>
                        {Boolean(result.details) && (
                            <div>
                                <small className={"text-muted"}>Associated with </small>
                                <small className={"text-muted"}>
                                    {result.details?.map((detail, index) => (
                                        <span key={`result_detail_${index}`}>{detail}</span>
                                    ))}
                                </small>
                            </div>
                        )}
                    </div>
                </MenuItem>
            ))}
        </Menu>
    )
};