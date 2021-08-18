let scdConfig = {basis: 'fromToday'};
let scdData = {};

//저장된 스케줄
let listDiv = document.querySelector('#savedList ul');
let curSavedData = new Object();
let selectedDataTitle = '';
let lists = new Array();
if( localStorage.getItem('bookSchedule') === null ) {
    listDiv.parentElement.innerHTML = '저장된 자료가 없습니다.';
} else {
    curSavedData = JSON.parse(localStorage.getItem('bookSchedule'));
    lists = Object.keys(curSavedData);
    for(let list of lists) {
        listDiv.insertAdjacentHTML('beforeend', `
            <li><a href='javascript:void(0)'>${list}</a></li>
            `
        );
    }
}

//이벤트 처리
let inputs = document.querySelectorAll('input[type=radio]');
for (input of inputs) {
    input.onchange = event => {
        scdConfig.basis = event.currentTarget.value;
        setScd(+totalPage.value, +goalPage.value);
        displayScd(scdData);
        scdConfig.type = 'new';
        selectedDataTitle = '';
    }
}

calBtn.onclick = () => {
    setScd(+totalPage.value, +goalPage.value);
    displayScd(scdData);
    scdConfig.type = 'new';
    selectedDataTitle = '';
}

let listElemArr = Array.from(document.querySelectorAll('li > a'));
for(let listElem of listElemArr) {
    listElem.addEventListener('click', event => {
        selectedDataTitle = event.currentTarget.textContent;
        scdData = curSavedData[selectedDataTitle];
        displayScd(scdData);
        scdConfig.type = 'saved';
    });
}

saveBtn.onclick = () => {
    let title = prompt('책 제목을 입력하세요.', scdConfig.type === 'new' ? '' : selectedDataTitle);
    if(title === null) {
        return
    } else if(title === '') {
        title = '제목 없음';
    }
    curSavedData[title] = scdData;
    localStorage.setItem('bookSchedule', JSON.stringify(curSavedData, null, 2));
    location.reload();
}

delBtn.onclick = () => {
    if(scdConfig.type === 'new') {
        return
    }
    delete curSavedData[selectedDataTitle];
    localStorage.setItem('bookSchedule', JSON.stringify(curSavedData, null, 2));
    location.reload();
}

//함수
function calcScd(totalPage, goalpage) {
    scdConfig.day = Math.ceil(totalPage / goalpage);
    scdConfig.last = totalPage % goalpage;
}

function getYMD(idx) {
    let date = scdConfig.basis === 'fromToday' ? new Date() : new Date(specDate.value);
    date.setDate(date.getDate() + idx);
    return date
}

function setScd(totalPage, goalpage) {
    calcScd(totalPage, goalpage);
    scdData = {};
    let startPage = 1;
    let endPage;
    let ymdStr, pageStr;
    for (let i = 0; i < scdConfig.day; i++) {
        endPage = i === scdConfig.day - 1 ?
                startPage + scdConfig.last - 1 :
                startPage + goalpage - 1;
        ymdStr = `${getYMD(i).getFullYear()}년 ${getYMD(i).getMonth() + 1}월 ${getYMD(i).getDate()}일:`;
        pageStr =  `${startPage}쪽 ~ ${endPage}쪽`;
        scdData[ymdStr] = pageStr;
        startPage = endPage + 1;
    }
}

function displayScd(data) {
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    for(let key in data) {
        let newRow = tbody.insertRow(-1);
        newRow.insertCell(0).innerHTML = key;
        newRow.insertCell(1).innerHTML = data[key];        
        newRow.insertCell(2).innerHTML = "<input type='number'>";
    }
}