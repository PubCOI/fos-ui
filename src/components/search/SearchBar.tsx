import {Button, Form, FormControl, InputGroup} from "react-bootstrap";
import React, {FormEvent, useEffect, useState} from "react";
import FontAwesome from "react-fontawesome";

export const SearchBar =
    (props:
         {
             doSubmitCallback: (e: FormEvent<HTMLFormElement>) => void,
             setParamsCallback: (input: string) => void,
             setGroupBy: (input: boolean) => void
         }) => {

    const [groupBy, setGroupBy] = useState(true);

    useEffect(() => {
        props.setGroupBy(groupBy);
    }, [groupBy]);

        return (
            <>
                <Form onSubmit={props.doSubmitCallback} aria-autocomplete={"none"}>
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
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ): void => props.setParamsCallback(e.target.value)}
                        />
                        <InputGroup.Append>
                            <Button variant="outline-secondary" type={"submit"}>Search</Button>
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
            </>
        )
    };