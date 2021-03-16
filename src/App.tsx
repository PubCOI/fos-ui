import React, {useEffect, useState} from 'react';
import './App.css';
import "react-datetime/css/react-datetime.css";
import "firebase/auth";
import {Route, Switch, withRouter} from 'react-router-dom';
import "bootswatch/dist/cosmo/bootstrap.min.css";
import {Header} from "./components/Header";
import {Login} from "./pages/Login";
import {Awards} from "./pages/Awards";
import {Container, Modal} from "react-bootstrap";
import {About} from "./pages/About";
import {Tasks} from "./pages/Tasks";
import {Home} from "./pages/Home";
import {Footer} from "./components/Footer";
import {Profile} from "./pages/Profile";
import AppContext from "./components/core/AppContext";
import {ContextPopulator} from "./components/ContextPopulator";
import {Upload} from "./pages/Upload";
import {Graph} from "./pages/Graph";
import {Search} from "./pages/Search";
import {Viewer} from "./pages/Viewer";
import {Stats} from "./pages/Stats";
import "react-sliding-pane/dist/react-sliding-pane.css";
import {PaneContainer} from "./components/pane/PaneContainer";
import PaneContext from "./components/core/PaneContext";
import {ModalContainer} from "./components/ModalContainer";

function App() {

    const MODAL_EMPTY = <></>;
    function hideModal() {
        setShowModal(false);
        setModalBody(MODAL_EMPTY);
    }

    // ***** application ******
    const [displayName, setDisplayName] = useState("");
    const [showRightPane, setShowRightPane] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalBody, setModalBody] = useState(MODAL_EMPTY);

    const applicationSettings = {
        displayName: displayName,
        setDisplayName: setDisplayName,
        showRightPane: showRightPane,
        setShowRightPane: setShowRightPane,
        modalBody: modalBody,
        setModalBody,
        hideModal
    };
    // &&&&& end application settings

    // ***** pane settings *****
    const [paneTitle, setPaneTitle] = useState("");
    const [paneSubtitle, setPaneSubtitle] = useState("");
    const [paneContents, setPaneContents] = useState(<>[null]</>);
    function openPane() {
        setShowRightPane(true);
    }
    function closePane() {
        setShowRightPane(false);
        setPaneTitle("");
        setPaneSubtitle("");
        setPaneContents(<></>);
    }
    const paneSettings = {
        paneTitle: paneTitle,
        setPaneTitle,
        paneSubtitle: paneSubtitle,
        setPaneSubtitle,
        paneContents: paneContents,
        setPaneContents,
        openPane,
        closePane
    };
    // ***** end pane settings

    useEffect(() => {
        if (undefined !== modalBody && modalBody !== MODAL_EMPTY) {
            setShowModal(true);
        }
    }, [modalBody]);

    return (
        <>
            <AppContext.Provider value={applicationSettings}>
                <PaneContext.Provider value={paneSettings}>
                    <ContextPopulator/>
                    <PaneContainer/>
                    <Header/>
                    <Container fluid className={"p-0"}>
                        <main role={"main"}>
                            <Switch>
                                <Route exact path={"/"} component={Home}/>
                                <Route exact path={"/login"} component={Login}/>
                                <Route exact path={"/data/awards"} component={Awards}/>
                                <Route exact path={"/about"} component={About}/>
                                <Route exact path={"/tasks"} component={Tasks}/>
                                <Route exact path={"/profile"} component={Profile}/>
                                <Route exact path={"/data/upload"} component={Upload}/>
                                <Route exact path={"/graph"} component={Graph}/>
                                <Route exact path={"/search"} component={Search}/>
                                <Route exact path={"/stats"} component={Stats}/>
                                <Route path={"/view"} component={Viewer}/>
                            </Switch>
                        </main>
                    </Container>
                    <Footer/>
                    <ModalContainer modalBody={modalBody}/>
                </PaneContext.Provider>
            </AppContext.Provider>
        </>
    );
}

export default withRouter(App);
