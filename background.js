chrome.cookies.onChanged.addListener(info => {
    if (info.removed) {
        chrome.storage.local.remove(['role', 'user_id'])
    }

    const cookie = (name) => new Promise(resolve => chrome.cookies.get({ url: 'https://wdys.netlify.app/', name }, resolve));
    Promise.all([cookie('role'), cookie('user_id')])
        .then(res => {
            chrome.storage.local.set({ role: res[0].value, user_id: res[1].value })
            console.log(res[0].value, res[1].value)
        })
        .catch(err => {
            chrome.storage.local.remove(['role', 'user_id'])
            console.log(1, err)
        })
})