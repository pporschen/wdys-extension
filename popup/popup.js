import './ManagerView.js';
import './TranslatorView.js'
const main = document.querySelector('main');

const readStorage = new Promise(resolve => chrome.storage.local.get('role', resolve));

readStorage.then(res => {
    const currentRole = res.role;
    console.log(currentRole)
    if (!currentRole) {
    }
    if (currentRole === '0') {
        console.log('hey')
        const managerView = document.createElement('manager-view');
        main.appendChild(managerView)
    }
    if (currentRole === '1') {
        const translatorView = document.createElement('translator-view');
        main.appendChild(translatorView)
    }
}
)






