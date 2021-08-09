 getCookie().then(result => {
    document.getElementById('cookie').textContent = result;
 });

document.querySelector('button').addEventListener('click', async (event) => {
    let caseList = await getCaseList();
    display(caseList);
});

async function getCookie() {
    let response = await fetch('/case/cookie_read');
    let data = await response.text();
    return data
}

async function getCaseList() {
    let response = await fetch('/case/case_read');
    let data = await response.json();
    return data
}

function display(cases) {
    let listElem = document.getElementById('caseList');
    for(aCase of cases) {
        for(key in aCase) {
            listElem.insertAdjacentHTML('beforeend', '<table>' + aCase[key] + '</table><br>');
        }
        listElem.insertAdjacentHTML('beforeend', '----------------------------------------------------------');
    }
}