let savedAllData = new Object();  //로컬스토리지에 저장된 전체 데이터를 담을 공간
/* 
{ title1: { data: [
                      [ ymd, goal, fulfilled ],
                      [ ymd, goal, fulfilled ],
                              ... ,
                 ],
            config: {}
          },
              
  title2: {},
}
*/
let scdData = { data: [],
                config: {
                    basis: 'fromToday',
                    type: 'new',
                    title: '새로운 책',
                    totalPage: '',
                    goalPage: '',
                    specDate: '',
                    partNum: 0,
                    partArr: [],
                    partLastIdx: [],
                }
            };

//저장된 스케줄 목록 표시
let listDiv = document.querySelector('#savedList ul');
let lists = [];
if( localStorage.getItem('bookSchedule') === '{}' || localStorage.getItem('bookSchedule') === null ) {
    listDiv.parentElement.innerHTML = '저장된 자료가 없습니다.';
} else {
    savedAllData = JSON.parse(localStorage.getItem('bookSchedule'));
    lists = Object.keys(savedAllData);
    for(let list of lists) {
        listDiv.insertAdjacentHTML('beforeend', `
            <li><a href='javascript:void(0)'>${list}</a></li>
            `
        );
    }
}

//이벤트 처리

partBtn.onclick = () => {
    partition.innerHTML = '';
    let num = partNum.value;
    if(num <= 1) {
        scdData.config.isParted = false;
        return
    }
    for(let i = 0; i < num; i++) {
        partition.insertAdjacentHTML('beforeend', `
            <input type='number' name='start${i}'>쪽 ~ <input type='number' name='end${i}'>쪽
            <br>
        `);
    }
    scdData.config.isParted = true;
}

let radioInputs = document.querySelectorAll('input[type=radio]');
for (input of radioInputs) {
    input.onchange = event => {
        calBtn.click();
        // updateConfig(event.target.value, 'new', '새로운 책', +totalPage.value, +goalPage.value, specDate.value, partNum.value, scdData.config.partArr);
        // if(partNum.value <= 1) setScd(+totalPage.value, +goalPage.value);
        // else setScd2(+goalPage.value, scdData.config.partArr);
        // displayScd(scdData);
    }
}

calBtn.onclick = () => {
    if(partNum.value <= 1) {
        updateConfig(
            fromToday.checked ? fromToday.value : fromSpecDate.value,
            'new', '새로운 책', +totalPage.value, +goalPage.value, specDate.value,
            1, []
        );
        setScd(+totalPage.value, +goalPage.value);
        displayScd(scdData);
    } else {
        let partArr = [];
        for(let i = 0; i < partNum.value; i++) {
            partArr[i] = {
                start: document.querySelector(`input[name='start${i}']`).value,
                end: document.querySelector(`input[name='end${i}']`).value
            };
        }
        updateConfig(
            fromToday.checked ? fromToday.value : fromSpecDate.value,
            'new', '새로운 책', +totalPage.value, +goalPage.value, specDate.value,
            partNum.value, partArr
        );
        setScd2(+goalPage.value, partArr);
        displayScd(scdData);
    }
}

initBtn.onclick = () => {
    location.reload();
}

   //저장된 목록에 이벤트 추가
let listElemArr = Array.from(document.querySelectorAll('li > a'));
for(let listElem of listElemArr) {
    listElem.addEventListener('click', event => {
        scdData = JSON.parse(JSON.stringify(savedAllData[event.target.textContent]));  // Deep Copy
        displayScd(scdData);
    });
}

updateBtn.onclick = () => {
    if(scdData.config.partNum < 2) {
        scdData.data = updateScd(scdData.data, 1, +totalPage.value, +goalPage.value).slice();
    } else {
        scdData.data = updateScd2(scdData.data, +goalPage.value, scdData.config.partArr).slice();
    }
    displayScd(scdData);
}

