import React, {useState} from "react";
import {Alert, Col, Container} from "react-bootstrap";
import {AddDataForm} from "../components/addData/AddDataForm";
import {CFSearchResponse} from "../components/addData/AddDataInterfaces";

export const AddData = () => {

    const [searchResponse, setSearchResponse] = useState<CFSearchResponse>();

    return (
        <>
            <Container fluid className={"p-3"}>

                <Col md={10} className={"offset-md-1 mt-md-4"}>
                    <div className={"shadow p-4 rounded"}>
                        <h3>Add new contract data</h3>
                        <AddDataForm setSearchResponseCallback={setSearchResponse}/>
                    </div>
                </Col>

            </Container>
        </>
    )
};