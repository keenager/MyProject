const https = require('https');
const cheerio = require('cheerio');

function getArticle(title, url, className) {
    let content = `<h2>${title}</h2>`;
    return new Promise( (resolve, reject) => {
        https.get(url, stream => {
            let data = '';
            stream.on('data', chunk => data += chunk);
            stream.on('end', () => {
                const $ = cheerio.load(data);
                let $list = $(className);
                for(let i = 0; i < $list.length; i++) {
                    let link = $list.eq(i).children('a').attr('href');
                    let text = $list.eq(i).children('a').text();
                    content += `<p><a href='${link}'>${text}</a></p>`;
                }
                resolve(content);
            });
        });
    });
}

const data = [
    ['한겨레 사설,칼럼', 'https://www.hani.co.kr/arti/opinion/editorial/', 'div.list h4.ranktitle'],
    ['한겨레 많이 본 기사', 'https://www.hani.co.kr/arti/list.html', 'div.list h4.ranktitle'],
];

(async () => {
    for(e of data) {
        console.log(await getArticle(...e));
    }
})();