saveBtn.onclick = () => {
    let title = prompt('책 제목을 입력하세요.', scdData.config.title);
    if(title === null) {
        return
    } else if(title === '') {
        title = '제목 없음';
    }
    scdData.config.type = 'saved';
    scdData.config.title = title;
    savedAllData[title] = scdData;
    localStorage.setItem('bookSchedule', JSON.stringify(savedAllData));
    location.reload();
}

delBtn.onclick = () => {
    if(scdData.config.type === 'new') {
        return
    }
    delete savedAllData[scdData.config.title];
    localStorage.setItem('bookSchedule', JSON.stringify(savedAllData));
    location.reload();
}

//함수
function updateConfig(basis, type, title, total, goal, spec, num, arr) {
    scdData.config.basis = basis;
    scdData.config.type = type;
    scdData.config.title = title;
    scdData.config.totalPage = total;
    scdData.config.goalPage = goal;
    scdData.config.specDate = spec;
    scdData.config.partNum = num;
    scdData.config.partArr = arr;
}

function getYMD(idx) {
    let date = scdData.config.basis === 'fromToday' ? new Date() : new Date(specDate.value);
    date.setDate(date.getDate() + idx);
    return date
}

function setScd(totalPage, oneDayGoal) {
    if(scdData.config.type === 'new') {
        scdData.data = [];
    }

    let startPage = 1;
    let ymdStr, goalStr;
    let dateCount = 0;

    while(startPage <= totalPage) {
        let result = startPage + oneDayGoal - 1;
        let goalPage = result < totalPage ? result : totalPage;
        ymdStr = getYMD(dateCount).getFullYear() + '-' + (getYMD(dateCount).getMonth() + 1) + '-' + getYMD(dateCount).getDate();
        goalStr = startPage + '~' + goalPage;
        scdData.data[dateCount] = [ymdStr, goalStr];
        startPage = goalPage + 1;
        dateCount++;
    }
}

function setScd2(oneDayGoal, arr) { 
    if(scdData.config.type === 'new') {
        scdData.data = [];
    }
    let idx = 0;  //계획표 tr의 인덱스
    let dateCount = 0;
    let jaturi = 0;

    for(let i = 0; i < arr.length; i++) {
        let ymdStr, goalStr;
        let startPage = +arr[i].start;
        if(jaturi) {
            startPage += jaturi;
        }
        let endPage = +arr[i].end;

        while(startPage <= endPage) {
            let result = startPage + oneDayGoal - 1;
            let goalPage;
            if(result < endPage) {
                goalPage = result;
                jaturi = 0;
            } else {
                goalPage = endPage;
                jaturi = result - endPage;
                scdData.config.partLastIdx[i] = idx;
            }
            ymdStr = getYMD(dateCount).getFullYear() + '-' + (getYMD(dateCount).getMonth() + 1) + '-' + getYMD(dateCount).getDate();
            goalStr = startPage + '~' + goalPage;
            scdData.data[idx] = [ymdStr, goalStr];  //저장
            idx++;
            startPage = goalPage + 1;
            dateCount++;
        }
        if(jaturi && i < arr.length - 1) {     // 자투리가 있고, 마지막 파티션이 아닐 경우
            let nextPartStartPage = +arr[i + 1].start;
            goalStr = nextPartStartPage + '~' + (nextPartStartPage + jaturi - 1);
            scdData.data[idx] = [ymdStr, goalStr];  //저장
            idx++;
        }
    }
}

