const fs = require('fs');
const puppeteer = require('puppeteer');
const url = 'https://safind.scourt.go.kr/sf/mysafind.jsp';
let cookie_string = '';

exports.cookie_read = function(req, res) {
    fs.readFile('./data/safind.cookie', 'utf-8', (err, data) => {
        if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error!');
        }
        cookie_string = data;
        res.end(data);
    });
}

exports.cookie_write = function(req, res) {
    let post = req.body;
    fs.writeFile('./data/safind.cookie', post.cookie, err => {
        if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error!');
        }
        cookie_string = post.cookie;
        res.redirect('/case');
    });
}

exports.caseList_read = async function(req, res) {  
    try{
        const browser = await puppeteer.launch({
        //    headless : false
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.goto(url);
        await page.addScriptTag({content : `
            document.cookie = 'safind_string=${cookie_string}'
            `});
        await page.reload();

        let caseList = await page.$eval(
            '#resultList', elem => elem.innerHTML
            );

        res.end(caseList);
        await browser.close();
    } catch(err){
        console.log(err);
    }
}

exports.caseContent_read = async function(req, res) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.addScriptTag({content : `
        document.cookie = 'safind_string=${cookie_string}'
        `});
    await page.reload();

    let elem = await page.evaluateHandle(
        caseNumber => Array.from(document.querySelectorAll('b a')).find(elem => elem.textContent === caseNumber),
        req.params.caseNumber
    );
    await Promise.all([
        elem.click(),
        page.waitForSelector('.subTabContents')
    ]);
    let content = await getContent(page);
    let jsonContent = JSON.stringify(content, null, 2);
    res.end(jsonContent);
    await browser.close();
    // await page.goBack();
    // elems = await page.$$('b a');   // click(), goback() 등으로 navigation 이루어지면 종전의 JSHandler 사라짐. context destroyed. 따라서 다시 설정해줌.
    //                     // 미리 url 등 데이터를 추출해 놓는 방법이 제일 깔끔하지만, 본건의 경우 a 태그가 url로 링크된 방식이 아니라 자바스크립트 함수 호출 방식이어서, 그게 안됨.
    
}

async function getContent(page) {
    
    let caseObj = {
        '기본내용' : '',
        '최근기일내용' : '',
        '최근 제출서류 접수내용' : ''
    };

    for(let key in caseObj) {
        caseObj[key] = await page.$$eval(
            'caption',
            (elemArr, caption) => elemArr.find(elem => elem.textContent === caption).parentElement.innerHTML,
            key
        );
    }

    return caseObj
}