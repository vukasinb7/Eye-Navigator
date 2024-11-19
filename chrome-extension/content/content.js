// Listen for the message from the background script
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'gazeData') {
        const xmlData = message.payload;
        parseAndUpdateCursor(xmlData);
    } else {
        console.log(message);
    }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
    for (let [key, {oldValue, newValue}] of Object.entries(changes)) {
        if (key === "extension_state") {
            change_ui_state(newValue)
        }
    }
});

chrome.storage.local.get(['extension_state'], (result) => {
    change_ui_state(result.extension_state)
})

function change_ui_state(state){
    if (state === "enabled") {
        customCursor.style.display = "flex"
        overlayContainer.style.display = "flex"
        toggleButton.style.display = "flex"
    } else {
        customCursor.style.display = "none"
        overlayContainer.style.display = "none"
        toggleButton.style.display = "none"
    }
}
