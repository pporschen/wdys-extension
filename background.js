

chrome.cookies.get({ url: 'https://developer.mozilla.org', name: 'messages' },
    function (cookie) {
        if (cookie) {
            console.log(cookie.value);
        }
        else {
            console.log('Can\'t get cookie! Check the name!');
        }
    });


