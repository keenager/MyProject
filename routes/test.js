const express = require('express');
const router = express.Router();
const https = require('https');
const cheerio = require('cheerio');

router.get('/', (req, res) => {

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');

    new Promise( (resolve, reject) => {
        let articles = '<h2>한겨레 사설,칼럼</h2>';
        https.get('https://www.hani.co.kr/arti/opinion/editorial/', stream => {
            let data = '';
            stream.on('data', chunk => data += chunk);
            stream.on('end', () => {
                const $ = cheerio.load(data);
                let $list = $('div.list h4.ranktitle');
                for(let i = 0; i < $list.length; i++) {
                    let link = $list.eq(i).children('a').attr('href');
                    let text = $list.eq(i).children('a').text();
                    articles += `<p><a href='${link}'>${text}</a></p>`;
                }
                resolve(articles);
            });
        });
    }).then(result => {
        return new Promise( (resolve, reject) => {
            let articles = '<h2>한겨레 많이 본 기사</h2>';
            https.get('https://www.hani.co.kr/arti/list.html', stream => {
                let data = '';
                stream.on('data', chunk => data += chunk);
                stream.on('end', () => {
                    const $ = cheerio.load(data);
                    let $list = $('div.list h4.ranktitle');
                    for(let i = 0; i < $list.length; i++) {
                        let link = $list.eq(i).children('a').attr('href');
                        let text = $list.eq(i).children('a').text();
                        articles += `<p><a href='${link}'>${text}</a></p>`;
                    }
                    resolve(result + articles);
                });
            });
        })
    }).then(result => {
        res.end(result);
    });
});

module.exports = router;