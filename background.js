

chrome.cookies.get({ url: 'https://wdys.netlify.app/', name: 'role' },
    function (cookie) {
        if (cookie) {
            console.log(cookie.value);
        }
        else {
            console.log('Can\'t get cookie! Check the name!');
        }
    });

chrome.cookies.getAllCookieStores((store) => console.log(store))
