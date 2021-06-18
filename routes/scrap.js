const express = require('express');
const router = express.Router();
const https = require('https');
const cheerio = require('cheerio');
const url = 'https://www.hani.co.kr/arti/opinion/editorial/';

router.get('/', (req, res) => {
    // if(!req.session.is_logined){
    //     res.redirect('/');
    // }

    https.get(url, (stream) => {
        let data = '';
        // stream.setEncoding('UTF-8');
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => {
            const $ = cheerio.load(data);
            let $titleList = $('div.list h4.article-title');
            let linkedTitle = '';
            for(let i = 0; i < $titleList.length; i++) {
                let link = 'https://www.hani.co.kr' + $titleList.children().eq(i).attr('href');
                linkedTitle += `<p><a href='${link}'>${$titleList.children().eq(i).text()}</a></p>`;
            }
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
            res.end(linkedTitle);
        });
    });
});

module.exports = router;