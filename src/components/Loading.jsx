import React from "react";

function Loading({ message = "Loading..." }) {
    return (
        <div className="loading-container" data-testid="loading">
            <div className="loading-spinner"></div>
            <span>{message}</span>
        </div>
    );
}

export default Loading;
