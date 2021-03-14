import React from "react";
import {Modal} from "react-bootstrap";
import {hide} from "react-functional-modal";

export const FixWidgetModal = () => {
    return (
        <>
            <Modal backdrop={"static"} show centered>
                <Modal.Header closeButton onClick={() => hide(FixWidgetModal.name)}>
                    <Modal.Title>Report data issue</Modal.Title>
                </Modal.Header>
            </Modal>
        </>
    )
};