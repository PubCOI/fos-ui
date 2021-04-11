import React, {useEffect, useState} from "react";
import {SearchInfoBlock} from "../components/search/SearchInfoBlock";
import axios from "axios";
import {NoResultsBlock} from "../components/search/NoResultsBlock";
import {SearchResultWrapper} from "../components/search/SearchInterfaces";
import {SearchResultsBlock} from "../components/search/SearchResultsBlock";
import {useToasts} from "react-toast-notifications";

export const Search = (
    props: {
        groupBy: boolean,
        searchParams: string,
    }) => {

    const {addToast} = useToasts();
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    // stops multiple toasts from appearing in event of error
    const [errToastShown, setErrToastShown] = useState(false);
    const [results, setResults] = useState<SearchResultWrapper | undefined>(undefined);

    // store whether we've done any search at all ... if not just return generic info
    const [initialSearch, setInitialSearch] = useState(false);

    let url = "/api/search";

    useEffect(() => {
        if (props.searchParams === "") return;
        if (!initialSearch) setInitialSearch(true);

        axios.post<SearchResultWrapper>(url, {
            q: props.searchParams,
            groupResults: props.groupBy
        })
            .then(response => {
                setResults(response.data)
            })
            .then(() => setLoaded(true))
            .catch(() => {
                if (!errToastShown) {
                    setErrToastShown(true);
                    addToast("Error loading results", {
                        autoDismiss: true,
                        appearance: "error",
                        onDismiss: function() {
                            setErrToastShown(false);
                        }
                    });
                }
                setError(true)
            });
    }, [props.searchParams, props.groupBy]);

    let searchResults = (undefined !== results && results?.count > 0) ?
        <SearchResultsBlock data={results} aggregated={props.groupBy}/> :
        <NoResultsBlock/>;

    let searchResultBlock = (initialSearch ? searchResults : <SearchInfoBlock/>);

    return (
        <>
            {searchResultBlock}
            <div className={"my-5"}>&nbsp;</div>
        </>
    )
};