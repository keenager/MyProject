var present = new Date();
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
                    <td>
                        <div class="day${j}" onclick="openInputWindow(this)">${thisDate}</div><div class="contents" id="${thisDate}"> </div>
                    </td>
                `);

                let contentsPart = document.getElementById(thisDate);

                if(thisYear === present.getFullYear() && thisMonth === present.getMonth() && thisDate === present.getDate()){
                    contentsPart.parentNode.setAttribute('style', 'border: 2px solid blue;');
                }
                let k = 0;
                while(k <= 24){
                    dateId = '' + thisYear + modifyMonth(thisMonth) + modifyDate(thisDate) + '_' + k;
                    let scd = storage.getItem(dateId);
                    if(scd != null){
                        if(scd.includes('판결 선고') || scd.includes('판결선고')){
                            contentsPart.insertAdjacentHTML('beforeend', `
                                <div id="${dateId}" onclick="openChangeWindow(this)">
                                    X ${k}시: ${storage.getItem(dateId)}
                                </div>
                            `);
                        } else{
                            contentsPart.insertAdjacentHTML('beforeend', `
                                <li id="${dateId}" onclick="openChangeWindow(this)">
                                    ${k}시: ${storage.getItem(dateId)}
                                </li>
                            `);
                        }

                        // var li = document.createElement('li');
                        // contents.appendChild(li).textContent = k + '시: ' + storage.getItem(dateId + k);
                    }
                    k++;
                }
                if(thisDate === lastDate[thisMonth]){
                    thisLastDay = j;
                    break loop1;
                }
                thisDate++;
                
            }
        }
    }
}

displayTitle();
displayCalendar();


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
    thisDate = Number(self.textContent);    
    thisDay = Number(self.className.split("")[3]);
    inputWindow = window.open('inputWindow.html', 'status = no, toolbar = no');    
}

function openChangeWindow(self){ 
    thisDate = Number(self.parentNode.id);    
    thisDay = Number(self.parentNode.previousSibling.className.split("")[3]);
    thisTime = Number(self.id.split("_")[1]);
    changeWindow = window.open('changeWindow.html', 'status = no, toolbar = no');
}

