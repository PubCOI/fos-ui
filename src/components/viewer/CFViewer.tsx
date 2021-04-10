import React, {useEffect, useRef, useState} from "react";
import {usePdf} from "@mikecousins/react-pdf";
import {Accordion, Alert, Button, Col, Navbar, Row} from "react-bootstrap";
import {LoadingWrapper} from "../LoadingWrapper";
import {useWindowSize} from "../../hooks/Utils";
import FontAwesome from "react-fontawesome";
import axios, {AxiosResponse} from "axios";
import {useToasts} from "react-toast-notifications";
import {AttachmentDAO} from "../../interfaces/AttachmentDAO";

export const CFViewer = (props: { attachment_id: string, page_number: string }) => {
    const {addToast} = useToasts();
    const size = useWindowSize();
    const [page, setPage] = useState(Number.parseInt(props.page_number || "1"));
    const [totalPages, setTotalPages] = useState(0);
    const canvasRef = useRef(null);
    const {pdfDocument, pdfPage} = usePdf({
        file: `/api/attachments/${props.attachment_id}/view`,
        page,
        canvasRef
    });
    const [showMetadata, setShowMetadata] = useState(false);
    const [metadata, setMetadata] = useState<AttachmentDAO>();

    useEffect(() => {
        axios.get<string, AxiosResponse<AttachmentDAO>>(`/api/attachments/${props.attachment_id}/metadata`)
            .then(d => {
                    setMetadata(d.data)
                }
            )
            .catch(e => {
                addToast("Error loading metadata", {
                    appearance: "error",
                    autoDismiss: true
                })
            })
    }, []);

    useEffect(() => {
        if (undefined === pdfDocument) return;
        setTotalPages(pdfDocument.numPages);
    }, [pdfDocument]);

    function updatePageViaRange(pageNumber: string) {
        setPage(Number.parseInt(pageNumber));
    }

    function toggleMetadata() {
        setShowMetadata(!showMetadata);
    }

    return (
        <>
            <div className={"pane-top"}>
                <Button
                    onClick={() => toggleMetadata()}
                    variant={"primary"}
                    size={"sm"}><FontAwesome name={showMetadata ? "caret-up" : "caret-down"} className={"mr-2"}/> View
                    Details</Button>
            </div>
            <Accordion.Collapse className={"pane-accordion-metadata mt-3"} eventKey={`${metadata?.id}`}
                                key={`_accordion_${metadata?.id}`} in={showMetadata}>
                <Alert variant={"dark"}>
                    <MetadataRow label={"Description"} value={metadata?.description}/>
                    <MetadataRow label={"Attachment ID"} value={metadata?.id}/>
                    <MetadataRow label={"Notice ID"} value={metadata?.noticeId}/>
                    <MetadataRow label={"Original format"} value={metadata?.mime}/>
                    <MetadataRow label={"Type"} value={metadata?.type}/>
                    <MetadataRow label={"URL"} value={metadata?.href}/>
                </Alert>
            </Accordion.Collapse>
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
                    <Col xs={1} sm={2}>
                        <Button className={"d-flex justify-content-center"} block disabled={page === 1}
                                onClick={() => setPage(page - 1)}>{(size.width >= 768) ? "Prev" :
                            <FontAwesome name={"caret-left"} fixedWidth/>}</Button>
                    </Col>
                    <Col xs={10} sm={8}>
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
                    <Col xs={1} sm={2} className={"d-flex justify-content-center"}>
                        <Button className={"d-flex justify-content-center"} block disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}>{(size.width >= 768) ? "Next" :
                            <FontAwesome name={"caret-right"} fixedWidth/>}</Button>
                    </Col>
                </Navbar>
            )}
        </>
    )
};

const MetadataRow = (props: { label: string, value: string | undefined }) => {
    return (
        <>
            <Row>
                <Col md={3}>{props.label}</Col>
                <Col className={"text-break"}>{(props.value ? props.value : "[undefined]")}</Col>
            </Row>
        </>
    )
}