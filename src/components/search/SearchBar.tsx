import {Button, Form, FormControl, InputGroup} from "react-bootstrap";
import React, {FormEvent} from "react";

export const SearchBar =
    (props:
         {
             className?: string,
             doSubmitCallback: (e: FormEvent<HTMLFormElement>) => void,
             setParamsCallback: (input: string) => void
         }) => {

        return (
            <>
                <Form onSubmit={props.doSubmitCallback}>
                    <InputGroup className={props.className}>
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
                </Form>
            </>
        )
    };