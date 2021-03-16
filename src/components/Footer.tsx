import {Nav, Navbar, NavbarBrand} from "react-bootstrap";
import React, {useContext} from "react";
import {Link} from "react-router-dom";
import AppContext from "./core/AppContext";

export const Footer = () => {
    const {config} = useContext(AppContext);
    return (
        <>
            <div id={"footer-nav"}>
                <Navbar bg={"dark"} fixed={"bottom"}>
                    <NavbarBrand bsPrefix={"small"} className={"text-muted mr-auto"}>
                        &copy; 2021 PubCOI.org
                    </NavbarBrand>
                    <Nav>
                        <Nav.Link href={"https://github.com/PubCOI/fos"} className={"text-muted mx-2"} bsPrefix={"small"}>GitHub</Nav.Link>
                        <Nav.Link as={Link} to={"/stats"} className={`text-muted ${(config.batch) ? "" : "d-none"}`} bsPrefix={"small"}>Stats</Nav.Link>
                    </Nav>
                </Navbar>
            </div>
        </>
    )
};