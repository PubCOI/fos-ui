import Dropzone, {IFileWithMeta} from "react-dropzone-uploader";
import React, {useEffect, useState} from "react";
import {StatusValue} from "react-dropzone-uploader/dist/Dropzone";
import {useToasts} from "react-toast-notifications";
import firebase from "firebase";
import {LoadingWrapper} from "./LoadingWrapper";
import {Alert} from "react-bootstrap";
import FontAwesome from "react-fontawesome";

export const FOSDropZone = () => {
    const {addToast} = useToasts();

    const [authToken, setAuthToken] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        firebase.auth().currentUser?.getIdToken(/* forceRefresh */ true).then(function (idToken) {
            setAuthToken(idToken);
        });
    }, [firebase.auth().currentUser]);

    useEffect(() => {
        setLoaded(authToken !== "");
    }, [authToken]);

    const getUploadParams = () => {
        const url = "/api/ui/data/contracts";
        const fields = {
            authToken: authToken
        };
        return {url, fields}
    };

    const handleChangeStatus = ( file: IFileWithMeta, status: StatusValue) => {
        switch (status) {
            case "rejected_file_type":
            case "rejected_max_files":
            case "error_file_size":
            case "error_validation":
            case "error_upload":
            case "error_upload_params":
            case "exception_upload":
            case "aborted":
                addToast('Error with code: ' + status, {
                    autoDismiss: true,
                    appearance: "error"
                });
                break;
            case "started":
            case "uploading":
                addToast('Uploading ...', {
                    autoDismiss: true,
                    appearance: "info"
                });
                break;
            case "getting_upload_params":
            case "restarted":
            case "removed":
            case "preparing":
            case "ready":
            case "headers_received":
                break;
            case "done":
                setSuccess(true);
                addToast('Uploaded: note processing can take some time', {
                    autoDismiss: true,
                    appearance: "success"
                });
                break;
        }
    };

    const handleSubmit = (files: IFileWithMeta[], allFiles: IFileWithMeta[]) => {
        allFiles.forEach(f => f.remove());
    };

    if (!loaded) {
        return <LoadingWrapper/>
    }

    return (
        <>
        <Dropzone
            getUploadParams={getUploadParams}
            onChangeStatus={handleChangeStatus}
            onSubmit={handleSubmit}
            accept="application/xml,.xml"
            inputContent={(files, { reject }) => (reject ? "XML files only" : "Drag Contracts XML here")}
            maxFiles={1}
            multiple={false}
            addClassNames={{
                dropzone: "form-group p-2 px-3 block",
                input: "form-control-file",
                submitButtonContainer: "d-none"
            }}
            canRemove={true}
            styles={{
                dropzone: { borderColor: "#CCC", borderStyle: "dashed" },
                dropzoneActive: { borderColor: "green" },
                dropzoneReject: { borderColor: "red", backgroundColor: "#DAA" },
            }}
        />
        <Alert variant={"success"} show={success}>
            <div className={"lead"}><FontAwesome name={"check-circle"} className={"mr-1"}/> Uploaded</div>
            <div>
                Records will start appearing over the next few hours
            </div>
        </Alert>
        </>
    )
}