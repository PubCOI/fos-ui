import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import {ToastProvider} from "react-toast-notifications";
import firebase from "firebase/app";
import "firebase/auth";
import {FirebaseAuthProvider} from "@react-firebase/auth";
import {FosToastContainer} from "./components/FosToastContainer";

const firebaseConfig = {
    apiKey: "AIzaSyBa1sFm8_wRGIv8y0-iaK5h48bwlJZMqX8",
    authDomain: "pubcoi-fos.firebaseapp.com",
    databaseURL: "https://pubcoi-fos.firebaseio.com",
    projectId: "pubcoi-fos",
    storageBucket: "pubcoi-fos.appspot.com",
    messagingSenderId: "76176716491",
    appId: "1:76176716491:web:b92728b5dbecfc5399e14e"
};

ReactDOM.render(
    <React.StrictMode>
        <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
            <BrowserRouter>
                <ToastProvider components={{ToastContainer: FosToastContainer}}>
                    <App/>
                </ToastProvider>
            </BrowserRouter>
        </FirebaseAuthProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
