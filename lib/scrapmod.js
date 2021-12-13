const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');

const newsData = {
    hani_editorial: {
        title: '한겨레 사설,칼럼',
        url: 'https://www.hani.co.kr/arti/opinion/editorial/',
        className: 'div.list h4.ranktitle'
    },
    hani_most: {
        title: '한겨례 많이 본 기사',
        url: 'https://www.hani.co.kr/arti/list.html',
        className: 'div.list h4.ranktitle'
    },
    khan_opinion: {
        title: '경향 오피니언',
        url: 'https://www.khan.co.kr/opinion',
        className: '.art-list li'
    },
    khan_most: {
        title: '경향 종합 실시간',
        url: 'https://www.khan.co.kr/realtime/articles',
        className: '.art-list li'
    },
    sisain1: {
        title: '시사인 주요 기사 1',
        url: 'https://www.sisain.co.kr',
        className: 'li.auto-col'
    },
    sisain2: {
        title: '시사인 주요 기사 2',
        url: 'https://www.sisain.co.kr', 
        className: 'li.clearfix'
    }
};

exports.getArticles = function(req, res) {
    const topicName = req.params.topicName;
    const title = newsData[topicName].title;
    const url = newsData[topicName].url;
    const className = newsData[topicName].className;

    async function getHTML() {
        try {
            return await axios.get(url);
        } catch(error) {
            console.log(error);
        }
    }

    async function getList() {
        const html = await getHTML();
        let result = '';
        const $ = cheerio.load(html.data);
        let $list = $(className);
        for(let i = 0; i < $list.length; i++) {
            let link = $list.eq(i).children('a').attr('href');
            if(url.includes('sisain')) {
                link = 'https://www.sisain.co.kr' + link;
            }
            let text = $list.eq(i).children('a').children().first().text() ||   // 시사인
                       $list.eq(i).children('a').text();                        // 나머지
            result += `<p><a href='${link}' target='_blank'>${text}</a></p>`;
        }
        return result
    }

    getList()
        .then(result => {
            res.send( `<h2>${title}</h2>` + result );
        });



    // https.get(url, stream => {
    //     let data = '';
    //     stream.on('data', chunk => data += chunk);
    //     stream.on('end', () => {
    //         console.log(data);
    //         const $ = cheerio.load(data);
    //         let $list = $(className);
    //         for(let i = 0; i < $list.length; i++) {
    //             let link = $list.eq(i).children('a').attr('href');
    //             if(className.includes('auto-col')) {
    //                 link = 'https://www.sisain.co.kr' + link;
    //             }
    //             let text = $list.eq(i).children('a').text();
                
    //             // articleList += `<p><a href='${link}'>${text}</a></p>`;
    //         }
    //     });
    // });
    

}
