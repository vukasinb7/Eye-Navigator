// Listen for the message from the background script
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'gazeData') {
        const xmlData = message.payload;
        parseAndUpdateCursor(xmlData);
    }
});
