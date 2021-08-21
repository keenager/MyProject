let scdConfig = {
    basis: 'fromToday',
    type: 'new',
    title: '새로운 책',
    totalPage: '',
    goalPage: '',
    specDate: '',
};
let scdData = {};  // data + config
let curSavedData = new Object();

//저장된 스케줄
let listDiv = document.querySelector('#savedList ul');
let lists = [];
if( localStorage.getItem('bookSchedule') === '{}' || localStorage.getItem('bookSchedule') === null ) {
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
        updateConfig(event.currentTarget.value, 'new', '새로운 책', +totalPage.value, +goalPage.value, specDate.value);
        setScd(+totalPage.value, +goalPage.value);
        displayScd(scdData);
    }
}

calBtn.onclick = () => {
    updateConfig(
        fromToday.checked ? fromToday.value : fromSpecDate.value,
        'new', '새로운 책', +totalPage.value, +goalPage.value, specDate.value
    );
    setScd(+totalPage.value, +goalPage.value);
    displayScd(scdData);
}

let listElemArr = Array.from(document.querySelectorAll('li > a'));
for(let listElem of listElemArr) {
    listElem.addEventListener('click', event => {
        scdData = curSavedData[event.currentTarget.textContent];
        updateConfig(
            scdData['scdConfig'].basis, 
            'saved', 
            event.currentTarget.textContent, 
            scdData['scdConfig'].totalPage,
            scdData['scdConfig'].goalPage,
            scdData['scdConfig'].specDate
        );
        displayScd(scdData);
    });
}

saveBtn.onclick = () => {
    let title = prompt('책 제목을 입력하세요.', scdConfig.title);
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
    delete curSavedData[scdConfig.title];
    localStorage.setItem('bookSchedule', JSON.stringify(curSavedData, null, 2));
    location.reload();
}

initBtn.onclick = () => {
    location.reload();
}

updateBtn.onclick = () => {
    updateScd(+totalPage.value, +goalPage.value);
    displayScd(scdData);
}

//함수
function updateConfig(basis, type, title, total, goal, spec) {
    scdConfig.basis = basis;
    scdConfig.type = type;
    scdConfig.title = title;
    scdConfig.totalPage = total;
    scdConfig.goalPage = goal;
    scdConfig.specDate = spec;
}

function getYMD(idx) {
    let date = scdConfig.basis === 'fromToday' ? new Date() : new Date(specDate.value);
    date.setDate(date.getDate() + idx);
    return date
}

function setScd(totalPage, goalPage) {
    if(scdConfig.type === 'new') {
        scdData = {};
    }

    let startPage = 1;
    let endPage;
    let ymdStr, pageStr;
    let i = 0;

    while(startPage <= totalPage) {
        let result = startPage + goalPage - 1;
        endPage = result < totalPage ? result : totalPage;
        ymdStr = getYMD(i).getFullYear() + '-' + (getYMD(i).getMonth() + 1) + '-' + getYMD(i).getDate();
        pageStr = startPage + '~' + endPage;
        scdData[ymdStr] = pageStr;
        startPage = endPage + 1;
        i++;
    }
    scdData['scdConfig'] = scdConfig;
}

function updateScd(totalPage, goalPage) {
    let tempData = {};
    let startPage = 1;
    let endPage;
    let ymdStr, pageStr;
    let i = 0;
    let isPassed = false;
    let inputElems = Array.from(document.querySelectorAll('tbody tr input'));

    while(startPage <= totalPage) { 
        ymdStr = getYMD(i).getFullYear() + '-' + (getYMD(i).getMonth() + 1) + '-' + getYMD(i).getDate();

        let exePage = '';
        if(inputElems[i] && inputElems[i].value) {
            exePage = inputElems[i].value;
        
            let result = (isFinite(exePage) && exePage !== '' && exePage !== null) ?
                            +exePage :
                            startPage + goalPage - 1;
            endPage = result < totalPage ? result : totalPage;
            isPassed = true;
        } else if(isPassed) {
            let result = startPage + goalPage - 1;
            endPage = result < totalPage ? result : totalPage;
        } else {
            endPage = +scdData[ymdStr].split('~')[1];
        }

        pageStr = startPage + '~' + endPage;
        tempData[ymdStr] = pageStr;
        startPage = endPage + 1;
        i++;
    }
    scdData = tempData;
    scdData['scdConfig'] = scdConfig;
}

function displayScd(data) {
    totalPage.value = scdConfig.totalPage;
    goalPage.value = scdConfig.goalPage;
    if(scdConfig.basis === 'fromToday') {
        fromToday.checked = true;
    } else {
        fromSpecDate.checked = true;
    }
    specDate.value = scdConfig.specDate;
    
    let titleElem = document.querySelector('thead > tr > th');
    titleElem.textContent = scdConfig.title;
    
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    for(let key in data) {
        if(key === 'scdConfig') continue
        let newRow = tbody.insertRow(-1);
        newRow.insertCell(0).innerHTML = key;
        newRow.insertCell(1).innerHTML = data[key];        
        newRow.insertCell(2).innerHTML = "<input type='number'>";
    }
}