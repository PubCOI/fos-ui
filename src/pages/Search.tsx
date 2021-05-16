import React, {useEffect, useState} from "react";
import {SearchInfoBlock} from "../components/search/SearchInfoBlock";
import axios from "axios";
import {EmptyAttachmentSearchResponse} from "../components/search/EmptyAttachmentSearchResponse";
import {AttachmentsSearchResultsWrapper, InterestsSearchResultsWrapper} from "../components/search/SearchInterfaces";
import {AttachmentSearchResultsBlock} from "../components/search/AttachmentSearchResultsBlock";
import {useToasts} from "react-toast-notifications";
import {InterestsSearchResultsBlock} from "../components/search/InterestsSearchResultBlock";
import {EmptyInterestsSearchResponse} from "../components/search/EmptyInterestsSearchResponse";
import {useParams} from "react-router";

export enum SearchType {
    interests = "interests", contracts = "contracts"
}

export const Search = (
    props: {
        groupBy: boolean,
        searchParams: string
    }) => {
    let {searchType} = useParams<{ searchType: SearchType }>();
    const {addToast} = useToasts();
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    // stops multiple toasts from appearing in event of error
    const [errToastShown, setErrToastShown] = useState(false);
    const [attachmentsSearchResults, setAttachmentsResults] = useState<AttachmentsSearchResultsWrapper | undefined>(undefined);
    const [interestsSearchResults, setInterestsResults] = useState<InterestsSearchResultsWrapper | undefined>(undefined);

    // store whether we've done any search at all ... if not just return generic info
    const [doneInitialSearch, setDoneInitialSearch] = useState(false);

    useEffect(() => {
        if (props.searchParams === "") return;
        if (!doneInitialSearch) setDoneInitialSearch(true);
        if (searchType === SearchType.contracts) doContractSearch();
        if (searchType === SearchType.interests) doInterestsSearch();
    }, [props.searchParams, props.groupBy, searchType]);

    function doContractSearch() {
        axios.post<AttachmentsSearchResultsWrapper>("/api/search/attachments", {
            q: props.searchParams,
            groupResults: props.groupBy
        })
            .then(response => {
                setAttachmentsResults(response.data)
            })
            .then(() => setLoaded(true))
            .catch(() => {
                showError();
            });
    }

    function doInterestsSearch() {
        axios.post<InterestsSearchResultsWrapper>("/api/search/interests", {
            q: props.searchParams
        })
            .then(response => {
                setInterestsResults(response.data)
            })
            .then(() => setLoaded(true))
            .catch(() => {
                showError();
            });
    }

    function showError() {
        if (!errToastShown) {
            setErrToastShown(true);
            addToast("Error loading results", {
                autoDismiss: true,
                appearance: "error",
                onDismiss: function () {
                    setErrToastShown(false);
                }
            });
        }
        setError(true);
    }

    return (
        <>

            {Boolean(doneInitialSearch && searchType === SearchType.contracts) && (
                (undefined !== attachmentsSearchResults && attachmentsSearchResults?.count > 0) ?
                    <AttachmentSearchResultsBlock data={attachmentsSearchResults} aggregated={props.groupBy}/> :
                    <EmptyAttachmentSearchResponse/>
            )}

            {Boolean(doneInitialSearch && searchType === SearchType.interests) && (
                (undefined !== interestsSearchResults && interestsSearchResults?.count > 0) ?
                    <InterestsSearchResultsBlock data={interestsSearchResults}/> :
                    <EmptyInterestsSearchResponse/>
            )}

            {Boolean(!doneInitialSearch) && (
                <SearchInfoBlock type={searchType}/>
            )}

            <div className={"my-5"}>&nbsp;</div>
        </>
    )
};