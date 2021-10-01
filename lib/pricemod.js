const puppeteer = require('puppeteer');
const config = {
    ssg: {
        url: 'http://m.ssg.com',
        input_selector: '#globalSearchInput',
        section_selector: '.cmitem_detailbx a',
        price_selector: '.cmitem_pricewrap'
    },
    hp: {
        url: 'https://front.homeplus.co.kr',
        input_selector: 'input',
        section_selector: '.detailInfo > a',
        price_selector: '.price'
    }
}

exports.get_prices = async function(req, res) {
    let mart = config[req.params.mart];
    let qs = req.params.qs;
    let result = await getContents(mart.url, mart.input_selector, qs, mart.section_selector, mart.price_selector);
    res.send(JSON.stringify(result));
}

async function getContents(url, input_selector, query, section_selector, price_selector) {
    try{
        const browser = await puppeteer.launch({
            // headless: false
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', request => {
            if( ['image', 'font'].includes(request.resourceType()) ) request.abort();
            else request.continue();
        });
        await page.goto(url);
        await page.waitForSelector(input_selector);
        await page.click(input_selector);
        const inputHandle = await page.$(input_selector);
        await inputHandle.type(query);
        await inputHandle.press('Enter');
        await page.waitForTimeout(2000);
        // await page.waitForNavigation();
        const resultSections = await page.$$eval(section_selector, sections => 
            sections.map(section => {
                return {
                    title: section.href.includes('ssg') ? section.querySelector('.cmitem_goods_tit').textContent : section.textContent,
                    link: section.href
                }
            })
        );
        const prices = await page.$$eval(price_selector, prices => 
            prices.map(price => price.innerText)
        );
        resultSections.forEach( (item, index) => {
            item.price = prices[index];
        });
        const queryArr = query.split(' ');
        const filteredResult = resultSections.filter(section => hasAll(section.title, queryArr));

        filteredResult.sort(oreum);
        
        await browser.close();
        return filteredResult
    } catch(error) {
        console.log(error);
    }
}

function oreum(a, b) {
    return a.title > b.title ? 1 : a.title < b.title ? -1 : 0
}

function hasAll(target, strArr) {
    for(let str of strArr) {
        if(!target.includes(str)) return false
    }
    return true
}