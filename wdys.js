const body = document.querySelector('body');
chrome.storage.local.remove('isWdysBasepage');


const gotSettings = (data, sender, sendResponse) => {
    console.log('ho')
    console.log(1, data);
    if (data.role === 'manager') {
        const nodes = document.getElementsByTagName('*');
        let count = 0;
        

        for (let node of nodes) {
            node.dataset.id = count;
            count++;
        }
        
        const snapshot = body.innerHTML;

        fetch(`https://wdys.herokuapp.com/projects/${data.projectId}/snapshot`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({ page_url: data.url, innerHTML: snapshot, pagename: data.snapshotName, description: data.snapshotDescription, base_lang: "ger" })
        })
            .then(res => console.log(res))
            .catch(err => console.log(err))
            
    }

    if (data.role === 'translator') {

        (async () => {
            const response = await fetch(`https://wdys.herokuapp.com/translators/extension/${data.userId}/${data.pageId}`)
            const result = await response.json()
            body.innerHTML = result.basepage.innerHTML;
            body.innerHTML = '<div id="base-id" style="position: fixed; bottom:0; background-color: white width: 100vw; height: 3em; z-index:10;"> BASE </div>' + body.innerHTML

            chrome.storage.local.set({ 'isWdysBasepage': true });
        })();

        window.addEventListener('scroll', () => {
            localStorage.setItem('y', window.pageYOffset.toString());
            localStorage.setItem('x', window.pageXOffset.toString());
        })

        window.addEventListener('storage', () => window.scrollTo(Number(localStorage.getItem('x')), Number(localStorage.getItem('y'))))
    }

    if (data.tprequest) {
        console.log('here')
        localStorage.setItem('tprequest', true);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('pageId', data.pageId);
    }
};

if (localStorage.getItem('tprequest') === 'true') {
    const userId = localStorage.getItem('userId');
    const pageId = localStorage.getItem('pageId');
    const saver = (pseudo) => {
        fetch(`https://wdys.herokuapp.com/translators/extension/sendpage`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({ translator_id: userId, page_id: pageId, innerHTML: pseudo.innerHTML })
        })
            .then(res => console.log(res))
            .catch(err => console.log(err))
    };

    (async () => {
        const response = await fetch(`https://wdys.herokuapp.com/translators/extension/${userId}/${pageId}`)
        const result = await response.json()

        let currentSelection;

        body.innerHTML = '<div id="pseudo-body">' + result.translationpage.innerHTML + '<div>';
        body.innerHTML = '<div id="translation-id" class="" style="position: fixed; bottom:0; z-index:99"> TRANSLATION </div>' + body.innerHTML

        const allNodes = Array.from(document.getElementsByTagName('*'));

        for (let node of allNodes) {
            if (node.nodeName === "BUTTON")
                node.disabled = true;

            if (node.nodeName === "A") {
                node.style.pointerEvents = 'none';
                node.disabled = true;
            }
            if (node.placeholder)
                node.value = node.placeholder
        }

        body.innerHTML = '<button id="save-button" style="position: fixed; bottom:0; right: 0"> SAVE </button>' + body.innerHTML
        const pseudo = document.querySelector('#pseudo-body');
        const saveButton = document.querySelector('#save-button')
        pseudo.contentEditable = true;

        pseudo.addEventListener('click', () => {
            let x = event.clientX;
            let y = event.clientY;

            lastSelection = currentSelection;
            currentSelection = document.elementFromPoint(x, y);
            // should add last border style, not 'none'
            if (lastSelection)
                lastSelection.style.border = 'none';
            currentSelection.style.border = '1px dotted black';

            saver(pseudo);
        }
        );

        saveButton.addEventListener('click', () => saver(pseudo));

        localStorage.removeItem('tprequest');
        localStorage.removeItem('userId');
        localStorage.removeItem('pageId');

        window.addEventListener('scroll', () => {
            localStorage.setItem('y', window.pageYOffset.toString());
            localStorage.setItem('x', window.pageXOffset.toString());
        })

        window.addEventListener('storage', () => window.scrollTo(Number(localStorage.getItem('x')), Number(localStorage.getItem('y'))))

    })();
    
}

chrome.runtime.onMessage.addListener(gotSettings);