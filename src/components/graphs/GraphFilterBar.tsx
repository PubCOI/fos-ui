import {Button, Form, FormControl, InputGroup} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import FontAwesome from "react-fontawesome";
import {Menu, MenuItem, MenuProps, Typeahead, TypeaheadProps, TypeaheadResult} from "react-bootstrap-typeahead";
import axios from "axios";
import {useToasts} from "react-toast-notifications";

interface GraphAutocompleteResult {
    name: string,
    score: number,
    id: string
}

export const GraphFilterBar = () => {

    const {addToast} = useToasts();
    const [searchTerms, setSearchTerms] = useState("");
    const [autocompleteResults, setAutocompleteResults] = useState([] as GraphAutocompleteResult[]);
    const [doingRequest, setDoingRequest] = useState(false);

    useEffect(() => {
        // set initial results
        setAutocompleteResults([
            {
                name: "abc",
                score: 2,
                id: "abc123"
            },
            {
                name: "def",
                score: 1,
                id: "test123"
            }
        ])
    }, []);

    const options: TypeaheadProps<any> = {
        id: "search_graph",
        options: autocompleteResults,
        labelKey: "name",
        onInputChange: (input, e) => {
            setSearchTerms(input);
        },
    };

    const renderMenu = (results: Array<TypeaheadResult<GraphAutocompleteResult>>, menuProps: MenuProps) => (
        <Menu {...menuProps}>

            {results.map((result, index) => (
                <MenuItem option={result} position={index}>
                    {result.name}
                </MenuItem>
            ))}

        </Menu>
    );

    useEffect(() => {
        if (searchTerms.length < 3) {
            setDoingRequest(false);
            return;
        }
        setDoingRequest(true);
        axios.get<GraphAutocompleteResult[]>("/api/ui/graphs/search", {
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

    return (
        <>
            <div className={"second-nav"}>
                <Form aria-autocomplete={"none"} className={""}>
                    <InputGroup>
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
                        <Typeahead {...options} placeholder={"Search term(s)"}
                                   isLoading={doingRequest}
                                   renderMenu={
                                       ((results, menuProps) => renderMenu(results, menuProps))}>
                        </Typeahead>
                        {/*<FormControl as={"input"} type={"range"} className={"w-25"}></FormControl>*/}
                        {/*<input type="range"*/}
                        {/*       className="custom-range mx-3"*/}
                        {/*       min="1" max={"10"} step="1" id="dateRange"*/}
                        {/*/>*/}
                        <InputGroup.Append>
                            <Button variant="secondary" type={"submit"}>Search</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form>
            </div>
        </>
    )
};