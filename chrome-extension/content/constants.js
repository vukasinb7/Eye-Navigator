const getProperties = (callback) => {
    chrome.storage.local.get('extension_properties', (result) => {
        const hoverTime = result.extension_properties?.hoverTime || 3000;
        const screenWidth = result.extension_properties?.screenWidth || 1920;
        const screenHeight = result.extension_properties?.screenHeight || 1080;

        callback({
            hoverTime: hoverTime,
            screenWidth: screenWidth,
            screenHeight: screenHeight
        });
    });
}