function updateScd(data, start, totalPage, oneDayGoal, inputElems = Array.from(document.querySelectorAll('tbody tr input'))) {       //updateScd2를 따로 만들지, partArr를 추가인자로 받아서 하나로 할 지...
    let tempData = JSON.parse(JSON.stringify(data));  //tempData로 복사
    let startPage = start;
    let i = 0;
    let jaturi = 0;
    let isPassed = false;

    while(startPage <= totalPage) { 
        let fulfilledPage = +inputElems[i].value;
        // 입력한 값이 있을 때
        if(fulfilledPage) {  
            //입력칸 앞에 진도가 안나간 날이 있는 경우, 직전칸 startPage가 아니라, 마지막 진도 나간 날의 다음 날의 startPage를 구함.
            startPage = getNextPageOfLastFulfilled(tempData);
            
            if(fulfilledPage < totalPage) {
                tempData[i][2] = startPage + '~' + fulfilledPage;  // 실행 내역 저장
                startPage = fulfilledPage + 1;
                isPassed = true;
            } else {
                tempData[i][2] = startPage + '~' + totalPage;
                tempData.splice(i + 1);
                return tempData
            }       
        } else if(isPassed) {
            // 입력칸 이후  
            let result = startPage + oneDayGoal - 1;
            if(result < totalPage) {
                //총 페이지에 도달하지 못한 경우
                tempData[i][1] = startPage + '~' + result;
                startPage = result + 1;
                if(i === tempData.length - 1) {
                    //종전 계획표의 마지막 일정에 도달한 경우(연장되는 경우)
                    jaturi = totalPage - result;
                    break  // while문 벗어나서 아래의 if(jaturi)문으로.
                }
            } else {  
                //총 페이지에 도달한 경우
                tempData[i][1] = startPage + '~' + totalPage;
                tempData.splice(i + 1);
                return tempData
            } 
        }
        i++;
    }

    if(jaturi) {
        //원래 계획보다 기간이 연장되는 경우
        let lastDate = new Date(tempData[i][0]);
        let count = Math.ceil(jaturi / oneDayGoal);
        for(let j = 1; j <= count; j++) {
            lastDate.setDate(lastDate.getDate() + j);
            let ymdStr = getYMDstr(lastDate);
            let result = startPage + oneDayGoal - 1;
            result = result < totalPage ? result : totalPage;
            let goalStr = startPage + '~' + result;
            tempData[i + j] = [ymdStr, goalStr];
        }
    }
    return tempData
}

// 각 파트를 점선 등으로 구별하면 좋을 듯.
// 진도가 밀려서 자투리나 다음 파트에서 이전 파트 부분 한 경우 -> 파트별 완성 여부 체크하는 변수 설정.
function updateScd2(data, oneDayGoal, arr) {
    let tempData = JSON.parse(JSON.stringify(data));
    let idx = 0;  //계획표 tr의 인덱스
    let dateCount = 0;
    let jaturi = 0;
    const inputElems = Array.from(document.querySelectorAll('tbody tr input'));
    let fulfilledPage;

    for(let i = 0; i < arr.length; i++) {
        let ymdStr, goalStr;
        let startPage = +arr[i].start;
        if(jaturi) {
            startPage += jaturi;
        }
        let endPage = +arr[i].end;

        while(startPage <= endPage) {
            if(idx < data.length && tempData[idx][2]) {  //실제 실행 페이지가 반영되어 있는 경우
                let savedFulfilledPage = +tempData[idx][2].split('~')[1];
                startPage = savedFulfilledPage + 1;
                if(savedFulfilledPage < +arr[i].start || savedFulfilledPage > +arr[i].end) {
                    endPage = +arr[i - 1].end;
                    i = i - 1;
                }
                idx++;
                dateCount++;
                continue
            }

            let result = startPage + oneDayGoal - 1;
            let goalPage;
            if(result < endPage) {
                goalPage = result;
                jaturi = 0;
            } else {  //마지막 페이지에 도달한 경우
                goalPage = endPage;
                jaturi = result - endPage;
                scdData.config.partLastIdx[i] = idx;
            }
            //날짜 설정
            let startDate = new Date(tempData[0][0]);
            startDate.setDate(startDate.getDate() + dateCount);
            ymdStr = getYMDstr(startDate);
            //목표 설정
            goalStr = startPage + '~' + goalPage;
            //저장(인풋 없는 경우)
            tempData[idx] = [ymdStr, goalStr];
            //저장(인풋 있는 경우)
            if(idx < data.length) {
                fulfilledPage = +inputElems[idx].value;
            }
            if(fulfilledPage) {  
                startPage = getNextPageOfLastFulfilled(tempData);
                tempData[idx][2] = startPage + '~' + fulfilledPage;
                if(fulfilledPage == endPage) {
                    scdData.config.partLastIdx[i] = idx;
                }
                goalPage = fulfilledPage;
                //입력한 페이지가 해당칸이 속한 파트가 아니라 이전 파트에 해당하는 경우에 관한 처리
                if(fulfilledPage < +arr[i].start || fulfilledPage > +arr[i].end) {
                    endPage = +arr[i - 1].end;
                    i = i - 1;
                }
            }
            if(i === arr.length - 1 && goalPage === endPage) {  //마지막 파트, 마지막 페이지
                tempData.splice(idx + 1);
                return tempData
            }
            startPage = goalPage + 1;
            idx++;
            dateCount++;
        }
        if(jaturi && i < arr.length - 1) {     // 자투리가 있고, 마지막 파티션이 아닐 경우
            let nextPartStartPage = +arr[i + 1].start;
            goalStr = nextPartStartPage + '~' + (nextPartStartPage + jaturi - 1);
            tempData[idx] = [ymdStr, goalStr];  //저장
            idx++;
        }
    }
    return tempData
}

