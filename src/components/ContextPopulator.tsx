import {useContext, useEffect, useState} from "react";
import firebase from "firebase";
import axios from "axios";
import {FosUserInfo} from "../interfaces/FosUserInfo";
import AppContext from "./AppContext";
import {useToasts} from "react-toast-notifications";

export const ContextPopulator = () => {

    const [globalIsSignedIn, setGlobalIsSignedIn] = useState(false);
    const [fosUserInfo, setFosUserInfo] = useState<FosUserInfo>({displayName: ""});
    const {addToast} = useToasts();
    const appContext = useContext(AppContext);

    firebase.auth().onAuthStateChanged(function (user) {
        setGlobalIsSignedIn(null !== user);
    });

    useEffect(() => {
        if (globalIsSignedIn) {
            firebase.auth().currentUser?.getIdToken(/* forceRefresh */ true).then(function (idToken) {
                axios.post<FosUserInfo>("/api/ui/user", {authToken: idToken})
                    .then(r => {
                        setFosUserInfo(r.data);
                    })
                    .catch(reason => {
                        addToast(reason.toString(), {
                            appearance: "error",
                            autoDismiss: true,
                        });
                    })
            }).catch(function (error) {
                addToast(
                    error.toString(),
                    {
                        appearance: "error",
                        autoDismiss: true,
                    }
                )
            });
        }
    }, [globalIsSignedIn]);

    useEffect(() => {
        appContext.setDisplayName(fosUserInfo.displayName);
    }, [fosUserInfo.displayName]);

    return (
        <>
        </>
    )
}