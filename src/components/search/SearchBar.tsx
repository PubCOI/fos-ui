import {Button, Form, FormControl, InputGroup} from "react-bootstrap";
import React, {FormEvent, MutableRefObject, useEffect, useState} from "react";
import FontAwesome from "react-fontawesome";
import {useForm} from "react-hook-form";
import {useParams} from "react-router";
import {SearchType} from "../../pages/Search";

export const SearchBar =
    (props:
         {
             initialParams: MutableRefObject<string>,
             doSubmitHandler: (e: FormEvent<HTMLFormElement>) => void,
             setParamsCallback: (queryParams: string) => void,
             setGroupByCallback: (input: boolean) => void
         }) => {

        let {searchType} = useParams<{ searchType: SearchType }>();
        const {register, setValue} = useForm();
        const [groupBy, setGroupBy] = useState(true);
        const [queryParams, setQueryParams] = useState<string>(props.initialParams.current);

        useEffect(() => {
            props.setGroupByCallback(groupBy);
        }, [groupBy]);

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
                        <div hidden={(searchType !== SearchType.contracts)}>
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