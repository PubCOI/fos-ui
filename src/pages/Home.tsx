import React from "react";
import FontAwesome from "react-fontawesome";
import {Link} from "react-router-dom";
import {PageTitle} from "../components/PageTitle";

export const Home = () => {
    return (
        <>
            <PageTitle title={"What is Fos?"}/>
            <div className={"svgTest"}>
                &#xf007;
            </div>
            <p>
                Fos is a semi-automated, crowdsourced database of HMG contract data, focusing on (but not limited to)
                healthcare contracts.
            </p>
            <p>
                Fos is part of a wider set of tools that are being developed through the
                parent <a href="https://pubcoi.org" target="_blank" rel={"noreferrer"}>PubCOI.org <FontAwesome name={"external-link"}/></a> project.
            </p>
            <p>
                All of the solutions for data processing are strictly open-source and released on our
                public <a href={"https://github.com/PubCOI"} target={"_blank"} rel={"noreferrer"}>GitHub page <FontAwesome name={"external-link"}/></a>.
            </p>
            <h3>How can I help?</h3>
            <p>
                Thanks for asking! All of the outstanding 'tasks' needing a precious pair of human eyes are listed on
                the <Link to={"/tasks"}>tasks</Link> page. Each of these is usually a ten-second job: clicking to verify
                that a company on file is the same as <em>x</em> company in Companies House, etc. Sometimes the tasks
                are more involved though, but if you're anything like me / us, that's all part of the fun ...
            </p>
            <p>
                If you're a developer, head over to the GitHub page, download the source, and get hacking! Contact the
                project on <a href={"mailto:info@pubcoi.org"}>info@pubcoi.org</a> if you have issues getting up and running.
            </p>
            <h3>Credits</h3>
            <p>
                We are indebted to <a href={"https://opencorporates.com"} target={"_blank"} rel={"noreferrer"}>OpenCorporates <FontAwesome name={"external-link"}/></a> for
                access to their corporate info database. It makes cross-referencing data on Companies House (approximately) a 1&times;10<sup>6</sup> times easier.
            </p>
        </>
    )
};