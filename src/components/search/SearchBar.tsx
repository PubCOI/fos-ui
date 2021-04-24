import {Button, Form, FormControl, InputGroup, OverlayTrigger} from "react-bootstrap";
import React, {FormEvent, MutableRefObject, useEffect, useState} from "react";
import FontAwesome from "react-fontawesome";
import {useForm} from "react-hook-form";
import {renderTooltip} from "../../hooks/Utils";
import moment from "moment";

export const SearchBar =
    (props:
         {
             initialParams: MutableRefObject<string>,
             doSubmitHandler: (e: FormEvent<HTMLFormElement>) => void,
             setParamsCallback: (queryParams: string) => void,
             setGroupByCallback: (input: boolean) => void,
             setSearchTypeCallback: (searchType: string) => void
         }) => {

        const {register, handleSubmit, setValue} = useForm();
        const [groupBy, setGroupBy] = useState(true);
        const [queryParams, setQueryParams] = useState<string>(props.initialParams.current);
        const [searchType, setSearchType] = useState("contracts");
        const [helperTooltip, setHelperTooltip] = useState(false);

        useEffect(() => {
            const htDT_key = "htDT";
            let htDT = localStorage.getItem(htDT_key);
            if (null === htDT || moment(htDT).diff(new Date()) > 60*60*3*1000) {
                setTimeout(() => {
                    setHelperTooltip(true);
                }, 500);
                setTimeout(() => {
                    setHelperTooltip(false);
                }, 5000);
                localStorage.setItem(htDT_key, new Date().toISOString());
            }
        }, []);

        useEffect(() => {
            props.setGroupByCallback(groupBy);
        }, [groupBy]);

        useEffect(() => {
            props.setSearchTypeCallback(searchType);
        }, [searchType]);

        useEffect(() => {
            // don't send a change event back up on load
            // otherwise we clear the search field
            if (queryParams && queryParams.length > 0) {
                props.initialParams.current = queryParams;
                props.setParamsCallback(queryParams);
            }
        }, [queryParams]);

        useEffect(() => {
            // set initial field value from ref on module load
            setValue("docSearchInput", props.initialParams.current);
        }, []);

        return (
            <>
                <div className={"second-nav"}>
                    <Form onSubmit={props.doSubmitHandler} aria-autocomplete={"none"}>
                        <InputGroup>
                            <OverlayTrigger
                                placement="bottom"
                                show={helperTooltip}
                                delay={{show: 100, hide: 250}}
                                overlay={renderTooltip({text: "Select type of record here: you can search members' interests as well as contract data"})}>
                            <InputGroup.Prepend>
                                <Form.Control
                                    as="select"
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
                                        setSearchType(e.target.value);
                                    }}>
                                    <option value={"contracts"}>Contracts</option>
                                    <option value={"interests"}>MP/Lords Interests</option>
                                </Form.Control>
                            </InputGroup.Prepend>
                            </OverlayTrigger>
                            <FormControl
                                aria-label="Search"
                                placeholder={"Search term(s)"}
                                ref={register}
                                name={"docSearchInput"}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ): void => {
                                    setQueryParams(e.target.value);
                                }}
                            />
                            <InputGroup.Append>
                                <Button variant="secondary" type={"submit"}>Search</Button>
                            </InputGroup.Append>
                        </InputGroup>
                        <div hidden={(searchType !== "contracts")}>
                            <InputGroup className={"mt-0 p-1 bg-light text-muted"} size={"sm"}>
                                <span>Options <FontAwesome className={"mr-2"} name={"caret-right"}/></span>
                                <Form.Check
                                    inline label="Group by attachment" checked={groupBy} onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ): void => setGroupBy(e.target.checked)}
                                />
                            </InputGroup>
                        </div>
                    </Form>
                </div>
            </>
        )
    };