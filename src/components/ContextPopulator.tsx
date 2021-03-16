import {useContext, useEffect, useState} from "react";
import firebase from "firebase";
import axios, {AxiosResponse} from "axios";
import AppContext from "./core/AppContext";
import {useToasts} from "react-toast-notifications";
import {UpdateProfileRequestDAO, UpdateProfileResponseDAO} from "../interfaces/DAO/UserDAO";
import {ApplicationConfig} from "../interfaces/ApplicationConfig";

export const ContextPopulator = () => {

    const [globalIsSignedIn, setGlobalIsSignedIn] = useState(false);
    const [fosUserInfo, setFosUserInfo] = useState<UpdateProfileResponseDAO>({displayName: "", uid: ""});
    const {addToast} = useToasts();
    const appContext = useContext(AppContext);

    firebase.auth().onAuthStateChanged(function (user) {
        setGlobalIsSignedIn(null !== user);
    });

    useEffect(() => {
        if (globalIsSignedIn) {
            firebase.auth().currentUser?.getIdToken(/* forceRefresh */ true).then(function (idToken) {
                axios.post<UpdateProfileRequestDAO, AxiosResponse<UpdateProfileResponseDAO>>("/api/ui/user", {}, {
                    headers: {
                        authToken: idToken
                    }
                })
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
    }, [fosUserInfo]);

    useEffect(() => {
        axios.get<string, AxiosResponse<ApplicationConfig>>("/api/status")
            .then((r) => {
                appContext.setApplicationConfig(r.data);
            })
            .catch((error) => {
                addToast("Loading application status failed: " + error.toString(), {
                        appearance: "error",
                        autoDismiss: true
                    }
                )
            })
    }, []);

    return (
        <>
        </>
    )
};