const body = document.querySelector('body');
chrome.storage.local.remove('isWdysBasepage');


const gotSettings = (data, sender, sendResponse) => {

    if (data.role === 'manager') {
        const nodes = document.getElementsByTagName('*');
        let count = 0;

        for (let node of nodes) {
            node.dataset.id = count;
            count++;
        }

        const snapshot = body.innerHTML;
        body.insertAdjacentHTML('afterbegin', '<div>HELLO</div>')

        fetch(`https://wdys.herokuapp.com/projects/${data.projectId}/snapshot`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({ page_url: data.url, innerHTML: snapshot, pagename: data.snapshotName, description: data.snapshotDescription })
        })
            .then(res => console.log(res))
            .catch(console.log)
    }

    if (data.role === 'translator') {
        (async () => {
            const response = await fetch(`https://wdys.herokuapp.com/translators/extension/${data.userId}/${data.pageId}`)
            const result = await response.json();
            body.innerHTML = result.basepage.innerHTML;
            body.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');
                #base-id {
                    position:fixed; bottom:0; left: 0; z-index:99; margin:0; width:100%; height:80px; background:#01C0AD; font-family: 'Montserrat', sans-serif;
                    display:grid; grid-template-columns: repeat(3, 1fr); align-items:center; padding: 0 2em; text-transform:uppercase; color: #fff; font-weight: 16px;
                }
                .title {
                    justify-self: start;
                }
                .logo {
                    text-transform: none; justify-self: center;
                }
                .logo span {
                    font-weight: 600;
                }
            </style>
            <div id="base-id">
                <div class='title'> Base language page </div>
                <div class='logo'> { <span> wdys </span> } </div>
            </div>` + body.innerHTML

            chrome.storage.local.set({ 'isWdysBasepage': true });
        })();

        window.addEventListener('scroll', () => {
            localStorage.setItem('y', window.pageYOffset.toString());
            localStorage.setItem('x', window.pageXOffset.toString());
        })

        window.addEventListener('storage', () => window.scrollTo(Number(localStorage.getItem('x')), Number(localStorage.getItem('y'))))
    }

    if (data.tprequest) {
        localStorage.setItem('tprequest', true);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('pageId', data.pageId);
    }
};

if (localStorage.getItem('tprequest') === 'true') {
    const userId = localStorage.getItem('userId');
    const pageId = localStorage.getItem('pageId');
    const saver = (pseudo) => {
        const saveButton = document.querySelector('#save-button')
        saveButton.innerHTML = '<div class="lds-dual-ring"></div>';
        console.log(saveButton.innerHTML)
        fetch(`https://wdys.herokuapp.com/translators/extension/sendpage`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({ translator_id: userId, page_id: pageId, innerHTML: pseudo.innerHTML })
        })

            .then(res => {
                saveButton.innerHTML = 'SAVE';
                console.log(res)
            })
            .catch(err => console.log(err))
    };

    (async () => {
        const response = await fetch(`https://wdys.herokuapp.com/translators/extension/${userId}/${pageId}`)
        const result = await response.json()

        let currentSelection;

        body.innerHTML = '<div id="pseudo-body">' + result.translationpage.innerHTML + '<div>';

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

            if ((node.innerHTML.trim()[0] !== '<') && node.nodeName !== 'SCRIPT' && node.innerHTML) {
                node.contentEditable = true;
            }
        }

        body.innerHTML = `<style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');
        #translation-id {
            position:fixed; bottom:0; left: 0; z-index:99; margin:0; width:100%; height:80px; background:#01C0AD; font-family: 'Montserrat', sans-serif;
            display:grid; grid-template-columns: repeat(3, 1fr); align-items:center; padding: 0 2em; text-transform:uppercase; color: #fff; font-weight: 16px;
        }
        #save-button {
            height: 3em; border: 0; color: #fff; text-transform: uppercase; width: 250px; box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
            border-radius: 4px; cursor: pointer; outline: none; background: #3F3D56; justify-self: end; 
        }
        .logo {
            text-transform: none; justify-self: center;
        }
        .logo span {
            font-weight: 600;
        }
        .lds-dual-ring {
            display: inline-block;
            margin-top: 4px;
          }
          .lds-dual-ring:after {
            content: " ";
            display: block;
            width: 20px;
            height: 20px;
            margin: 0px;
         
            border-radius: 50%;
            border: 2px solid #fff;
            border-color: #fff transparent #fff transparent;
            animation: lds-dual-ring 1.2s linear infinite;
            
          }
          @keyframes lds-dual-ring {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
          
    </style>
    <div id="translation-id">
        <div> Page to translate </div>
        <div class='logo'> { <span> wdys </span> } </div>
        <button id="save-button"> SAVE </button>
    </div>` + body.innerHTML
        const pseudo = document.querySelector('#pseudo-body');
        const saveButton = document.querySelector('#save-button')
        //pseudo.contentEditable = true;

        pseudo.addEventListener('click', () => {
            let x = event.clientX;
            let y = event.clientY;

            lastSelection = currentSelection;
            currentSelection = document.elementFromPoint(x, y);
            saver(pseudo);
        }
        );

        saveButton.addEventListener('click', () => {
            saver(pseudo)
        });

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