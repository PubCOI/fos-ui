import React, {useEffect, useRef, useState} from 'react';
import {useParams} from "react-router-dom";
import {CFViewerRouteParams} from "../interfaces/CFViewerRouteParams";
import {usePdf} from "@mikecousins/react-pdf";
import {Button, Col, Navbar, Row} from "react-bootstrap";
import {LoadingWrapper} from "../components/LoadingWrapper";

export const CFViewer = () => {
    let {attachment_id, page_number} = useParams<CFViewerRouteParams>();

    const [page, setPage] = useState(Number.parseInt(page_number));
    const [totalPages, setTotalPages] = useState(0);
    const canvasRef = useRef(null);
    const {pdfDocument, pdfPage} = usePdf({
        file: `/api/ui/view?attachment_id=${attachment_id}`,
        page,
        canvasRef
    });

    useEffect(() => {
        if (undefined === pdfDocument) return;
        setTotalPages(pdfDocument.numPages);
    }, [pdfDocument]);

    function updatePageViaRange(pageNumber: string) {
        setPage(Number.parseInt(pageNumber));
    }

    return (
        <>
            <Row noGutters className={"mt-3"}>
                <Col md={1}>
                    <div>&nbsp;</div>
                </Col>
                <Col md={10} className={"d-flex justify-content-center"}>
                    {!pdfDocument && <LoadingWrapper/>}
                    {pdfDocument && <canvas ref={canvasRef} className={"pdfCanvas shadow-lg"}/>}
                </Col>
                <Col md={1}>
                    <div>&nbsp;</div>
                </Col>
            </Row>
            {Boolean(pdfDocument && pdfDocument.numPages && totalPages > 1) && (
                <Navbar fixed={"bottom"} className={"mb-5 pdf-navigation"}>
                    <Col md={2}>
                        <Button block disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
                    </Col>
                    <Col md={8}>
                        <div className={"d-flex justify-content-between align-items-center"}>
                            <input type="range"
                                   className="custom-range mx-3"
                                   min="1" max={totalPages} step="1" id="pdfPage"
                                   value={page}
                                   onChange={(
                                       e: React.ChangeEvent<HTMLInputElement>
                                   ): void => updatePageViaRange(e.target.value)}
                            />
                        </div>
                    </Col>
                    <Col md={2} className={"d-flex justify-content-center"}>
                        <Button block disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
                    </Col>
                </Navbar>
            )}
        </>
    )
};