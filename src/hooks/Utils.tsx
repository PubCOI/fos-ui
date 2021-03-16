import React, { useState, useEffect } from 'react';
import {Tooltip} from "react-bootstrap";

// by @gabe_ragland from https://usehooks.com/useWindowSize/

export const renderTooltip = (props: { text: string }) => (
    <Tooltip id="button-tooltip" {...props}>
        {props.text}
    </Tooltip>
);

export function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    // RM however in our case we're not using SSG (yet ...)
    const [windowSize, setWindowSize] = useState({
        width: -1,
        height: -1,
    });

    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount

    return windowSize;
}