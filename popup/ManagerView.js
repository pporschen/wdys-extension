class ManagerView extends HTMLElement {

    connectedCallback() {
        this.render();
        const readStorage = new Promise(resolve => chrome.storage.local.get('user_id', resolve));
        const role = 'manager';
        const snapshotButton = document.getElementById('snapshot');
        let project = document.getElementById('projects');
        let snapshotName = document.getElementById('snapshot-name');
        let snapshotDescription = document.getElementById('snapshot-description');
        const selection = document.querySelector('#projects');

        readStorage.then(res =>
            fetch(`https://wdys.herokuapp.com/projects/extensions/initial/${res.user_id}`)
                .then(data => data.json())
                .then(data => {
                    // console.log(data.projects)
                    const projects = data.projects;
                    projects.length
                        ? projects.map(project => selection.innerHTML += `<option value="${project._id}">${project.projectname}</option>`)
                        : selection.innerHTML += `<option value="No Projects">No Projects found</option>`
                })
                .catch(err => {
                    selection.innerHTML += `<option value="No Projects">No Projects found</option>`
                    console.log(err)
                }));

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

            const data = { role, projectId: project.value, snapshotName: snapshotName.value, snapshotDescription: snapshotDescription.value }
            sendToContent(data);
            flasher();
        };


        const flasher = () => {
            const over = document.getElementById("overlay");
            const message = document.getElementById("message");
            over.style.display = "block";
            message.style.display = "block"
            setTimeout(() => {
                over.style.display = "none";
                message.style.display = "none";
            }, 7000);
        };

        project.onchange = (e) => {
            if (e.target === "" || snapshotName.value === "") {
                snapshotButton.disabled = true
            } else {
                snapshotButton.disabled = false;
            }
        };

        snapshotName.oninput = (e) => {
            if (e.target.value.length < 5 || project.value === "") {
                snapshotButton.disabled = true
            } else {
                snapshotButton.disabled = false;
            }
        };



    }

    render() {
        this.innerHTML =
            `<div class="contain-tm">
                <h1 class='title'><span>{</span> wdys <span>}</span></h1>
                <h2 class='sub-title'>Add the page</h2>
                <form>
                    <label for="projects">Project Name *</label>
                    <select name="projects" id="projects">
                        <option value="" selected disabled>Select a project</option>
                    </select>
                    <label for="snaphot-name">Page Name *</label>
                    <input type="text" id="snapshot-name" name="snapshot-name" placeholder="Give your page a name (min. 5 characters)" required>
                    <label for="snapshot-description">Description:</label>
                    <textarea name="snapshot-description" id="snapshot-description"></textarea>
                    <button type="submit" class="submit" id="snapshot" disabled><span class="material-icons">camera_alt</span> Take a snapshot</button>
                </form>
                <div id='overlay'>
                </div>
                <div id='message'>
                    <div class="center">
                        <div class="success">
                            <span class="material-icons flash-icon">camera_alt</span>
                            <h3>Your project snapshot was successful</h3>
                        </div>
                    </div>
                </div>
            </div>`
    }
}

customElements.define('manager-view', ManagerView)