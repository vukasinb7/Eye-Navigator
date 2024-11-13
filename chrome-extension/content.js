// Create and style the custom cursor element (only once when the content script is loaded)
const customCursor = document.createElement('div');
customCursor.id = 'gaze-cursor';
document.body.appendChild(customCursor);

customCursor.style.position = 'fixed';
customCursor.style.width = '15px';
customCursor.style.height = '15px';
customCursor.style.backgroundColor = 'red';
customCursor.style.borderRadius = '50%';
customCursor.style.pointerEvents = 'none';
customCursor.style.zIndex = '10000';

// Create and style the overlay (optional)
const overlay = document.createElement('div');
overlay.id = 'gaze-overlay';
overlay.textContent = "Gaze Control Active";
overlay.style.position = 'fixed';
overlay.style.top = '10px';
overlay.style.right = '10px';
overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
overlay.style.color = 'white';
overlay.style.padding = '10px';
overlay.style.borderRadius = '5px';
overlay.style.zIndex = '10000';
document.body.appendChild(overlay);

// Listen for the gaze data message from the background script
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'gazeData') {
        const xmlData = message.payload;
        parseAndUpdateCursor(xmlData);
    }
});

// Parse the XML message and update the cursor position
function parseAndUpdateCursor(xmlData) {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, 'application/xml');
    const recElement = xmlDoc.getElementsByTagName('REC')[0];

    if (recElement) {
      const fpox = parseFloat(recElement.getAttribute('FPOGX'));
      const fpoy = parseFloat(recElement.getAttribute('FPOGY'));

      // Update the cursor position
      updateCursorPosition(fpox, fpoy);
    } else {
      console.error("REC element not found in XML data");
    }
  } catch (error) {
    console.error("Error parsing XML:", error);
  }
}

// Update the cursor's position based on the gaze coordinates
function updateCursorPosition(x, y) {
    const customCursor = document.getElementById('gaze-cursor');
    if (customCursor) {
        customCursor.style.left = `${x * window.innerWidth}px`;  // Scale based on window width
        customCursor.style.top = `${y * window.innerHeight}px`;  // Scale based on window height
    }
}
