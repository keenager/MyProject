const cheerio = require('cheerio');

exports.getHaniContents = function(stream) {
    let result = '';
    let data = '';
    // stream.setEncoding('UTF-8');
    stream.on('data', chunk => data += chunk);
    stream.on('end', () => {
        const $ = cheerio.load(data);
        let $list = $('div.list h4.ranktitle');
        for(let i = 0; i < $list.length; i++) {
            let link = $list.eq(i).children('a').attr('href');
            let text = $list.eq(i).children('a').text();
            result += `<p><a href='${link}'>${text}</a></p>`;
        }
        return result;
    });
}

exports.getKhanContents = function(stream) {
    let result = '';
    let data = '';
    // stream.setEncoding('UTF-8');
    stream.on('data', chunk => data += chunk);
    stream.on('end', () => {
        const $ = cheerio.load(data);
        let $list = $('.art-list li');
        for(let i = 0; i < $list.children().length; i++) {
            let link = $list.eq(i).children('a').attr('href');
            let text = $list.eq(i).children('a').text();
            result += `<p><a href='${link}'>${text}</a></p>`;
        }
        return result;
    });
}

exports.getSisainContents = function(stream, className) {
    let result = '';
    let data = '';
    stream.on('data', chunk => data += chunk);
    stream.on('end', () => {
        const $ = cheerio.load(data);
        let list = $(className);
        for(let i = 0; i < list.length; i++) {
            let link = 'https://www.sisain.co.kr' + list.eq(i).children('a').attr('href');
            let text = list.eq(i).text();
            result += `<p><a href='${link}'>${text}</a></p>`;
        }
        return result;
    });
}