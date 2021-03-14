import React, {useState} from 'react';
import './App.css';
import "react-datetime/css/react-datetime.css";
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
import AppContext from "./components/core/AppContext";
import {ContextPopulator} from "./components/ContextPopulator";
import {Upload} from "./pages/Upload";
import {Graph} from "./pages/Graph";
import {Search} from "./pages/Search";
import {Viewer} from "./pages/Viewer";
import {Stats} from "./pages/Stats";
import "react-sliding-pane/dist/react-sliding-pane.css";
import {PaneContainer} from "./components/PaneContainer";
import PaneContext from "./components/core/PaneContext";

function App() {

    // ***** application ******
    const [displayName, setDisplayName] = useState("");
    const [showRightPane, setShowRightPane] = useState(false);

    const applicationSettings = {
        displayName: displayName,
        setDisplayName: setDisplayName,
        showRightPane: showRightPane,
        setShowRightPane: setShowRightPane
    };
    // &&&&& end application settings

    // ***** pane settings *****
    const [paneTitle, setPaneTitle] = useState("");
    const [paneSubtitle, setPaneSubtitle] = useState("");
    const [paneContents, setPaneContents] = useState(<></>);
    function openPane() {
        setShowRightPane(true);
    }
    function closePane() {
        setPaneTitle("");
        setPaneSubtitle("");
        setPaneContents(<>[null]</>)
        setShowRightPane(false);
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

    return (
        <>
            <AppContext.Provider value={applicationSettings}>
                <PaneContext.Provider value={paneSettings}>
                    <ContextPopulator/>
                    <PaneContainer/>
                    <Header/>
                    <Container fluid>
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
                </PaneContext.Provider>
            </AppContext.Provider>
        </>
    );
}

export default withRouter(App);
