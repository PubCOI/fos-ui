import {Alert, Button, Form, Modal} from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import React, {FormEvent, useContext, useEffect, useState} from "react";
import AppContext from "../../core/AppContext";
import {useToasts} from "react-toast-notifications";

export const MergeRecordsModal = (props: { id: string }) => {

    const {hideModal} = useContext(AppContext);
    const {addToast} = useToasts();
    const [personSearchTerms, setPersonSearchTerms] = useState("");
    const [hasSelectedUser, setHasSelectedUser] = useState(false);
    const [formSubmissionIcon, setFormSubmissionIcon] = useState("compress");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setFormSubmissionIcon(isSubmitting ? "spinner" : "compress");
    }, [isSubmitting]);

    function doMergePersons(e: FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
    }

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

                        <Alert variant={"secondary"}>
                            If you believe there is another entry for the same person, you can search for the
                            person by name and merge them through here
                        </Alert>

                        <Form.Group controlId={"addRel.searchPersons"}>
                            <Form.Label>Search for person</Form.Label>
                            <Form.Control
                                placeholder={"Start typing to search"}
                                type={"text"}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ): void => {
                                    setPersonSearchTerms(e.target.value)
                                }}/>
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
}