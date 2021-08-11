 getCookie().then(result => {
    document.getElementById('cookie').textContent = result;
 });

document.querySelector('button').addEventListener('click', async (event) => {
    let caseList = await getCaseList();
    displayList(caseList);
});

async function getCookie() {
    let response = await fetch('/case/cookie_read');
    let data = await response.text();
    return data
}

async function getCaseList() {
    let response = await fetch('/case/caseList_read');
    let data = await response.text();
    return data
}

function displayList(list) {
    let listElem = document.getElementById('caseList');
    listElem.innerHTML = list;

    let elems = document.querySelectorAll('b a');
    for(let elem of elems) {
        elem.setAttribute('onclick', 'handleCaseContent(this)');
    }
}

async function handleCaseContent(elem) {
    let caseContent = await getCaseContent(elem.textContent);
    displayContent(caseContent);
}

async function getCaseContent(caseNumber) {
    let response = await fetch('/case/caseContent_read/' + caseNumber);
    let data = await response.json();
    return data
}

function displayContent(content) {
    let contentElem = document.getElementById('caseContent');
    contentElem.innerHTML = '';
    for(key in content) {
        contentElem.insertAdjacentHTML('beforeend', '<table>' + content[key] + '</table><br>');
    }
}