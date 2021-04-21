import React, {useEffect, useState} from "react";
import {SearchInfoBlock} from "../components/search/SearchInfoBlock";
import axios from "axios";
import {EmptyAttachmentSearchResponse} from "../components/search/EmptyAttachmentSearchResponse";
import {AttachmentSearchResultWrapper} from "../components/search/SearchInterfaces";
import {AttachmentSearchResultsBlock} from "../components/search/AttachmentSearchResultsBlock";
import {useToasts} from "react-toast-notifications";

export const Search = (
    props: {
        groupBy: boolean,
        searchParams: string,
        searchType: string
    }) => {

    const {addToast} = useToasts();
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    // stops multiple toasts from appearing in event of error
    const [errToastShown, setErrToastShown] = useState(false);
    const [attachmentSearchResults, setAttachmentResults] = useState<AttachmentSearchResultWrapper | undefined>(undefined);

    // store whether we've done any search at all ... if not just return generic info
    const [doneInitialSearch, setDoneInitialSearch] = useState(false);

    useEffect(() => {
        if (props.searchParams === "") return;
        if (!doneInitialSearch) setDoneInitialSearch(true);
        if (props.searchType === "contracts") {
            return doContractSearch();
        }
        if (props.searchType === "interests") {
            return doInterestsSearch();
        }
    }, [props.searchParams, props.groupBy, props.searchType]);

    useEffect(() => {
        console.debug("Updated search type to", props.searchType);
    }, [props.searchType]);

    function doContractSearch() {
        axios.post<AttachmentSearchResultWrapper>("/api/search/attachments", {
            q: props.searchParams,
            groupResults: props.groupBy
        })
            .then(response => {
                setAttachmentResults(response.data)
            })
            .then(() => setLoaded(true))
            .catch(() => {
                showError();
            });
    }

    function doInterestsSearch() {
        console.log("would do interests");
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

            {Boolean(doneInitialSearch && props.searchType === "contracts") && (
                (undefined !== attachmentSearchResults && attachmentSearchResults?.count > 0) ?
                    <AttachmentSearchResultsBlock data={attachmentSearchResults} aggregated={props.groupBy}/> :
                    <EmptyAttachmentSearchResponse/>
            )}

            {Boolean(doneInitialSearch && props.searchType === "interests") && (
                <>
                    would return interests
                </>
            )}

            {Boolean(!doneInitialSearch) && (
                <SearchInfoBlock type={props.searchType}/>
            )}

            <div className={"my-5"}>&nbsp;</div>
        </>
    )
};