const snapshotButton = document.getElementById('snapshot');
let project = document.getElementById('projects');
let snapshotName = document.getElementById('snapshot-name');
let snapshotDescription = document.getElementById('snapshot-description');
let role = document.getElementById('role');



// chrome.storage.sync.get(['settings', 'sessionState'], (data) => {
//     const loadSettings = data ? data.settings : false;
//     linkOption.checked = loadSettings.linkOption;
//     buttonOption.checked = loadSettings.buttonOption;
//     placeholderOption.checked = loadSettings.placeholderOption;
//     sessionButton.textContent = sessionState ? "End session" : "Start session";
//     let sessionState = data.sessionState || false;
// });

const sendToContent = (message) => {
    const send = (tabs) => {
        message.url = tabs[0].url;
        chrome.tabs.sendMessage(tabs[0].id, message)
    }

    chrome.tabs.query({ active: true, "currentWindow": true },
        send);
};



snapshotButton.onclick = (e) => {
    e.preventDefault();
    const data = { role: role.value, project: project.value, snapshotName: snapshotName.value, snapshotDescription: snapshotDescription.value }

    sendToContent(data);
}

