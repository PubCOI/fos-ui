import {Button, Form, InputGroup} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import FontAwesome from "react-fontawesome";
import {Menu, MenuItem, MenuProps, Typeahead, TypeaheadProps, TypeaheadResult} from "react-bootstrap-typeahead";
import axios from "axios";
import {useToasts} from "react-toast-notifications";
import {NodeMetadataType} from "../../interfaces/INodeMetadata";
import AppContext from "../core/AppContext";
import {SetPrefsModal} from "./preferences/SetPrefsModal";

interface GraphAutocompleteResult {
    name: string,
    score: number,
    id: string,
    type: NodeMetadataType
}

export const GraphFilterBar = () => {

    const {addToast} = useToasts();
    const [searchTerms, setSearchTerms] = useState("");
    const [autocompleteResults, setAutocompleteResults] = useState([] as GraphAutocompleteResult[]);
    const [doingRequest, setDoingRequest] = useState(false);
    const {setGraphMetadata, setGraphConfig, setModalBody, hideModal} = useContext(AppContext);

    const options: TypeaheadProps<any> = {
        id: "search_graph",
        options: autocompleteResults,
        labelKey: "name",
        onInputChange: (input, e) => {
            setSearchTerms(input);
        },
        onChange: selected => {
            console.debug("selected", selected[0]);
            let node = selected[0];
            if (!node) return;
            setGraphMetadata({
                type: node.type,
                id: node.id,
                neo4j_id: node.neo4j_id,
                clear_graph: true,
            })
        }
    };

    const renderMenu = (results: Array<TypeaheadResult<GraphAutocompleteResult>>, menuProps: MenuProps) => (
        <Menu {...menuProps}>

            {results.map((result, index) => (
                <MenuItem option={result} position={index} key={"graph_result_" + index}>
                    <div className={"d-flex justify-content-between align-items-center"}>
                        <>
                            {(result.type === NodeMetadataType.organisation) ? <FontAwesome name={"building-o"} fixedWidth/> : <FontAwesome name={"users"} fixedWidth/> }
                        </>
                        <div>
                            <div>{result.name}</div>
                            <small className={"text-muted"}>{result.id}</small>
                        </div>
                    </div>
                </MenuItem>
            ))}

        </Menu>
    );

    useEffect(() => {
        if (searchTerms.length < 2) {
            setDoingRequest(false);
            return;
        }
        setDoingRequest(true);
        axios.get<GraphAutocompleteResult[]>("/api/graphs/_search", {
            params: {
                query: encodeURIComponent(searchTerms),
                _t: Date.now()
            }
        })
            .then(response => {
                setAutocompleteResults(response.data);
                setDoingRequest(false);
            })
            .catch(error => {
                addToast(
                    error.toString(),
                    {
                        appearance: "error",
                        autoDismiss: true,
                    }
                );
                setAutocompleteResults([]);
            })

    }, [searchTerms]);

    function showPrefsModal() {
        setModalBody(<SetPrefsModal/>);
    }

    return (
        <>
            <div className={"second-nav"}>
                <Form aria-autocomplete={"none"} className={""}>
                    <InputGroup className={"d-flex"}>
                        <InputGroup.Prepend className={"d-none d-sm-block"}>
                            <InputGroup.Text>Quick&nbsp;<span className={"d-none d-md-block"}>search</span> <FontAwesome
                                name={"caret-right"}
                                className={"ml-2"}/></InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control as="select">
                            <option value={"qs_50"}>Last 50 records</option>
                        </Form.Control>
                        <InputGroup.Prepend className={"d-none d-sm-block"}>
                            <InputGroup.Text><span className={"d-lg-none"}>Org / Dept</span><span
                                className={"d-none d-lg-block"}>Organisation / Department</span><FontAwesome
                                name={"caret-right"}
                                className={"ml-2"}/></InputGroup.Text>
                        </InputGroup.Prepend>
                        <div className={"flex-grow-1"}>
                            <Typeahead {...options} placeholder={"Search term(s)"}
                                       isLoading={doingRequest}
                                       renderMenu={
                                           ((results, menuProps) => renderMenu(results, menuProps))}>
                            </Typeahead>
                        </div>
                        <InputGroup.Append>
                            <Button variant="secondary" type={"button"} onClick={() => showPrefsModal()}>Settings <FontAwesome name={"gears"}/></Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form>
            </div>
        </>
    )
};