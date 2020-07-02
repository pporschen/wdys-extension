import './ManagerView.js';
import './TranslatorView.js'


const currentRole = localStorage.getItem('role');
const main = document.querySelector('main');


// chrome.storage.sync.get(['settings', 'sessionState'], (data) => {
//     const loadSettings = data ? data.settings : false;
//     linkOption.checked = loadSettings.linkOption;
//     buttonOption.checked = loadSettings.buttonOption;
//     placeholderOption.checked = loadSettings.placeholderOption;
//     sessionButton.textContent = sessionState ? "End session" : "Start session";
//     let sessionState = data.sessionState || false;
// });

if (!currentRole) {





}

if (currentRole === 'manager') {
    const managerView = document.createElement('manager-view');
    main.appendChild(managerView)




}

if (currentRole === 'translator') {
    const translatorView = document.createElement('translator-view');
    main.appendChild(translatorView)


    // }


}







