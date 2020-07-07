

// ''chrome.cookies.get({ url: 'https://wdys.netlify.app/', name: 'role' },
//     function (cookie) {
//         if (cookie) {
//             console.log(cookie.value);
//         }
//         else {
//             console.log('Can\'t get cookie! Check the name!');
//         }
//     })

// chrome.cookies.getAll({ url: 'https://wdys.netlify.app/' }, (cookies) => console.log(1, cookies))''


const cookie = (name) => new Promise(resolve => chrome.cookies.get({ url: 'https://wdys.netlify.app/', name }, resolve));
// cookie('role')
//     .then(result => {
//         return [result.value, cookie('user_id')];
//     })
//     .then(console.log)
//     .catch(console.log)

Promise.all([cookie('role'), cookie('user_id')])
    .then(res => console.log(res[0].value, res[1].value))
    .catch(err => console.log(1, err))