function updateScd3(oneDayGoal, arr) {    
    let cuttedScd = [];
    let startIdx = 0;
    for(let i = 0; i < arr.length; i++) {
        let lastOfPart = scdData.data.find(item => item[1].includes(arr[i].end));
        let idxOfLast = scdData.data.indexOf(lastOfPart);
        cuttedScd[i] = scdData.data.slice(startIdx, ++idxOfLast);
        console.log(cuttedScd[i]);
        startIdx = idxOfLast;
    }

    let newScd = [];
    startIdx = 0;

    for(let i = 0; i < cuttedScd.length; i++) {
        let partStartPage = +arr[i].start;
        let partTotalPage = +arr[i].end;
        let inputElems = Array.from(document.querySelectorAll('tbody tr input'));
        inputElems = inputElems.slice(startIdx, startIdx + cuttedScd[i].length);
        console.log(inputElems);
        newScd.concat( updateScd(cuttedScd[i], partStartPage, partTotalPage, oneDayGoal, inputElems) );
        startIdx += cuttedScd[i].length;
    }

    return newScd
}

function getYMDstr(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
}

function getNextPageOfLastFulfilled(data) {
    let fulfilledFilter = data.filter(item => item[2]);
    let indexOfLastFulfilled = data.indexOf(fulfilledFilter[fulfilledFilter.length - 1])
    let startData = data[indexOfLastFulfilled + 1];
    return +startData[1].split('~')[0]
}

function displayScd(scdData) {
    totalPage.value = scdData.config.totalPage;
    goalPage.value = scdData.config.goalPage;
    partNum.value = scdData.config.partNum;
    if(partNum.value >= 2) {
        partBtn.click();
        let inputArr = Array.from(partition.querySelectorAll('input'));
        let partArr = scdData.config.partArr;
        for(let i = 0; i < inputArr.length; i++) {
            let rowIndex = Math.floor(i / 2);
            let str = i % 2 === 0 ? 'start' : 'end';
            inputArr[i].value = partArr[rowIndex][str];
        }
    }

    if(scdData.config.basis === 'fromToday') {
        fromToday.checked = true;
    } else {
        fromSpecDate.checked = true;
    }
    specDate.value = scdData.config.specDate;
    
    let titleElem = document.querySelector('table > caption');
    titleElem.textContent = scdData.config.title;
    
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    scdData.data.forEach( (item, index) => {
        let newRow = tbody.insertRow(-1);
        newRow.insertCell(0).innerHTML = item[0];
        newRow.insertCell(1).innerHTML = item[1];        
        newRow.insertCell(2).innerHTML = "<input type='number'>";
        newRow.insertCell(3).innerHTML = item[2] || '';
        if(scdData.config.partLastIdx.includes(index)) {
            newRow.classList.add('last_page');
        } 
    });
}