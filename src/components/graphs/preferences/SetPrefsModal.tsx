import React, {useContext} from "react";
import AppContext from "../../core/AppContext";
import {Alert, Col, Form, Modal, Row} from "react-bootstrap";
import {TimebaseDataEnum} from "./TimebaseDataEnum";

export const SetPrefsModal = () => {

    const {hideModal, showRightPane, graphConfig, setGraphConfig} = useContext(AppContext);

    function updateTimeData(timebase: TimebaseDataEnum) {
        setGraphConfig({show_timebase_data: timebase});
    }

    return (
        <>
            <Modal backdrop={"static"} show centered size={"xl"} enforceFocus={!showRightPane}>
                <Modal.Header closeButton onClick={() => hideModal()}>
                    <Modal.Title>Graph Preferences</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <fieldset>
                            <Row>
                                <Col>
                                    <Alert variant={"dark"} className={"small mb-1"}>Some data (eg company
                                        relationships) are time-bound. We can show you <em>all</em> the data, but
                                        recommend only displaying the most recent data.</Alert>
                                </Col>
                            </Row>
                            <Form.Group as={Row}>
                                <Form.Label as="legend" column sm={2}>
                                    Time-based data
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Check
                                        type="radio"
                                        label="Only show current relationships"
                                        name="timeData"
                                        id="timeData_current"
                                        defaultChecked={graphConfig.show_timebase_data as TimebaseDataEnum === TimebaseDataEnum.current}
                                        data-td={TimebaseDataEnum.current}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            updateTimeData(e.target.getAttribute("data-td") as TimebaseDataEnum);
                                        }}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Show any relationships within last 3 years"
                                        name="timeData"
                                        id="timeData_recent"
                                        defaultChecked={graphConfig.show_timebase_data as TimebaseDataEnum === TimebaseDataEnum.recent}
                                        data-td={TimebaseDataEnum.recent}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            updateTimeData(e.target.getAttribute("data-td") as TimebaseDataEnum);
                                        }}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Show all relationships"
                                        name="timeData"
                                        id="timeData_all"
                                        defaultChecked={graphConfig.show_timebase_data as TimebaseDataEnum === TimebaseDataEnum.all}
                                        data-td={TimebaseDataEnum.all}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            updateTimeData(e.target.getAttribute("data-td") as TimebaseDataEnum);
                                        }}
                                    />
                                </Col>
                            </Form.Group>

                        </fieldset>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
};
