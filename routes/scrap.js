const express = require('express');
const router = express.Router();
const https = require('https');
const cheerio = require('cheerio');
const scrapmod = require('../lib/scrapmod');  //현재는 필요 없는 상태

let temp, hani1, hani2, khan1, khan2, sisain1, sisain2;

//http.get() 메서드까지 포함해서 함수화하면 return 값이 undefined가 됨...

// function getArticles(url, className) {
//     let result = '';
//     https.get(url, stream => {
//         let data = '';
//         stream.on('data', chunk => data += chunk);
//         stream.on('end', () => {
//             result += getTitleLink(data, className);
//         });
//     });
//     return result
// }

// function getArticles(url, className) {
//     temp = '';
//     https.get(url, stream => {
//         let data = '';
//         stream.on('data', chunk => data += chunk);
//         stream.on('end', () => {
//             const $ = cheerio.load(data);
//             let $list = $(className);
//             for(let i = 0; i < $list.length; i++) {
//                 let link = $list.eq(i).children('a').attr('href');
//                 let text = $list.eq(i).children('a').text();
//                 temp += `<p><a href='${link}'>${text}</a></p>`;
//             }
//         });
//     });
// }

function getTitleLink(data, className) {
    let result = '';
    const $ = cheerio.load(data);
    let $list = $(className);
    for(let i = 0; i < $list.length; i++) {
        let link = $list.eq(i).children('a').attr('href');
        let text = $list.eq(i).children('a').text();
        result += `<p><a href='${link}'>${text}</a></p>`;
    }
    return result
}

router.get('/', (req, res, next) => {
    // if(!req.session.is_logined){
    //     res.redirect('/');
    // }

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');

    hani1 = '<h2>한겨레 사설,칼럼</h2>';
    https.get('https://www.hani.co.kr/arti/opinion/editorial/', stream => {
        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => {
            hani1 += getTitleLink(data, 'div.list h4.ranktitle');
        });
    });

    hani2 = '<h2>한겨레 많이 본 기사</h2>';
    https.get('https://www.hani.co.kr/arti/list.html', stream => {
        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => {
            hani2 += getTitleLink(data, 'div.list h4.ranktitle');
        });
    });
    next();
}, (req, res, next) => {

    khan1 = '<h2>경향 종합 실시간</h2>';
    https.get('https://www.khan.co.kr/realtime/articles', stream => {
        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => {
            khan1 += getTitleLink(data, '.art-list li');
        });
    });

    khan2 = '<h2>경향 오피니언</h2>';
    https.get('https://www.khan.co.kr/opinion', stream => {
        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => {
            khan2 += getTitleLink(data, '.art-list li');
        });
    });

    next();
}, (req, res, next) => {

    sisain1 = '<h2>시사인 주요기사 1</h2>';
    https.get('https://www.sisain.co.kr', (stream) => {
        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => {
            sisain1 += getTitleLink(data, '.auto-d04 .auto-col');
        });
    });

    sisain2 = '<h2>시사인 주요기사 2</h2>';
    https.get('https://www.sisain.co.kr/news/articleList.html', (stream) => {
        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => {
            sisain2 += getTitleLink(data, '.auto-da07 .auto-col');
        });
    });

    next();
}, (req, res, next) => {
    setTimeout(() => {
        let articles = hani1 + hani2 + khan1 + khan2 + sisain1 + sisain2;
        res.write(articles);
        res.end();
    }, 700);
});

module.exports = router;