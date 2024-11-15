// Create and style the custom cursor element
const customCursor = document.createElement('div');
customCursor.id = 'gaze-cursor';
document.body.appendChild(customCursor);

customCursor.style.position = 'fixed';
customCursor.style.width = '15px';
customCursor.style.height = '15px';
customCursor.style.backgroundColor = 'red';
customCursor.style.borderRadius = '50%';
customCursor.style.pointerEvents = 'none';
customCursor.style.zIndex = '100000002';


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
    let cursorX = x * window.innerWidth
    let cursorY = y * window.innerHeight
    if (customCursor) {
        customCursor.style.left = `${cursorX}px`;
        customCursor.style.top = `${cursorY}px`;
    }

    const cursorUpdatedEvent = new CustomEvent('cursorUpdated', {});
    document.dispatchEvent(cursorUpdatedEvent);
}
