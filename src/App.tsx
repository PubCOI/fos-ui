import React, {useContext, useEffect, useState} from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import {Route, Switch, withRouter} from 'react-router-dom';
import "bootswatch/dist/cosmo/bootstrap.min.css";
import {Header} from "./components/Header";
import {Login} from "./pages/Login";
import {Awards} from "./pages/Awards";
import {Container} from "react-bootstrap";
import {About} from "./pages/About";
import {Tasks} from "./pages/Tasks";
import {Home} from "./pages/Home";
import {Footer} from "./components/Footer";
import {Profile} from "./pages/Profile";
import AppContext from "./components/AppContext";
import {ContextPopulator} from "./components/ContextPopulator";

function App() {

    const [displayName, setDisplayName] = useState("");
    const userSettings = {
        displayName: displayName,
        setDisplayName,
    };

    return (
        <>
            <AppContext.Provider value={userSettings}>
                <ContextPopulator/>
                <Header/>
                <Container fluid className={"mb-5"}>
                    <main role={"main"}>
                        <Switch>
                            <Route exact path={"/"} component={Home}/>
                            <Route exact path={"/login"} component={Login}/>
                            <Route exact path={"/data/awards"} component={Awards}/>
                            <Route exact path={"/about"} component={About}/>
                            <Route exact path={"/tasks"} component={Tasks}/>
                            <Route exact path={"/profile"} component={Profile}/>
                        </Switch>
                    </main>
                </Container>
                <Footer/>
            </AppContext.Provider>
        </>
    );
}

export default withRouter(App);
