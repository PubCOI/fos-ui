import React, {Dispatch, FormEvent, MutableRefObject, SetStateAction, useEffect, useState} from 'react';
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
import {PaneContainer} from "./components/pane/PaneContainer";
import PaneContext from "./components/core/PaneContext";
import {ModalContainer} from "./components/ModalContainer";
import {GraphFilterBar} from "./components/graphs/GraphFilterBar";
import {SearchBar} from "./components/search/SearchBar";
import {INodeMetadata, NodeMetadataType} from "./interfaces/INodeMetadata";
import {IGraphConfig} from "./components/graphs/preferences/IGraphConfig";
import {TimebaseDataEnum} from "./components/graphs/preferences/TimebaseDataEnum";
import {ApplicationConfig} from "./interfaces/ApplicationConfig";
import {AddData} from "./pages/AddData";

function App() {

    const MODAL_EMPTY = <></>;
    function hideModal() {
        setShowModal(false);
        setModalBody(MODAL_EMPTY);
    }

    // ***** graph settings *****
    const [graphMetadata, setGraphMetadata] = useState<INodeMetadata>({type: NodeMetadataType.client, id: "", neo4j_id: "", clear_graph: false});
    const [graphConfig, setGraphConfig] = useState<IGraphConfig>({show_timebase_data: TimebaseDataEnum.recent});
    // ***** end graph settings *****

    // ***** application settings ******
    const [displayName, setDisplayName] = useState("");
    const [showRightPane, setShowRightPane] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalBody, setModalBody] = useState(MODAL_EMPTY);
    const [applicationConfig, setApplicationConfig] = useState<ApplicationConfig>({batch: false, debug: false, standalone: false});

    const applicationSettings = {
        config: applicationConfig,
        setApplicationConfig,
        displayName: displayName,
        setDisplayName: setDisplayName,
        showRightPane: showRightPane,
        setShowRightPane: setShowRightPane,
        modalBody: modalBody,
        setModalBody,
        hideModal,
        graphMetadata,
        setGraphMetadata,
        graphConfig,
        setGraphConfig
    };
    // ***** end application settings *****

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
        closePane,
    };
    // ***** end pane settings

    // ***** search settings
    // we're only passing up and down by one layer so no point setting up a separate context
    const [groupBy, setGroupBy] = useState(true);
    const [searchParams, setSearchParams] = useState("");
    const [searchType, setSearchType] = useState("contracts");
    const [submitSearchEvent, setSubmitSearchEvent] = useState<FormEvent<HTMLFormElement>>();
    // for persisting across renders
    const searchParamsRef = React.useRef("");
    const searchTypeRef = React.useRef("contracts");

    const [searchBarParams, setSearchBarParams] = useState<{
        initialParams: MutableRefObject<string>,
        searchType: MutableRefObject<string>,
        doSubmitHandler: Dispatch<SetStateAction<FormEvent<HTMLFormElement> | undefined>>,
        setParamsCallback: (queryParams: string) => void,
        setGroupByCallback: Dispatch<SetStateAction<boolean>>,
        setSearchTypeCallback: Dispatch<SetStateAction<string>>
    }>({
        initialParams: searchParamsRef,
        searchType: searchTypeRef,
        doSubmitHandler: setSubmitSearchEvent,
        setParamsCallback: setSearchParams,
        setGroupByCallback: setGroupBy,
        setSearchTypeCallback: setSearchType
    });
    // ***** end search settings

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
                    <Switch>
                        <Route exact path={"/graph"} component={GraphFilterBar}/>
                        <Route exact path={"/search"} render={() => <SearchBar {...searchBarParams} />}/>
                    </Switch>
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
                                <Route exact path={"/data/add"} component={AddData}/>
                                <Route exact path={"/graph"} component={Graph}/>
                                <Route exact path={"/search"} render={() => <Search groupBy={groupBy} searchParams={searchParams} searchType={searchType}/>}/>
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
