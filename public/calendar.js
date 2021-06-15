//'스케쥴에서 달력버튼 누르면 현재 월이 아닌 해당 월로 이동하게?';
let present = new Date();
const lastDate = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

displayTitle();
displayCalendar();

document.getElementById('prsMonthBtn').addEventListener('click', event => presentMonth());
document.getElementById('prevMonthBtn').addEventListener('click', event => prevMonth());
document.getElementById('nextMonthBtn').addEventListener('click', event => nextMonth());
document.getElementById('srchBtn').addEventListener('click', event => 
    window.open('https://safind.scourt.go.kr/sf/mysafind.jsp')
);

function displayTitle(){
    document.getElementById("yearMonth").innerHTML = present.getFullYear() + '년 ' + (present.getMonth() + 1) + '월';
}

function displayCalendar(){
    let year = present.getFullYear();
    let month = present.getMonth();
    let temp = new Date(year, month);
    let firstDay = temp.getDay() || 7;
    
    if(year % 4 === 0) lastDate[1] = 29;
    let date = 1
    loop1:
    for (let i = 1; i <= 6; i++) {
        let weekTr = document.getElementById('w'+i);
        loop2:
        for (let j = 1; j <= 7; j++) {
            if (i === 1 && j < firstDay) {
                createTdIn(weekTr);
            } else {
                let dateId = year + '-' + modify(month + 1) + '-' + modify(date);

                let thisTd = createTdIn(weekTr);
                thisTd.setAttribute('id', dateId);
                thisTd.addEventListener('click', event => location.href='/calendar/schedule/' + thisTd.id);
                if (isToday(year, month, date)) {
                    thisTd.setAttribute('style', 'border: 2px solid blue;');
                }

                setTd(thisTd, j, date);

                let thisContentsWrap = document.getElementById(date);
                displaySchedules(dateId, thisContentsWrap);

                if(date === lastDate[month]){
                    break loop1;
                }
                date++;
            }
        }
    }
}

function modify(num) {
    return ('0' + num).slice(-2)
}

function createTdIn(elem){
    return elem.appendChild(document.createElement('td'));
}

function isToday(year, month, date){
    let temp = new Date();
    return year === temp.getFullYear() 
        && month === temp.getMonth()
        && date === temp.getDate()
}

function setTd(td, day, date){
    let dateDiv = createDivIn(td);
    dateDiv.textContent = date;
    dateDiv.classList.add('day' + day);

    let scheduleDiv = createDivIn(td);
    scheduleDiv.classList.add('scheduleDiv');
    scheduleDiv.setAttribute('id', date);
}

function displaySchedules(dateId, div){
    fetch('/calendar/db_read/' + dateId)
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
        return err
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
    present = new Date();
    refresh();
}

function prevMonth(){
    present.setMonth(present.getMonth() - 1);
    refresh();
}

function nextMonth(){
    present.setMonth(present.getMonth() + 1);
    refresh();
}

function refresh() {
    displayTitle();
    deleteCalendar();
    displayCalendar();
}