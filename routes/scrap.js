const express = require('express');
const router = express.Router();
const https = require('https');
const cheerio = require('cheerio');

function getArticles(title, url, className, result) {
    return new Promise( (resolve, reject) => {
        let articles = `<h2>${title}</h2>`;
        https.get(url, stream => {
            let data = '';
            stream.on('data', chunk => data += chunk);
            stream.on('end', () => {
                const $ = cheerio.load(data);
                let $list = $(className);
                for(let i = 0; i < $list.length; i++) {
                    let link = $list.eq(i).children('a').attr('href');
                    if(className.includes('auto-col')) {
                        link = 'https://www.sisain.co.kr' + link;
                    }
                    let text = $list.eq(i).children('a').text();
                    articles += `<p><a href='${link}'>${text}</a></p>`;
                }
                resolve(result + articles);
            });
        });
    })
}

router.get('/', (req, res) => {
    // if(!req.session.is_logined){
    //     res.redirect('/');
    // }

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');

    getArticles('한겨레 사설,칼럼', 'https://www.hani.co.kr/arti/opinion/editorial/', 'div.list h4.ranktitle', '')
    .then(result => getArticles('한겨레 많이 본 기사', 'https://www.hani.co.kr/arti/list.html', 'div.list h4.ranktitle', result))
    .then(result => getArticles('경향 종합 실시간', 'https://www.khan.co.kr/realtime/articles', '.art-list li', result))
    .then(result => getArticles('경향 오피니언', 'https://www.khan.co.kr/opinion', '.art-list li', result))
    .then(result => getArticles('시사인 주요 기사 1', 'https://www.sisain.co.kr', '.auto-d04 .auto-col', result))
    .then(result => getArticles('시사인 주요 기사 2', 'https://www.sisain.co.kr/news/articleList.html', '.auto-da07 .auto-col', result))
    .then(result => res.end(result));
});

module.exports = router;