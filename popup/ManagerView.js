class ManagerView extends HTMLElement {

    connectedCallback() {
        this.render();
        const snapshotButton = document.getElementById('snapshot');
        let project = document.getElementById('projects');
        let snapshotName = document.getElementById('snapshot-name');
        let snapshotDescription = document.getElementById('snapshot-description');
        const selection = document.querySelector('#projects');

        fetch(`https://wdys.herokuapp.com/projects/extensions/initial/${localStorage.getItem('userid')}`)
            .then(data => data.json())
            .then(data => {
                console.log(data.projects)
                const projects = data.projects;
                snapshotButton.disabled = !projects.length;
                projects.length
                    ? projects.map(project => selection.innerHTML += `<option value="${project._id}">${project.projectname}</option>`)
                    : selection.innerHTML += `<option value="No Projects">No Projects found</option>`
            })
            .catch(err => {
                selection.innerHTML += `<option value="No Projects">No Projects found</option>`
                console.log(err)
            });

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
            const data = { role: localStorage.getItem('role'), projectId: project.value, snapshotName: snapshotName.value, snapshotDescription: snapshotDescription.value }
            sendToContent(data);
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
                    </select>
                    
                    <label for="snaphot-name">Page Name *</label>
                    <input type="text" id="snapshot-name" name="snapshot-name" placeholder="Give your page a name">
                    
                    <label for="snapshot-description">Description:</label>
                    <textarea  name="snapshot-description" id="snapshot-description"></textarea> <br><br>
                    
                    <button type="submit" class="submit" id="snapshot" disabled><span class="material-icons">camera_alt</span> Take a snapshot</button>
                    
                </form>
            </div>`
        }
}

customElements.define('manager-view', ManagerView)