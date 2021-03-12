import React, {useEffect, useState} from "react";
import {ClientResponseDAO} from "./ClientResponseDAO";
import {useToasts} from "react-toast-notifications";
import {isValid, toNormalised} from "postcode";
import axios from "axios";

export const RenderClientMetadata = (props: { id: string }) => {
    let baseURL = `/api/ui/graphs/clients/${props.id}`;
    const [client, setClient] = useState<ClientResponseDAO>({
        id: "",
        name: "",
        postCode: "",
        tenderCount: -1,
        normalisedPostCode: ""
    });
    const {addToast} = useToasts();
    useEffect(() => {
        axios.get<ClientResponseDAO>(baseURL).then(response => {
            let resp = Object.assign(response.data, processResponse(response.data));
            setClient(resp);
        })
            .then(() => {
            })
            .catch((e) => {
                addToast(`Error, unable to load data`, {
                    appearance: "error",
                    autoDismiss: true,
                });
            });

    }, [props.id]);

    function processResponse(data: ClientResponseDAO) {
        return {
            // append this to response object
            normalisedPostCode: (undefined !== data.postCode && data.postCode) ?
                (isValid(client?.postCode) ? toNormalised(client?.postCode as string) : client?.postCode) : ""
        };
    }


    return (
        <>
            <div className={"my-2"}>{client.name} (<a
                href={"https://www.openstreetmap.org/search?query=" + client.postCode} target={"_blank"}
                rel={"noreferrer"}>{client.normalisedPostCode}</a>)
            </div>

            <div>{client.tenderCount} tender{(client.tenderCount > 1 ? "s" : "")} granted</div>

        </>
    );
};