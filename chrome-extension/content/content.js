// Listen for the message from the background script
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'gazeData') {
        const xmlData = message.payload;
        parseAndUpdateCursor(xmlData);
    } else {
        console.log(message);
    }
});

// Listen for storage changes and initialize the UI state.
function initializeUIState() {
    chrome.storage.local.get(['extension_state'], (result) => {
        const state = result.extension_state || "disabled";
        updateUIState(state);
    });

    // Listen for changes to the "extension_state" key.
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === "local" && changes.extension_state) {
            const { newValue } = changes.extension_state;
            updateUIState(newValue);
        }
    });
}

function updateUIState(state) {
    const displayStyle = state === "enabled" ? "flex" : "none";
    setDisplay(customCursor, displayStyle);
    setDisplay(overlayContainer, displayStyle);
    setDisplay(toggleButton, displayStyle);
}

function setDisplay(element, displayStyle) {
    if (element) {
        element.style.display = displayStyle;
    }
}

initializeUIState();
