document.getElementById('enableGaze').addEventListener('click', () => {
  // Enable gaze control, e.g., send a message to background.js
  chrome.runtime.sendMessage({ type: 'enableGaze' });
});

document.getElementById('disableGaze').addEventListener('click', () => {
  // Disable gaze control, e.g., send a message to background.js
  chrome.runtime.sendMessage({ type: 'disableGaze' });
});
