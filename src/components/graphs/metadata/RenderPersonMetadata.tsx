import {useToasts} from "react-toast-notifications";
import {useState} from "react";
import {PersonDAO} from "../../../interfaces/DAO/PersonDAO";

export const RenderPersonMetadata = (props: { id: string }) => {
    const {addToast} = useToasts();
    const [person, setPerson] = useState<PersonDAO>({
        id: "",
        commonName: ""
    });

    return (
        <>

        </>
    )
};