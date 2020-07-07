class TranslatorView extends HTMLElement {

    connectedCallback() {
        this.render();
        const role = 'translator';
        const loadButton = document.getElementById('load');
        const openButton = document.querySelector('#open');
        let project = document.getElementById('projects');
        const selection = document.querySelector('#projects');
        const pages = document.querySelector('#pages');
        const readStorage = new Promise(resolve => chrome.storage.local.get('user_id', resolve));
        let userId;
        let allPages;


        readStorage.then(res => {
            userId = res.user_id;
            fetch(`https://wdys.herokuapp.com/translators/extension/${userId}/initial`)
                .then(data => data.json())
                .then(data => {
                    const projects = data.projects;
                    console.log(projects)
                    openButton.disabled = !projects.length

                    if (projects.length) {
                        projects.map(project => {
                            console.log(project._id === localStorage.getItem('project'))
                            if (project._id === localStorage.getItem('project')) selection.innerHTML += `<option value="${project._id}" selected>${project.projectname}</option>`
                            else selection.innerHTML += `<option value="${project._id}">${project.projectname}</option>`
                        });
                        if (!localStorage.getItem('project')) selection.innerHTML += `<option value="" selected disabled>Select a project</option>`
                    }
                    else selection.innerHTML += `<option value="No Projects">No Projects found</option>`;

                    allPages = data.translationpages;
                    const projectPages = allPages.filter(page => page.base_project_id === project.value);

                    projectPages.length
                        ? projectPages.map(page => {
                            if (page._id === localStorage.getItem('page')) pages.innerHTML += `<option selected="selected" value="${page._id}">${page.pagename}</option>`;
                            else pages.innerHTML += `<option value="${page._id}">${page.pagename}</option>`
                        })
                        : pages.innerHTML += `<option value="No Pages">No pages found</option>`;
                })
                .catch(err => {
                    selection.innerHTML += `<option value="No Projects">No Projects found</option>`;
                    pages.innerHTML += `<option value="No Pages">No pages found</option>`;
                })
        });

        const sendToContent = (message) => {
            const send = (tabs) => {
                console.log('send')
                message.url = tabs[0].url;
                console.log(tabs[0])
                chrome.tabs.sendMessage(tabs[0].id, message);
            }

            chrome.tabs.query({ active: true, "currentWindow": true },
                send);
        };

        project.addEventListener('change', () => {
            const projectPages = allPages.filter(page => page.base_project_id === project.value);
            pages.innerHTML = '';
            projectPages.length
                ? projectPages.map(page => pages.innerHTML += `<option value="${page._id}">${page.pagename}</option>`)
                : pages.innerHTML += `<option value="No pages found">No pages found</option>`;
            localStorage.setItem('project', project.value);
        });

        pages.addEventListener('change', () => {
            localStorage.setItem('page', pages.value);
        });

        openButton.onclick = (e) => {
            e.preventDefault();
            const currentPage = allPages.filter(page => pages.value === page._id)[0];
            const data = { role, userId, pageId: currentPage._id }
            chrome.tabs.update({ url: currentPage.page_url }, function (tab1) {
                const listener = function (tabId, changeInfo, tab) {
                    if (tabId == tab1.id && changeInfo.status === 'complete') {
                        chrome.tabs.onUpdated.removeListener(listener);
                        sendToContent(data);
                    }
                }
                chrome.tabs.onUpdated.addListener(listener);
            });
        };

        chrome.storage.onChanged.addListener((changes) => {
            if (changes['isWdysBasepage'].newValue) loadButton.style.display = "block";
        });

        chrome.storage.local.get('isWdysBasepage', item => {
            console.log(item)
            if (item['isWdysBasepage']) loadButton.style.display = "block";
        })

        loadButton.onclick = (e) => {
            e.preventDefault();
            const currentPage = allPages.filter(page => pages.value === page._id)[0];
            const data = { 'tprequest': 'true', role, userId, pageId: currentPage._id }
            sendToContent(data);
            chrome.tabs.create({ url: currentPage.page_url })
        };

        pages.onchange = (e) => {
            if (e.target.value.length === 0) {
                console.log('button disabled')
                openButton.disabled = true
            } else openButton.disabled = false
        };

        if (localStorage.getItem('project') && localStorage.getItem('page')) openButton.disabled = false;
    }




    render() {
        this.innerHTML =
            `<div class="contain-tm">
                <h1 class='title'><span>{</span> wdys <span>}</span></h1>
                <h2 class='sub-title'>Add the page</h2>
                <form id="form">

                    <label>Project Name</label>
                    <select name="projects" id="projects" >
                    </select>

                    <label>Select the Page</label>
                    <select name="pages" id="pages">
                    </select>
                    
                    
                    <button type="submit" id="open" class="translator" disabled > Open page </button>

                    <button type="submit" id="load" class="translator" style="display: none"> Load Translation </button>

                </form>
            </div>`}
}

customElements.define('translator-view', TranslatorView)