chrome.runtime.sendMessage({
    reloaded: true,
}
);

chrome.storage.sync.remove(['settings']);



const gotSettings = (data, sender, sendResponse) => {
    const body = document.querySelector('body');
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
            const response = await fetch(`http://localhost:3000/saveBody/11`)
            const data = await response.json()
            console.log(data)
            console.log(data[0].innerHTML)
            body.innerHTML = data[0].innerHTML;



            const allNodes = Array.from(document.getElementsByTagName('*'));
            let currentSelection;

            for (let node of allNodes) {
                if (node.nodeName === "BUTTON")
                    node.disabled = true;
                if (node.nodeName === "BUTTON")
                    node.disabled = false;
                if (node.nodeName === "A")
                    node.style.pointerEvents = 'none';
                if (node.placeholder)
                    node.value = node.placeholder
            }

            body.contentEditable = true;
            //body.addEventListener('contextmenu', event => event.preventDefault());

            body.addEventListener('click', () => {
                let x = event.clientX;
                let y = event.clientY;

                lastSelection = currentSelection;
                currentSelection = document.elementFromPoint(x, y);
                // should add last border style, not 'none'
                if (lastSelection)
                    lastSelection.style.border = 'none';
                currentSelection.style.border = '1px dotted black';
                console.log(currentSelection)


            }
            );
        })()

    }
}


chrome.runtime.onMessage.addListener(gotSettings);