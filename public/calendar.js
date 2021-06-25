//'스케쥴에서 달력버튼 누르면 현재 월이 아닌 해당 월로 이동하게?';
let present = new Date();

displayTitle();
displayCalendar();

document.getElementById('prsMonthBtn').addEventListener('click', presentMonth);
document.getElementById('prevMonthBtn').addEventListener('click', prevMonth);
document.getElementById('nextMonthBtn').addEventListener('click', nextMonth);
document.getElementById('srchBtn').addEventListener('click', () => 
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
    
    loop1:
    for (let i = 1; i <= 6; i++) {
        let weekTr = document.getElementById('w'+i);
        loop2:
        for (let j = 1; j <= 7; j++) {
            let date = temp.getDate();
            if (i === 1 && j < firstDay) {
                createTdIn(weekTr);
            } else {
                let dateId = year + '-' + modify(month + 1) + '-' + modify(date);

                let thisTd = createTdIn(weekTr);
                thisTd.setAttribute('id', dateId);
                thisTd.addEventListener('click', event => location.href='/calendar/schedule/' + thisTd.id);
                if (isToday(year, month, date)) {
                    thisTd.classList.add('today');
                }

                displaySchedules( dateId, setTd(thisTd, date) );

                temp.setDate(date + 1);
                if(month !== temp.getMonth()) break loop1;
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

function setTd(td, date){
    let dateDiv = createDivIn(td);
    dateDiv.textContent = date;
    dateDiv.classList.add('date');

    let scheduleDiv = createDivIn(td);
    scheduleDiv.classList.add('scheduleDiv');
    return scheduleDiv;
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
    let weekTr = document.querySelectorAll('tbody tr');
    for (let tr of weekTr) {
        while(tr.hasChildNodes()) {
            tr.removeChild(tr.firstChild);
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