const express = require('express');
const router = express.Router();
const https = require('https');
const cheerio = require('cheerio');

router.get('/', (req, res, next) => {
    // if(!req.session.is_logined){
    //     res.redirect('/');
    // }

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');

    let hani_contents = '';

    https.get('https://www.hani.co.kr/arti/opinion/editorial/', (stream) => {
        let data = '';
        // stream.setEncoding('UTF-8');
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => {
            const $ = cheerio.load(data);
            let $titleList = $('div.list h4.ranktitle');
            for(let i = 0; i < $titleList.length; i++) {
                let link = $titleList.children().eq(i).attr('href');
                let text = $titleList.children().eq(i).text();
                hani_contents += `<p><a href='${link}'>${text}</a></p>`;
            }
            res.write('<h2>한겨레 사설,칼럼</h2>')
            res.write(hani_contents);
        });
    });
    
    next();
}, (req, res, next) => {

    let khan_contents = '';

    https.get('https://www.khan.co.kr/realtime/articles', (stream) => {
        let data = '';
        // stream.setEncoding('UTF-8');
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => {
            const $ = cheerio.load(data);
            let $list = $('div.art-list ul');
            for(let i = 0; i < $list.children().length; i++) {
                let link = $list.children().eq(i).children().eq(1).attr('href');
                let text = $list.children().eq(i).children().eq(1).text();
                khan_contents += `<p><a href='${link}'>${text}</a></p>`;
            }
            res.write('<h2>경향 종합 실시간</h2>')
            res.write(khan_contents);
        });
    });
    next();
}, (req, res, next) => {

    function getSisainContents(data, className) {
        const $ = cheerio.load(data);
        let list = $(className);
        let sisain_contents = '';
        for(let i = 0; i < list.length; i++) {
            let link = 'https://www.sisain.co.kr' + list.eq(i).children('a').attr('href');
            let text = list.eq(i).text();
            sisain_contents += `<p><a href='${link}'>${text}</a></p>`;
        }
        return sisain_contents
    }

    https.get('https://www.sisain.co.kr', (stream) => {
        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => {
            res.write('<h2>시사인 많이 본 기사</h2>')
            res.write(getSisainContents(data, '.auto-d05 .auto-col'));

            res.write('<h2>시사인 주요기사</h2>')
            res.write(getSisainContents(data, '.auto-d04 .auto-col'));
            res.end();
        });
    });
});

module.exports = router;