import {Link, useHistory} from "react-router-dom";
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import {FirebaseAuthConsumer} from "@react-firebase/auth";
import React from "react";
import FontAwesome from "react-fontawesome";
import firebase from "firebase";

export const Header = () => {
    return (
        <>
            <Navbar bg="dark" variant="dark" className={"shadow mb-3"} sticky={"top"} expand={"sm"}
                    collapseOnSelect>
                <Navbar.Brand as={Link} to={"/"}>pubcoi/fos</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {/*todo: toggle entire navbar when submenu clicked*/}
                        <NavDropdown title="Datasets" id="basic-nav-dropdown" data-toggle={"collapse"}>
                            <NavDropdown.Item as={Link} to={"/data/awards"} data-toggle={"collapse"}>Contract Awards</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={"/data/clients"} data-toggle={"collapse"}>Clients / Commissioners</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={"/data/companies"} data-toggle={"collapse"}>Companies</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={"/data/officers"} data-toggle={"collapse"}>Officers</NavDropdown.Item>
                            {/*<NavDropdown.Divider />*/}
                            {/*<NavDropdown.Item href="#action/3.4">Add your own</NavDropdown.Item>*/}
                        </NavDropdown>
                        <Nav.Link as={Link} to={"/graph"} data-toggle={"collapse"} eventKey={4}>Graph</Nav.Link>
                        <Nav.Link as={Link} to={"/tasks"} data-toggle={"collapse"} eventKey={5}>Tasks</Nav.Link>
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
    return (
        <FirebaseAuthConsumer>
            {({isSignedIn, user, providerId}) => {
                if (isSignedIn) {
                    return (<Nav.Link onClick={() => {
                        firebase.auth().signOut();
                        history.push("/");
                    }}>{user.email} <FontAwesome name={"user-circle-o"}
                                                 className={"ml-1 d-none d-sm-inline"}/></Nav.Link>);
                } else {
                    return (<>
                        <Nav.Link as={Link} to={"/login"}>Log in</Nav.Link>
                    </>);
                }
            }}
        </FirebaseAuthConsumer>
    )
}