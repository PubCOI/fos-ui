import {Alert, Button, Form, InputGroup, Modal} from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import React, {FormEvent, useContext, useEffect, useState} from "react";
import AppContext from "../../core/AppContext";
import {useToasts} from "react-toast-notifications";
import firebase from "firebase";
import axios from "axios";
import {Typeahead, TypeaheadProps} from "react-bootstrap-typeahead";
import {RenderAutocompleteResults} from "../autocomplete/RenderAutocompleteResults";
import {GraphDetailedSearchResponseDTO} from "../../../generated/FosTypes";

export const MergeRecordsModal = (props: { id: string }) => {

    const {hideModal} = useContext(AppContext);
    const {addToast} = useToasts();
    const [hasSelectedUser, setHasSelectedUser] = useState(false);
    const [formSubmissionIcon, setFormSubmissionIcon] = useState("compress");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loaded, setLoaded] = useState(false);

    // auth
    const [authToken, setAuthToken] = useState("");
    useEffect(() => {
        firebase.auth().currentUser?.getIdToken(/* forceRefresh */ true)
            .then(function (idToken) {
                    setAuthToken(idToken);
                    setLoaded(true);
                }
            )
    }, [firebase.auth().currentUser]);

    useEffect(() => {
        setFormSubmissionIcon(isSubmitting ? "spinner" : "compress");
    }, [isSubmitting]);

    function doMergePersons(e: FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
    }

    const [personSearchTerms, setPersonSearchTerms] = useState("");
    const [doingPersonSearch, setDoingPersonSearch] = useState(false);
    const [acPersonResults, setAcPersonResults] = useState([] as GraphDetailedSearchResponseDTO[]);
    useEffect(() => {
        if (personSearchTerms.length < 2) {
            setDoingPersonSearch(false);
            return;
        }
        setDoingPersonSearch(true);
        axios.get<GraphDetailedSearchResponseDTO[]>("/api/graphs/_search/persons", {
            params: {
                query: encodeURIComponent(personSearchTerms),
                _t: Date.now(),
                details: true
            }
        })
            .then(response => {
                setAcPersonResults(response.data);
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
                setAcPersonResults([]);
            })

    }, [personSearchTerms]);
    const personAcOpts: TypeaheadProps<any> = {
        id: "search_persons",
        options: acPersonResults,
        labelKey: "name",
        onInputChange: (input, e) => {
            setPersonSearchTerms(input);
        },
        onChange: selected => {
            console.debug("selected", selected[0]);
            let sel = selected[0];
            if (undefined === sel) return;
            // setRelObjIsNew(sel.hasOwnProperty("customOption"));
            // setRelType(sel.hasOwnProperty("type") ? sel.type : "person");
            // setRelName(sel.hasOwnProperty("name") ? sel.name : sel.name);
            // setRelId(sel.hasOwnProperty("id") ? sel.id : "");
        }
    };

    return (
        <>
            <Modal backdrop={"static"} show centered size={"xl"}>
                <Form id={"mergePersons"}
                      className={"form"}
                      onSubmit={doMergePersons}>
                    <Modal.Header closeButton onClick={() => hideModal()}>
                        <Modal.Title>Merge person records</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        {Boolean(loaded && authToken) && (
                            <Alert variant={"secondary"}>
                                <p>
                                    If you believe there is another entry on this system for the same person,
                                    you can merge the records
                                </p>
                                <div>
                                    Note that the action of creating a merge will create a permanent record of
                                    the activity, associated with your user ID
                                </div>
                            </Alert>
                        )}

                        {Boolean(loaded && !authToken) && (
                            <Alert variant={"warning"}>
                                <p>You are not currently logged in</p>
                                <div>
                                    You will not be able to merge records unless you have logged in
                                </div>
                            </Alert>
                        )}

                        <Form.Group controlId={"addRel.searchPersons"}>
                            <Form.Label>Search for person</Form.Label>
                            <InputGroup>
                                <Typeahead className={"w-100"}
                                           {...personAcOpts} placeholder={"Start typing to search..."}
                                           isLoading={doingPersonSearch}
                                           renderMenu={
                                               ((results, menuProps) =>
                                                       <RenderAutocompleteResults results={results}
                                                                                  menuProps={menuProps}/>
                                               )}>
                                </Typeahead>
                            </InputGroup>
                            {/*<Form.Control*/}
                            {/*    placeholder={"Start typing to search"}*/}
                            {/*    type={"text"}*/}
                            {/*    onChange={(*/}
                            {/*        e: React.ChangeEvent<HTMLInputElement>*/}
                            {/*    ): void => {*/}
                            {/*        setPersonSearchTerms(e.target.value)*/}
                            {/*    }}/>*/}
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="outline-secondary" disabled={isSubmitting}
                            onClick={() => hideModal()}>
                            Cancel
                        </Button>
                        <Button
                            variant="success"
                            type={"submit"} disabled={isSubmitting || (!hasSelectedUser)}>
                            <FontAwesome
                                name={formSubmissionIcon}
                                spin={isSubmitting} className={"mr-1"}/> Merge
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
};