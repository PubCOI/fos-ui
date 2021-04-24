import {Button, Col, Form, InputGroup, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import React, {Dispatch, FormEvent, SetStateAction, useState} from "react";
import FontAwesome from "react-fontawesome";
import axios, {AxiosResponse} from "axios";
import {useToasts} from "react-toast-notifications";
import {CFSearchRequest, CFSearchResponse} from "./AddDataInterfaces";

enum SearchBy {
    fieldName = "searchBy",
    awarded = "awarded", published = "published"
}



export const AddDataForm = (props: {setSearchResponseCallback: Dispatch<SetStateAction<CFSearchResponse>>}) => {

    const {addToast} = useToasts();
    const [dateType, setDateType] = useState(SearchBy.published.toString());
    const [dateRange, setDateRange] = useState("_3m");
    const [searchTerms, setSearchTerms] = useState("");

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        axios.post<CFSearchRequest, AxiosResponse<CFSearchResponse>>(
            "/api/search/contract-finder", {
                dateRange: dateRange,
                dateType: dateType,
                query: searchTerms
            }
        ).then((res) => {
            props.setSearchResponseCallback(res.data);
        });
    }

    return (
        <Form onSubmit={handleSubmit}>

            <Form.Row>
                <Form.Group as={Col} md="6" controlId={SearchBy.fieldName}>
                    <Form.Label>Find contracts where the:</Form.Label>
                    <div>
                        <ToggleButtonGroup
                            defaultValue={SearchBy.published}
                            className={"w-100"}
                            type={"radio"}
                            name={SearchBy.fieldName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setDateType(e.toString());
                            }}>
                            <ToggleButton
                                className={"w-50"}
                                value={SearchBy.published}
                                name={SearchBy.fieldName}
                                variant="outline-primary">
                                <div className={"d-flex align-items-center justify-content-center"}>
                                    <FontAwesome name={"newspaper-o"} className={"mr-2"}/> Publish date
                                </div>
                            </ToggleButton>
                            <ToggleButton
                                className={"w-50"}
                                value={SearchBy.awarded}
                                name={SearchBy.fieldName}
                                variant="outline-primary">
                                <div className={"d-flex align-items-center justify-content-center"}>
                                    <FontAwesome name={"trophy"} className={"mr-2"}/> Award date
                                </div>
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                </Form.Group>

                <Form.Group as={Col} md="6" controlId="dateRange">
                    <Form.Label>is within:</Form.Label>
                    <Form.Control
                        as="select"
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDateRange(e.target.value) }>
                        <option value={"_3m"}>Last three months</option>
                        <option value={"_6m"}>Last six months</option>
                        <option value={"_1y"}>Last year</option>
                        <option value={"_3y"}>Last three years</option>
                        <option value={"_5y"}>Last five years</option>
                        <option value={"_10y"}>Last ten years</option>
                    </Form.Control>
                </Form.Group>

            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} controlId="validationCustom01">
                    <Form.Label>Containing the following keywords:</Form.Label>
                    <InputGroup>
                        <Form.Control
                            required type="text"
                            placeholder="Enter keywords to search..."
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setSearchTerms(e.target.value)
                            }}
                        />
                        <InputGroup.Append>
                            <Button variant={"outline-success"} type={"submit"}><FontAwesome name={"search"}
                                                                                             className={"mr-1"}/> Search</Button>
                        </InputGroup.Append>
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">
                        Please enter search term(s)
                    </Form.Control.Feedback>
                </Form.Group>
            </Form.Row>
        </Form>
    );
}