import {Link, NavLink, useHistory} from "react-router-dom";
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import {FirebaseAuthConsumer} from "@react-firebase/auth";
import React, {useContext, useEffect, useState} from "react";
import firebase from "firebase";
import AppContext from "./AppContext";
import FontAwesome from "react-fontawesome";

export const Header = () => {

    const [authenticated, setAuthenticated] = useState(false);
    useEffect(() => {
        setAuthenticated(null !== firebase.auth().currentUser);
    }, [firebase.auth().currentUser]);

    let pathname = window.location.pathname;
    useEffect(() => {
        pathname = window.location.pathname;
    }, [window.location.pathname]);

    return (
        <>
            <Navbar bg="dark" variant="dark" className={"shadow mb-3"} sticky={"top"} expand={"sm"}
                    collapseOnSelect>
                <Navbar.Brand as={NavLink} to={"/"} activeClassName={"active"}>pubcoi/fos</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {/*todo: toggle entire navbar when submenu clicked*/}
                        <NavDropdown title="Datasets" id="basic-nav-dropdown" data-toggle={"collapse"}>
                            <NavDropdown.Item as={NavLink} to={"/data/awards"}
                                              activeClassName={"active"}
                                              data-toggle={"collapse"}>Contract
                                Awards</NavDropdown.Item>
                            <NavDropdown.Item as={NavLink} to={"/data/clients"}
                                              activeClassName={"active"}
                                              disabled
                                              data-toggle={"collapse"}>Clients /
                                Commissioners</NavDropdown.Item>
                            <NavDropdown.Item as={NavLink} to={"/data/companies"}
                                              activeClassName={"active"}
                                              disabled
                                              data-toggle={"collapse"}>Companies</NavDropdown.Item>
                            <NavDropdown.Item as={NavLink} to={"/data/officers"}
                                              activeClassName={"active"}
                                              disabled
                                              data-toggle={"collapse"}>Officers</NavDropdown.Item>
                            <NavDropdown.Divider className={authenticated ? "" : "d-none"}/>
                            <NavDropdown.Item as={NavLink} to={"/data/upload"} className={authenticated ? "" : "d-none"}
                                              activeClassName={"active"}
                                              data-toggle={"collapse"}><FontAwesome name={"upload"} className={"mr-1"}/> Upload data</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link as={NavLink} to={"/graph"} data-toggle={"collapse"}
                                  activeClassName={"active"}
                                  active={pathname.includes("/graph")}
                                  eventKey={4}>Graph</Nav.Link>
                        <Nav.Link as={NavLink} to={"/tasks"} data-toggle={"collapse"}
                                  activeClassName={"active"}
                                  active={pathname.includes("/tasks")}
                                  eventKey={5}>Tasks</Nav.Link>
                    </Nav>
                    <Nav>
                        <LoginNavbar/>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    )
};

const LoginNavbar = () => {
    const history = useHistory();

    const appContext = useContext(AppContext);
    const [displayName, setDisplayName] = useState(appContext.displayName);

    useEffect(() => {
        setDisplayName(appContext.displayName);
    }, [appContext.displayName]);

    return (
        <FirebaseAuthConsumer>
            {({isSignedIn}) => {
                if (isSignedIn) {
                    return (
                        <>
                            <NavDropdown title={displayName}
                                         id="basic-nav-dropdown"
                                         data-toggle={"collapse"}
                                         alignRight>
                                <NavDropdown.Item as={Link} to={"/profile"}
                                                  data-toggle={"collapse"}>Settings</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to={"/"} data-toggle={"collapse"} onClick={() => {
                                    firebase.auth().signOut().then(r => {
                                        history.push("/");
                                    });
                                }}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </>
                    );
                } else {
                    return (<>
                        <Nav.Link as={Link} to={"/login"}>Log in</Nav.Link>
                    </>);
                }
            }}
        </FirebaseAuthConsumer>
    )
}