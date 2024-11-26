const ip = '127.0.0.1';
const port = 5050;
const address = `ws://${ip}:${port}`;
let socket;
let windowWidth = 1920
let windowHeight = 1080

function connectWebSocket() {
    socket = new WebSocket(address);

    socket.addEventListener('open', () => {
        console.log('Connected to WebSocket server');
        sendEnableCommand();
    });

    socket.addEventListener('message', (event) => {
        // Check if the message is a Blob
        if (event.data instanceof Blob) {
            // Convert Blob to ArrayBuffer
            const reader = new FileReader();
            reader.onload = function (e) {
                // Decode message to XML string
                const arrayBuffer = e.target.result;
                const decoder = new TextDecoder("utf-8");
                const xmlData = decoder.decode(arrayBuffer);

                // Send the decoded XML data to the content script
                if (xmlData.includes('REC')) {
                    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                        tabs.forEach((tab) => {
                            if (tab.url) {
                                chrome.tabs.sendMessage(tab.id, {type: 'gazeData', payload: xmlData});
                            } else {
                                console.error("Skipping tab with no URL:", tab.url);
                            }
                        });
                    });
                } else if (xmlData.includes('"CALIB_RESULT"')) {
                    console.log('Calibration result received, stopping calibration display');
                    socket.send(new TextEncoder().encode('<SET ID="CALIBRATE_SHOW" STATE="0" />\r\n'));
                }
            };
            reader.onerror = function (error) {
                console.error("Error reading Blob:", error);
            };
            reader.readAsArrayBuffer(event.data);  // Read the Blob as an ArrayBuffer
        } else {
            console.error("Received data is not a Blob:", event.data);
        }
    });


    socket.addEventListener('close', () => {
        console.log('WebSocket connection closed. Reconnecting in 5 seconds...');
        setTimeout(connectWebSocket, 5000); // Reconnect after delay
    });

    socket.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
        socket.close();
    });
}

function sendCalibrateCommand() {
    // Define the commands
    const commands = [
        `<SET ID="SCREEN_SIZE" X="0" Y="0" WIDTH=${windowWidth} HEIGHT="${windowHeight}"/>\r\n`,
        '<SET ID="CALIBRATE_CLEAR"/>\r\n',
        '<SET ID="CALIBRATE_ADDPOINT" X="0.1" Y="0.1" />\r\n',
        '<SET ID="CALIBRATE_ADDPOINT" X="0.3" Y="0.3" />\r\n',
        '<SET ID="CALIBRATE_ADDPOINT" X="0.5" Y="0.1" />\r\n',
        '<SET ID="CALIBRATE_ADDPOINT" X="0.7" Y="0.3" />\r\n',
        '<SET ID="CALIBRATE_ADDPOINT" X="0.9" Y="0.1" />\r\n',
        '<SET ID="CALIBRATE_ADDPOINT" X="0.9" Y="0.5" />\r\n',
        '<SET ID="CALIBRATE_ADDPOINT" X="0.7" Y="0.7" />\r\n',
        '<SET ID="CALIBRATE_ADDPOINT" X="0.5" Y="0.5" />\r\n',
        '<SET ID="CALIBRATE_ADDPOINT" X="0.3" Y="0.7" />\r\n',
        '<SET ID="CALIBRATE_ADDPOINT" X="0.1" Y="0.5" />\r\n',
        '<SET ID="CALIBRATE_ADDPOINT" X="0.1" Y="0.9" />\r\n',
        '<SET ID="CALIBRATE_ADDPOINT" X="0.5" Y="0.9" />\r\n',
        '<SET ID="CALIBRATE_ADDPOINT" X="0.9" Y="0.9" />\r\n',
        '<SET ID="CALIBRATE_SHOW" STATE="1" />\r\n',
        '<SET ID="CALIBRATE_START" STATE="1" />\r\n'
    ];

    // Send all commands to the WebSocket server
    const encoder = new TextEncoder();
    commands.forEach(cmd => {
        socket.send(encoder.encode(cmd));
    });
}

function sendEnableCommand() {
    // Define the commands
    const commands = [
        '<SET ID="ENABLE_SEND_CURSOR" STATE="1" />\r\n',
        '<SET ID="ENABLE_SEND_POG_FIX" STATE="1" />\r\n',
        '<SET ID="ENABLE_SEND_TIME" STATE="1" />\r\n',
        '<SET ID="ENABLE_SEND_DATA" STATE="1" />\r\n'
    ]

    // Send all commands to the WebSocket server
    const encoder = new TextEncoder();
    commands.forEach(cmd => {
        socket.send(encoder.encode(cmd));
    });
}

function sendDisableCommand() {
    // Define the commands
    const commands = [
        '<SET ID="ENABLE_SEND_DATA" STATE="0" />\r\n'
    ]

    // Send all commands to the WebSocket server
    const encoder = new TextEncoder();
    commands.forEach(cmd => {
        socket.send(encoder.encode(cmd));
    });
}

chrome.runtime.onMessage.addListener(function (message) {
    if (message.type === 'enableGaze') {
        sendEnableCommand();
        chrome.storage.local.set({extension_state: "enabled"}, () => {console.log('Extension state set to enabled');});
    } else if (message.type === 'disableGaze') {
        sendDisableCommand();
        chrome.storage.local.set({extension_state: "disabled"}, () => {console.log('Extension state set to disabled');});
    } else if (message.type === 'calibrateGaze') {
        sendCalibrateCommand();
    }
    return true;
});



connectWebSocket();