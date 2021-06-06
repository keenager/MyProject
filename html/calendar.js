let temp = '스케쥴에서 달력버튼 누르면 현재 월이 아닌 해당 월로 이동하게?';
const present = new Date();
let thisYear = present.getFullYear();
let thisMonth = present.getMonth();  // 달 0~11
let thisDate = present.getDate();  // 날짜 1~31
let thisDay = present.getDay();  // 요일 0~6   일요일 = 0, 월요일 = 1
let firstDay = 0;
const lastDate = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let thisLastDay = 0;
let dateId = '';


function displayTitle(){
    document.getElementById("yearMonth").innerHTML = thisYear + '년 ' + (thisMonth+1) + '월';
}

function displayCalendar(){
    firstDay = getFirstDay(thisDate, thisDay);
    if(thisYear % 4 === 0) lastDate[1] = 29;
    //var cnt = 0;
    thisDate = 1;
    loop1:
    for (let i = 1; i <= 6; i++) {
        let weekTr = document.getElementById('w'+i);
        loop2:
        for (let j = 1; j <= 7; j++) {
            if (i === 1 && j < firstDay) {
                createTdIn(weekTr);
            } else {
                dateId = thisYear + '-' + modifyMonth(thisMonth) + '-' + modifyDate(thisDate);

                let thisTd = createTdIn(weekTr);
                thisTd.setAttribute('onclick', `location.href='/schedule.html?dateId=${dateId}'`);
                if (isToday(thisDate)) {
                    thisTd.setAttribute('style', 'border: 2px solid blue;');
                }

                setTd(thisTd, j, thisDate);

                let thisContentsWrap = document.getElementById(thisDate);
                displaySchedules(dateId, thisContentsWrap);

                if(thisDate === lastDate[thisMonth]){
                    thisLastDay = j;
                    break loop1;
                }
                thisDate++;
            }
        }
    }
}

function getFirstDay(thisDate, thisDay){    //해당 월의 1일의 요일
    if(thisDay === 0) thisDay = 7;
    var temp = thisDate % 7;
    if(temp === 1) return thisDay;
    else if(temp === 0) return (thisDay + 1);
    else if(temp - 1 < thisDay) return (thisDay - temp + 1);
    else return (thisDay + 7 - temp + 1);
}

function modifyMonth(m){
    let month = m + 1;
    let modifiedMonth = month < 10 ? '0'+month : month; 
    return modifiedMonth;
}

function modifyDate(d){
    let modifiedDate = d < 10 ? '0'+d : d; 
    return modifiedDate;
}

function createTdIn(elem){
    return elem.appendChild(document.createElement('td'));
}

function isToday(thisDate){
    return (thisYear === present.getFullYear()
        && thisMonth === present.getMonth()
        && thisDate === present.getDate()
    )
}

function setTd(td, day, date){
    let dateDiv = createDivIn(td);
    dateDiv.textContent = date;
    dateDiv.classList.add('day' + day);

    let scheduleDiv = createDivIn(td);
    scheduleDiv.classList.add('scheduleDiv');
    scheduleDiv.setAttribute('id', thisDate);
}

function displaySchedules(dateId, div){
    fetch('/db_read_calendar?dateId=' + dateId)
    .then(response => {
        if(response.status === 200) return response.json()
        else console.log(response.statusText);
    })
    .then(data => {
        for(e of data){
            let newDiv = createDivIn(div);

            if(e.schedule.includes('판결')){
                e.schedule = 'X ' + e.schedule + '&nbsp;&nbsp;';
            } else{
                e.schedule = '&nbsp;&nbsp;&nbsp;&nbsp;' + e.schedule + '&nbsp;&nbsp;';
            } 
            
            newDiv.innerHTML = e.schedule;
            newDiv.classList.add('contents');
            if(e.checked){
                newDiv.classList.add('checked');
            }
        }
    })
    .catch(err => {
        console.log(err);
    })
}

function createDivIn(elem){
    return elem.appendChild(document.createElement('div'));
}

function deleteCalendar() {
    for (let i = 1; i <= 6; i++) {
        let weekTr = document.getElementById('w'+i);
        while(weekTr.hasChildNodes()){
            weekTr.removeChild(weekTr.firstChild);
        }
    }
}

function presentMonth(){
    thisYear = present.getFullYear();
    thisMonth = present.getMonth();
    thisDate = present.getDate();
    thisDay = present.getDay();

    displayTitle();
    deleteCalendar();
    displayCalendar();
}

function prevMonth(){
    if(thisMonth === 0){
        thisYear -= 1;
        thisMonth = 11;
    }else{
        thisMonth -= 1; 
    }
    thisDate = lastDate[thisMonth];
    thisDay = firstDay - 1;

    displayTitle();
    deleteCalendar();
    displayCalendar();
}

function nextMonth(){
    if(thisMonth === 11){
        thisYear += 1;
        thisMonth = 0;
    }else{
        thisMonth += 1;
    }
    thisDate = 1;
    if(thisLastDay === 7) thisDay = 1;
    else thisDay = thisLastDay + 1;

    displayTitle();
    deleteCalendar()
    displayCalendar();
}