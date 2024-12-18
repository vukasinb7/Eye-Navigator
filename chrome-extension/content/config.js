let hoverTime;
let screenWidth;
let screenHeight;
let cursorRange;

function init(){
    initializeProperties();
    initializeUIState();
}

function initializeProperties(){
    chrome.storage.local.get(['extension_properties'], (result) => {
        updateProperties(result.extension_properties);
    });
}

function initializeUIState() {
    chrome.storage.local.get(['extension_state'], (result) => {
        const state = result.extension_state || "disabled";
        updateUIState(state);
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

function updateProperties(newProperties = {}) {
    cursorRange = newProperties.cursorRange ?? 50;
    hoverTime = newProperties.hoverTime ?? 3000;
    screenWidth = newProperties.screenWidth ?? 1920;
    screenHeight = newProperties.screenHeight ?? 1080;
}

init();

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes.extension_state) {
        const { newValue } = changes.extension_state;
        updateUIState(newValue);
    }
    else if (areaName === "local" && changes.extension_properties){
        const { newValue } = changes.extension_properties;
        updateProperties(newValue)
    }
});

