

chrome.cookies.get({ url: 'https://developer.mozilla.org', name: 'messages' },
    function (cookie) {
        if (cookie) {
            console.log(cookie.value);
        }
        else {
            console.log('Can\'t get cookie! Check the name!');
        }
    });


chrome.tabs.onUpdated.addListener((tabId, options, tab) => {
    console.log(localStorage)
    console.log(tabId)
    //localStorage.removeItem('isWdysBasepage')
});