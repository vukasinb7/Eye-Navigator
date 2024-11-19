document.getElementById('enableGaze').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'enableGaze' });
  chrome.windows.getCurrent((window) => {
    const windowId = window.id;
    chrome.windows.update(windowId, {state: "fullscreen"});
  });
});


document.getElementById('disableGaze').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'disableGaze' });
});

document.getElementById('calibrateGaze').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'calibrateGaze' });
});
