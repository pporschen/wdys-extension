import './ManagerView.js';
import './TranslatorView.js';
import './LoginView.js'
const main = document.querySelector('main');

const readStorage = new Promise(resolve => chrome.storage.local.get('role', resolve));

readStorage.then(res => {
    const currentRole = res.role;
    console.log(currentRole)
    if (!currentRole) {
        const loginView = document.createElement('login-view');
        main.appendChild(loginView)
    }
    if (currentRole === '0') {
        
        const managerView = document.createElement('manager-view');
        main.appendChild(managerView)
    }
    if (currentRole === '1') {
        const translatorView = document.createElement('translator-view');
        main.appendChild(translatorView)
    }
}
)






