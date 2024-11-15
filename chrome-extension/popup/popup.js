document.getElementById('enableGaze').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'enableGaze' });
});


document.getElementById('disableGaze').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'disableGaze' });
});

document.getElementById('calibrateGaze').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'calibrateGaze' });
});
