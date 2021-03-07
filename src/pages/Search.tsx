import React, {FormEvent, useEffect, useState} from "react";
import {SearchInfoBlock} from "../components/search/SearchInfoBlock";
import axios from "axios";
import {SearchBar} from "../components/search/SearchBar";
import {NoResultsBlock} from "../components/search/NoResultsBlock";
import {SearchResultWrapper} from "../components/search/SearchInterfaces";
import {SearchResultsBlock} from "../components/search/SearchResultsBlock";

export const Search = () => {

    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [results, setResults] = useState<SearchResultWrapper | undefined>(undefined);

    // is passed off to child handler to populate
    const [searchParams, setSearchParams] = useState("");

    // store whether we've done any search at all ... if not just return generic info
    const [initialSearch, setInitialSearch] = useState(false);

    const [aggregated, setAggregated] = useState(true);

    let url = "/api/ui/search";

    useEffect(() => {
        if (searchParams === "") return;
        if (!initialSearch) setInitialSearch(true);

        axios.post<SearchResultWrapper>(url, {
            q: searchParams,
            groupResults: aggregated
        })
            .then(response => {
                setResults(response.data)
            })
            .then(() => setLoaded(true))
            .catch(() => setError(true));
    }, [searchParams, aggregated]);

    function submitHandler(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setInitialSearch(true);
    }

    let searchResults = (undefined !== results && results?.results > 0) ? <SearchResultsBlock data={results} aggregated={aggregated}/> :
        <NoResultsBlock/>;

    let searchResultBlock = (initialSearch ? searchResults : <SearchInfoBlock/>);

    return (
        <>
            <SearchBar
                setGroupBy={setAggregated}
                doSubmitCallback={submitHandler}
                setParamsCallback={setSearchParams}/>
            {searchResultBlock}
        </>
    )
};