import {Button, Form, FormControl, InputGroup} from "react-bootstrap";
import React, {FormEvent, MutableRefObject, useEffect, useState} from "react";
import FontAwesome from "react-fontawesome";
import {useForm} from "react-hook-form";

export const SearchBar =
    (props:
         {
             initialParams: MutableRefObject<string>,
             doSubmitHandler: (e: FormEvent<HTMLFormElement>) => void,
             setParamsCallback: (input: string) => void,
             setGroupByCallback: (input: boolean) => void
         }) => {

        const {register, handleSubmit, setValue} = useForm();
        const [groupBy, setGroupBy] = useState(true);
        const [searchParams, setSearchParams] = useState<string>(props.initialParams.current);

        useEffect(() => {
            props.setGroupByCallback(groupBy);
        }, [groupBy]);

        useEffect(() => {
            // don't send a change event back up on load
            // otherwise we clear the search field
            if (searchParams && searchParams.length > 0) {
                props.initialParams.current = searchParams;
                props.setParamsCallback(searchParams);
            }
        }, [searchParams]);

        useEffect(() => {
            // set initial field value from ref on module load
            setValue("docSearchInput", props.initialParams.current);
        }, []);

        return (
            <>
                <div className={"second-nav"}>
                    <Form onSubmit={props.doSubmitHandler} aria-autocomplete={"none"}>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <Form.Control as="select">
                                    <option value={"contracts"}>Contracts</option>
                                    <option value={"filings"} disabled>Filings</option>
                                </Form.Control>
                            </InputGroup.Prepend>
                            <FormControl
                                aria-label="Search"
                                placeholder={"Search term(s)"}
                                ref={register}
                                name={"docSearchInput"}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ): void => {
                                    setSearchParams(e.target.value);
                                }}
                            />
                            <InputGroup.Append>
                                <Button variant="secondary" type={"submit"}>Search</Button>
                            </InputGroup.Append>
                        </InputGroup>
                        <InputGroup className={"mt-0 p-1 bg-light text-muted"} size={"sm"}>
                            <span>Options <FontAwesome className={"mr-2"} name={"caret-right"}/></span>
                            <Form.Check
                                inline label="Group by attachment" checked={groupBy} onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ): void => setGroupBy(e.target.checked)}
                            />
                        </InputGroup>
                    </Form>
                </div>
            </>
        )
    };