document.getElementById('calibrateGaze').addEventListener('click', () => {
    chrome.runtime.sendMessage({type: 'calibrateGaze'});
});


const switchButton=document.getElementById('custom-gaze-switch');
switchButton.addEventListener('change', (event) => {
    if (event.target.checked) {
        switchButton.checked=true;
        chrome.runtime.sendMessage({type: 'enableGaze'});
        chrome.windows.getCurrent((window) => {
            const windowId = window.id;
            chrome.windows.update(windowId, {state: "fullscreen"});
        });
    } else {
        chrome.runtime.sendMessage({type: 'disableGaze'});
    }
});

chrome.storage.local.get('extension_state', (result) => {
        switchButton.checked = result.extension_state==='enabled' || false;
});

chrome.storage.local.get('extension_properties', (result) => {
        const hoverTime = result.extension_properties?.hoverTime || 3000;
        const cursorRange = result.extension_properties?.cursorRange || 50;
        const screenWidth = result.extension_properties?.screenWidth || 1920;
        const screenHeight = result.extension_properties?.screenHeight || 1080;

        let hoverInput=document.getElementById('custom-gaze-hover-time');
        hoverInput.value=hoverTime;
        let cursorInput=document.getElementById('custom-gaze-cursor-range');
        cursorInput.value=cursorRange;
        let screenWInput=document.getElementById('custom-gaze-screen-w');
        screenWInput.value=screenWidth;
        let screenHInput=document.getElementById('custom-gaze-screen-h');
        screenHInput.value=screenHeight;
});

const applyButton=document.getElementById('custom-gaze-apply');
applyButton.addEventListener('click', (event) => {
     let hoverInput=document.getElementById('custom-gaze-hover-time');
     let cursorInput=document.getElementById('custom-gaze-cursor-range');
     let screenWInput=document.getElementById('custom-gaze-screen-w');
     let screenHInput=document.getElementById('custom-gaze-screen-h');
     chrome.storage.local.set({extension_properties:{
            hoverTime:hoverInput.value,
            cursorRange:cursorInput.value,
            screenWidth:screenWInput.value,
            screenHeight:screenHInput.value
        }}, () => {chrome.runtime.reload();});
});