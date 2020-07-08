class LoginView extends HTMLElement {

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML =
            `<div class="login-view">
                    <div>
                        <h1 class='title'>Welcome to <span>{</span> wdys <span>}</span></h1>
                        <p>Please login to continue</p>
                    </div>
                    <div id='overlay'></div>

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

customElements.define('login-view', LoginView)