const present = new Date();
var thisYear = present.getFullYear();
var thisMonth = present.getMonth();  // 달 0~11
var thisDate = present.getDate();  // 날짜 1~31
var thisDay = present.getDay();  // 요일 0~6   일요일 = 0, 월요일 = 1
var thisTime = 0;
var firstDay = 0;
var lastDate = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var thisLastDay = 0;
var inputWindow;
var changeWindow;
var dateId = '';
var contentsId = '';
var storage = window.localStorage;

displayTitle();
displayCalendar();

function modifyMonth(m){
    let month = m + 1;
    let modifiedMonth = month < 10 ? '0'+month : month; 
    return modifiedMonth;
}

function modifyDate(d){
    let modifiedDate = d < 10 ? '0'+d : d; 
    return modifiedDate;
}

function getFirstDay(thisDate, thisDay){    //해당 월의 1일의 요일
    if(thisDay === 0) thisDay = 7;
    var temp = thisDate % 7;
    if(temp === 1) return thisDay;
    else if(temp === 0) return (thisDay + 1);
    else if(temp - 1 < thisDay) return (thisDay - temp + 1);
    else return (thisDay + 7 - temp + 1);
}

function displayTitle(){
    document.getElementById("yearMonth").innerHTML = thisYear + '년 ' + (thisMonth+1) + '월';
}

function deleteCalendar(){
    var i = 1;
    while(i <= 6){
        var week = document.getElementById('w'+i);
        while(week.hasChildNodes()){
            week.removeChild(week.firstChild);
        }
        i++;
    }
}

function displayCalendar(){
    firstDay = getFirstDay(thisDate, thisDay);
    if(thisYear % 4 === 0) lastDate[1] = 29;
    //var cnt = 0;
    thisDate = 1;
    loop1:
    for(let i = 1; i <= 6; i++){
        let week = document.getElementById('w'+i);
        loop2:
        for(let j = 1; j <= 7; j++){
            if(i===1 && j<firstDay){
                week.insertAdjacentHTML('beforeend', '<td></td>');
            }else{
                //cnt++;
                //dateId = '' + thisYear + (thisMonth+1) + thisDate;
                week.insertAdjacentHTML('beforeend', `
                    <td onclick="openInputWindow(this)">
                        <div class="day${j}">${thisDate}</div>
                        <div class="contentsWrap" id="${thisDate}"></div>
                    </td>
                `);

                // 오늘이면 강조 표시
                let contentsPart = document.getElementById(thisDate);
                if(thisYear === present.getFullYear() && thisMonth === present.getMonth() && thisDate === present.getDate()){
                    contentsPart.parentNode.setAttribute('style', 'border: 2px solid blue;');
                }

                dateId = '' + thisYear + modifyMonth(thisMonth) + modifyDate(thisDate);

                let scd = storage.getItem(dateId);

                // 스토리지에는 함께 저장돼있어도 출력할 때는 별개 항목으로 출력 필요.

                if(scd != null){
                    let splitedScd = scd.split('\n');
                    for(let e of splitedScd){
                        if(e.includes('판결')){
                            e = 'X ' + e + '&nbsp;&nbsp;';
                        } else{
                            e = '&nbsp;&nbsp;&nbsp;&nbsp;' + e + '&nbsp;&nbsp;';
                        } 
                        contentsPart.insertAdjacentHTML('beforeend', `<div class="contents">${e}</div>`);
                    }
                }          
                
                fetch('/test_process')
                    .then(response => {
                        if(response.status === 200){
                            return response.text()
                        } 
                        else console.log(response.statusText);
                    })
                    .then(data => {
                        contentsPart.insertAdjacentHTML('beforeend', `<div class="contents">${data}</div>`);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                
                
                if(thisDate === lastDate[thisMonth]){
                    thisLastDay = j;
                    break loop1;
                }
                thisDate++;
                
            }
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

function openInputWindow(self){
    //var schedule = prompt('일정을 입력하세요');
    //console.log('현재 객체는 ' + self);
    thisDate = Number(self.childNodes[1].textContent); 
    thisDay = Number(self.childNodes[1].className.split("")[3]);
    inputWindow = window.open('inputWindow.html', 'status = no, toolbar = no');    
}