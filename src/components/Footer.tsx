import {Navbar, NavbarBrand} from "react-bootstrap";
import React from "react";

export const Footer = () => {
    return (
        <>
            <div id={"footer-nav"}>
                <Navbar bg={"dark"} fixed={"bottom"}>
                    <NavbarBrand bsPrefix={"small"} className={"text-muted mr-auto"}>
                        &copy; 2021 PubCOI.org
                    </NavbarBrand>
                    {/*<Nav>*/}
                    {/*    <Nav.Link as={Link} to={"/privacy"} bsPrefix={"small"} className={"text-muted"}>Privacy</Nav.Link>*/}
                    {/*</Nav>*/}
                </Navbar>
            </div>
        </>
    )
};