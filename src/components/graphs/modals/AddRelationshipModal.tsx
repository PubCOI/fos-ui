import React, {FormEvent, useContext, useEffect, useState} from "react";
import AppContext from "../../core/AppContext";
import {useToasts} from "react-toast-notifications";
import {Button, Form, InputGroup, Modal, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {INodeMetadata} from "../../../interfaces/INodeMetadata";
import axios, {AxiosError, AxiosResponse} from "axios";
import {GraphAutocompleteResult} from "../../../interfaces/GraphAutocompleteResult";
import FontAwesome from "react-fontawesome";
import {AddRelationshipDAO} from "../../../interfaces/DAO/AddRelationshipDAO";
import firebase from "firebase";
import {Menu, MenuItem, MenuProps, Typeahead, TypeaheadProps, TypeaheadResult} from "react-bootstrap-typeahead";

interface SelectOptions {
    direct_financial: SelectOption[]
    indirect_financial: SelectOption[]
}

interface SelectOption {
    value: string,
    text: string,
}

const allOptions: Map<string, SelectOption[]> = new Map<string, SelectOption[]>();
allOptions.set("direct_financial", [
    {
        value: "director",
        text: "Director (including non-exec) / senior employee",
    },
    {
        value: "shareholder",
        text: "Shareholder or similar ownership interest(s)",
    },
    {
        value: "management_consultant",
        text: "Management consultant for business / org"
    },
    {
        value: "secondary_income",
        text: "In receipt of secondary income"
    },
    {
        value: "expenses",
        text: "In receipt of any payments / honoraria / etc"
    }
]);
allOptions.set("indirect_financial", [
    {
        value: "spouse",
        text: "Spouse / partner"
    },
    {
        value: "relative",
        text: "Close relative (eg parent / child / sibling)"
    },
    {
        value: "friend",
        text: "Close friend"
    },
    {
        value: "business_partner",
        text: "Business partner"
    },
    {
        value: "financial",
        text: "Financial eg pension with business"
    }
]);
allOptions.set("non_financial_professional", [
    {
        value: "advocate",
        text: "Advocate for the business",
    },
    {
        value: "professional_body",
        text: "Close relationship through professional body"
    },
    {
        value: "trustee",
        text: "Trustee for the organisation"
    }
]);
allOptions.set("non_financial_personal", [
    {
        value: "voluntary",
        text: "Volunteer for the business / org"
    },
    {
        value: "trustee",
        text: "Trustee for the organisation"
    },
    {
        value: "lobbying",
        text: "Lobbying relationship"
    }
]);
allOptions.set("indirect", [
    {
        value: "spouse",
        text: "Spouse / partner (where there is no financial relationship)"
    },
    {
        value: "relative",
        text: "Close relative"
    },
    {
        value: "friend",
        text: "Close friend"
    },
    {
        value: "business_partner",
        text: "Business partner"
    }
]);

export const AddRelationshipModal = (props: { metadata: INodeMetadata }) => {
    const {hideModal} = useContext(AppContext);
    const {addToast} = useToasts();

    // form
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [parentType, setParentType] = useState("person");
    const [direct, setDirect] = useState(false);
    const [relName, setRelName] = useState("");
    const [orgName, setOrgName] = useState("");
    const [relType, setRelType] = useState("direct_financial");
    const [relSubtype, setRelSubtype] = useState("director");
    const [relComments, setRelComments] = useState("");
    const [evidenceType, setEvidenceType] = useState("comments");
    const [evidenceURL, setEvidenceURL] = useState("");
    const [isAcknowledged, setIsAcknowledged] = useState(false);
    const [formSubmissionIcon, setFormSubmissionIcon] = useState("plus");
    const [validated, setValidated] = useState(false);
    const [step2Opts, setStep2Opts] = useState<SelectOption[]>(allOptions.get(relType) || [{value: "", text: ""}]);

    // auth
    const [authToken, setAuthToken] = useState("");
    useEffect(() => {
        firebase.auth().currentUser?.getIdToken(/* forceRefresh */ true).then(function (idToken) {
            setAuthToken(idToken);
        })
    }, [firebase.auth().currentUser]);

    // *** autocompletes ***
    const renderACResults = (results: Array<TypeaheadResult<GraphAutocompleteResult>>, menuProps: MenuProps) => (
        <Menu {...menuProps} className={"typeahead-pos-normal"}>
            {results.map((result, index) => (
                <MenuItem option={result} position={index} key={"search_result_" + index}>
                    <div>
                        <div>{result.name}</div>
                        <small className={"text-muted"}>{result.id}</small>
                    </div>
                </MenuItem>
            ))}
        </Menu>
    );

    // >>> *** person search
    const [personSearchTerms, setPersonSearchTerms] = useState("");
    const [doingPersonSearch, setDoingPersonSearch] = useState(false);
    const [acPersonResults, setACPersonResults] = useState([] as GraphAutocompleteResult[]);
    const personACOpts: TypeaheadProps<any> = {
        id: "search_persons",
        options: acPersonResults,
        labelKey: "name",
        onInputChange: (input, e) => {
            setPersonSearchTerms(input);
        },
        onChange: selected => {
            console.debug("selected", selected[0]);
        }
    };

    useEffect(() => {
        if (personSearchTerms.length < 2) {
            setDoingPersonSearch(false);
            return;
        }
        setDoingPersonSearch(true);
        axios.get<GraphAutocompleteResult[]>("/api/graphs/_search/persons", {
            params: {
                query: encodeURIComponent(personSearchTerms),
                _t: Date.now()
            }
        })
            .then(response => {
                setACPersonResults(response.data);
                setDoingPersonSearch(false);
            })
            .catch(error => {
                addToast(
                    error.toString(),
                    {
                        appearance: "error",
                        autoDismiss: true,
                    }
                );
                setACPersonResults([]);
            })

    }, [personSearchTerms]);

    // *** form population ***

    useEffect(() => {
        setDirect(parentType === "organisation");
    }, [parentType]);
    useEffect(() => {
        setRelType(direct ? "direct_financial" : "indirect_financial");
    }, [direct]);
    useEffect(() => {
        setStep2Opts(allOptions.get(relType) || [{value: "", text: ""}]);
    }, [relType]);

    // *** submission handling ***

    useEffect(() => {
        setFormSubmissionIcon(isSubmitting ? "spinner" : "plus");
    }, [isSubmitting]);

    function doAddRelationship(e: FormEvent) {
        e.preventDefault();
        if (relName.length < 2) {
            // for now just do by hand ... we'll replace with formik + yup or something
            addToast("Full name required", {
                autoDismiss: true,
                appearance: "warning"
            });
            e.stopPropagation();
            return;
        }

        setValidated(true);
        setIsSubmitting(true);
        let data: AddRelationshipDAO = {
            evidenceComments: (evidenceType === "comments"),
            evidenceFile: (evidenceType === "upload"),
            evidenceURL: evidenceURL,
            name: relName,
            relType: relType,
            relSubtype: relSubtype,
            comments: relComments,
        };
        axios.put<AddRelationshipDAO, AxiosResponse<string>>(
            `/api/graphs/clients/${props.metadata.id}/relationships`,
            data, {
                headers: {
                    authToken: authToken
                }
            }).then((r) => {
            console.debug(r);
            setIsSubmitting(false);
        })
            .catch((e: AxiosError) => {
                addToast("Error adding relationship", {
                    appearance: "error",
                    autoDismiss: true
                });
                setIsSubmitting(false);
            })
    }

    return (
        <>
            <Modal backdrop={"static"} show centered size={"xl"}>
                <Form id={"addRel"}
                      className={"form"}
                      noValidate validated={validated}
                      onSubmit={doAddRelationship}>
                    <Modal.Header closeButton onClick={() => hideModal()}>
                        <Modal.Title>Add relationship</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/*<Form.Group controlId="reportData.error_id">*/}
                        {/*    <Form.Label>Node ID</Form.Label>*/}
                        {/*    <Alert variant={"dark"} className={"text-muted"}>*/}
                        {/*        Adding a relationship to {props.metadata.type} {props.metadata.id}*/}
                        {/*    </Alert>*/}
                        {/*</Form.Group>*/}
                        {/*<Alert variant={"primary"}>*/}
                        {/*    PubCOI bases its COI definitions on those at*/}
                        {/*    the <a href={"https://www.ukri.org/about-us/our-structure/conflicts-of-interests/"}>UKRI*/}
                        {/*    website <FontAwesome name={"external-link"}/></a>*/}
                        {/*</Alert>*/}

                        {/*cards*/}
                        <Form.Group controlId="addRel.name">
                            <Form.Label>Relationship type</Form.Label>
                            <div>
                                <ToggleButtonGroup
                                    defaultValue={"person"}
                                    className={"w-100"}
                                    type={"radio"}
                                    name={"parentRelTypeRadio"}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setParentType(e.toString()); // blegh
                                    }}
                                    aria-label="relationship-type" size={"lg"}>
                                    <ToggleButton
                                        className={"w-50"}
                                        value={"person"}
                                        name={"parentRelType"}
                                        variant="outline-primary">
                                        <div className={"d-flex align-items-center justify-content-center"}>
                                            <FontAwesome name={"user"} className={"mr-2"}/> Person
                                        </div>
                                    </ToggleButton>
                                    <ToggleButton
                                        className={"w-50"}
                                        value={"organisation"}
                                        name={"parentRelType"}
                                        variant="outline-primary">
                                        <div className={"d-flex align-items-center justify-content-center"}>
                                            <FontAwesome name={"building-o"} className={"mr-2"}/> Organisation
                                        </div>
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </div>
                        </Form.Group>

                        {Boolean(!direct) && (
                            <Form.Group controlId="addRel.person_name">
                                <Form.Label>Full name</Form.Label>
                                <InputGroup>
                                    {/*<Form.Control*/}
                                    {/*    required={!direct}*/}
                                    {/*    placeholder={"Start typing to search..."}*/}
                                    {/*    type={"text"}*/}
                                    {/*    onChange={(*/}
                                    {/*        e: React.ChangeEvent<HTMLInputElement>*/}
                                    {/*    ): void => {*/}
                                    {/*        setRelName(e.target.value);*/}
                                    {/*        setPersonSearchTerms(e.target.value);*/}
                                    {/*    }}*/}
                                    {/*/>*/}
                                    <Typeahead className={"w-100"}
                                                  {...personACOpts} placeholder={"Start typing to search..."}
                                               isLoading={doingPersonSearch}
                                               renderMenu={
                                                   ((results, menuProps) =>
                                                           renderACResults(results, menuProps)
                                                   )}>
                                    </Typeahead>
                                </InputGroup>
                            </Form.Group>
                        )}

                        {Boolean(direct) && (
                            <Form.Group controlId="addRel.org_name">
                                <Form.Label>Organisation name</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        required={direct}
                                        placeholder={"Start typing to search..."}
                                        type={"text"}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ): void => {
                                            setOrgName(e.target.value)
                                        }}
                                    />
                                    <InputGroup.Append>
                                        <Button variant="outline-secondary"><FontAwesome name={"search"}
                                                                                         className={"mr-1"}/> search</Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Form.Group>
                        )}

                        <Form.Group controlId="addRel.relationship_type">
                            <Form.Label>Relationship type</Form.Label>
                            <Form.Control as={"select"}
                                          onChange={(
                                              e: React.ChangeEvent<HTMLSelectElement>
                                          ): void => {
                                              setRelType(e.target.value);
                                          }}>
                                {Boolean(direct) && (
                                    <>
                                        <option value={"direct_financial"}>Direct financial</option>
                                        <option value={"non_financial_professional"}>Non-financial professional</option>
                                        <option value={"non_financial_personal"}>Non-financial personal</option>
                                    </>
                                )}
                                {Boolean(!direct) && (
                                    <>
                                        <option value={"indirect_financial"}>Indirect financial</option>
                                        <option value={"indirect"}>Indirect (other)</option>
                                    </>
                                )}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="addRel.step2Opt">
                            <Form.Label>Subtype</Form.Label>
                            <Form.Control as={"select"}
                                          disabled={step2Opts.length === 1 && step2Opts[0].value === ""}
                                          onChange={(
                                              e: React.ChangeEvent<HTMLSelectElement>
                                          ): void => {
                                              setRelSubtype(e.target.value);
                                          }}>
                                {step2Opts.map(opt => (
                                    <option value={opt.value} key={`opt_${opt.value}`}>{opt.text}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="addRel.comments">
                            <Form.Label>Comments</Form.Label>
                            <Form.Control as={"textarea"}
                                          onChange={(
                                              e: React.ChangeEvent<HTMLTextAreaElement>
                                          ): void => {
                                              setRelComments(e.target.value);
                                          }}>
                            </Form.Control>
                            <div className={"text-muted small"}>
                                These comments will be public and cannot be changed later
                            </div>
                        </Form.Group>

                        <Form.Group controlId="addRel.evidence">
                            <Form.Label>Evidence</Form.Label>
                            <Form.Control as={"select"}
                                          onChange={(
                                              e: React.ChangeEvent<HTMLSelectElement>
                                          ): void => {
                                              setEvidenceType(e.target.value);
                                          }}>
                                <option value={"comments"}>I believe I have provided sufficient info in the comments
                                </option>
                                <option value={"url"}>I can provide a public link to the page / document</option>
                                <option value={"upload"}>I can upload evidence (Word / PDF / screenshot)</option>
                            </Form.Control>
                        </Form.Group>

                        {Boolean(evidenceType === "url") && (
                            <Form.Group controlId="addRel.evidence_url">
                                <Form.Label>URL</Form.Label>
                                <Form.Control
                                    onChange={(
                                        e: React.ChangeEvent<HTMLTextAreaElement>
                                    ): void => {
                                        setEvidenceURL(e.target.value);
                                    }}>
                                </Form.Control>
                                <div className={"text-muted small"}>
                                    This link will automatically be converted to a permanent
                                    URL by the Wayback Machine
                                </div>
                            </Form.Group>
                        )}

                        {Boolean(evidenceType === "upload") && (
                            <Form.Group controlId="addRel.evidence_file">
                                <Form.Label>File upload</Form.Label>
                                <Form.File
                                    id="addRel.evidence_file_element"
                                    label="Upload your file here"
                                    custom
                                />
                                <div className={"text-muted small"}>
                                    This file will be made public for others to verify the information you have provided
                                </div>
                            </Form.Group>
                        )}

                        <Form.Group controlId="addRel.ack">
                            <Form.Label>Acknowledgement</Form.Label>
                            <Form.Check
                                name={"acknowledgement"}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                    setIsAcknowledged(e.target.checked)
                                }}
                                className={"small"}
                                type="checkbox"
                                label="I acknowledge that any material statement I know to be false, or could not
                                 reasonably be held as true, could constitute libel. I understand that a permanent
                                 record will be made of my unique user ID, which can be mapped back to my email
                                 address should PubCOI be required to disclose any audit data by law."
                            />
                        </Form.Group>

                        {/*<Form.Group controlId={"addRel.searchPersons"}>*/}
                        {/*    <Form.Label>Search for person</Form.Label>*/}
                        {/*    <Form.Control*/}
                        {/*        onChange={(*/}
                        {/*            e: React.ChangeEvent<HTMLInputElement>*/}
                        {/*        ): void => {*/}
                        {/*            setPersonSearchTerms(e.target.value)*/}
                        {/*        }}/>*/}
                        {/*</Form.Group>*/}

                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="outline-secondary" disabled={isSubmitting}
                            onClick={() => hideModal()}>
                            Cancel
                        </Button>
                        <Button variant="success" type={"submit"} disabled={isSubmitting}>
                            <FontAwesome
                                name={formSubmissionIcon}
                                spin={isSubmitting} className={"mr-1"}/> Add
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
};