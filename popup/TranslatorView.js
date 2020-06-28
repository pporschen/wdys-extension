class TranslatorView extends HTMLElement {

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML =
            `<form>
        <select name="projects" id="projects">
            <option value="test1">Test1</option>
            <option value="test2">Test2</option>
            <option value="test3">Test3</option>
        </select>
    
        <input type="submit" value="Snapshot" id="snapshot">

    </form>
    <br>
    <br></br>`}
}

customElements.define('translator-view', TranslatorView)