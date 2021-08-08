const fs = require('fs');
const puppeteer = require('puppeteer');
const url = 'https://safind.scourt.go.kr/sf/mysafind.jsp';
// const cookie_string = '%BC%F6%BF%F8%B0%ED%B9%FD%232021%23%B3%EB%2365%23%C0%CC%B8%B8%C8%F1%23cr%23%C6%AF%C1%A4%B0%E6%C1%A6%B9%FC%C1%CB%B0%A1%C1%DF%C3%B3%B9%FA%B5%EE%BF%A1%B0%FC%C7%D1%B9%FD%B7%FC%C0%A7%B9%DD%28%C8%BE%B7%C9%29%B5%EE*%BC%F6%BF%F8%B0%ED%B9%FD%232021%23%B3%EB%2369%23%C1%D6%BD%C4%C8%B8%BB%E7%C5%E9%C5%D8%23cr%23%BB%EA%BE%F7%B1%E2%BC%FA%C0%C7%C0%AF%C3%E2%B9%E6%C1%F6%B9%D7%BA%B8%C8%A3%BF%A1%B0%FC%C7%D1%B9%FD%B7%FC%C0%A7%B9%DD%B5%EE*';
let cookie_string = '';

exports.cookie_read = function(req, res) {
    fs.readFile('./data/safind.cookie', 'utf-8', (err, data) => {
        if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error!');
        }
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

exports.case_read = async function(req, res) {  
    try{
        const browser = await puppeteer.launch({
        //    headless : false
        });
        const page = await browser.newPage();
        await page.goto(url);

        await page.addScriptTag({content : `
            document.cookie = 'safind_string=${cookie_string}'
            `});
        await page.reload();

        let data = [];
        let elems = await page.$$('b a');

        for(let i = 0; i < elems.length; i++) {
            await Promise.all([
                elems[i].click(),
                page.waitForSelector('#subTab2')
            ]);
            data.push(await getData(page));
            await page.goBack();
            elems = await page.$$('b a');   // click(), goback() 등으로 navigation 이루어지면 종전의 JSHandler 사라짐. context destroyed. 따라서 다시 설정해줌.
                                // 미리 url 등 데이터를 추출해 놓는 방법이 제일 깔끔하지만, 본건의 경우 a 태그가 url로 링크된 방식이 아니라 자바스크립트 함수 호출 방식이어서, 그게 안됨.
        }

        let result = JSON.stringify(data, null, 2);
        res.end(result);
        await browser.close();
    } catch(err){
        console.log(err);
    }
}



async function getData(page) {
    
    let caseObj = {
        '사건번호' : '',
        '최근기일내용' : '',
        '최근제출서류' : ''
    };
    caseObj['사건번호'] = await page.$$eval('th', elems => elems.find(elem => elem.textContent === '사건번호')
                                                            .nextElementSibling.textContent);
    // let keys = Object.keys(giilObj);
    // keys.shift();

    caseObj['최근기일내용'] = await page.evaluate(() => {
        let tableElem = Array.from(document.querySelectorAll('caption'))
                                .find(elem => elem.textContent === '최근기일내용')
                                .parentElement;
        return tableElem.innerHTML
    });
    
    caseObj['최근제출서류'] = await page.evaluate(() => {
        let tableElem = Array.from(document.querySelectorAll('caption'))
                                .find(elem => elem.textContent === '최근 제출서류 접수내용')
                                .parentElement;
        return tableElem.innerHTML
    });

    return caseObj
}