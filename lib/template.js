exports.calendar = function(req, res) {
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Calendar for MIYOUNG</title>
        <meta charset="utf8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="calendar.css">
    </head>
    <body>

        <div id="mySidenav" class="sidenav">
            <a href="javascript:void(0)" class="closebtn">&times;</a>
            <a href="/calendar">Calendar</a>
            <a href="/diet">Diet Management</a>
        </div>

        <table>
            <colgroup>
                <col span="5" style="width: 18%;">
                <col span="2" style="width: 5%;">
            </colgroup>
            <thead>
                <tr>
                    <td colspan="7">
                        <span style="font-size:1rem; cursor:pointer;" class="menubtn">&#9776; menu</span>
                        <button id='prsMonthBtn'>이번 달</button>
                        <button id='prevMonthBtn'><</button>
                        <span id="yearMonth"></span>
                        <button id='nextMonthBtn'>></button>
                        <button id='srchBtn'>사건 검색</button>
                    </td>
                </tr>
                <tr>
                    <td>월요일</td>
                    <td>화요일</td>
                    <td>수요일</td>
                    <td>목요일</td>
                    <td>금요일</td>
                    <td>토요일</td>
                    <td>일요일</td>
                </tr>
            </thead>
            <tbody>
                <tr id="w1"></tr>
                <tr id="w2"></tr>
                <tr id="w3"></tr>
                <tr id="w4"></tr>
                <tr id="w5"></tr>
                <tr id="w6"></tr>
            </tbody>
        </table>
        <script src="calendar.js"></script>
        <script src="sideNavi.js"></script>
    </body>
    </html>
    `;
    res.send(html);
}

exports.schedule = function(req, res) {
    let html = `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="/schedule.css">
            <title>Schedule list</title>
        </head>
        <body>
            <button id="toCalendarButton">달력</button> 
            <h2>Schedule List (<span id='titleDate'>${req.params.dateId}</span>)</h2>
            <form action="/calendar/db_write" method="post" onsubmit="return inputCheck(this)">
                <input type="hidden" name="dateId" value="${req.params.dateId}">
                <input type="text" name="schedule" id="scheduleInput" autofocus>
                <input type="submit" id="save" value="저장">
            </form>
            
            <div id="scheduleList"></div>
        
            <br><br>
            <h2>몸무게 입력</h2>
            <form action="/diet/db_write" method="post" onsubmit="return inputCheck(this)">
                <input type="hidden" name="${req.params.dateId}">
                <input type="number" name="weight" placeholder="목표는 50kg 대...!">
                <input type="submit" value="저장">
            </form>
        
            <div id="weightList">
                오늘의 몸무게 = <span id="weight"></span>
            </div>
        
            <script src="/schedule.js"></script>
        </body>
        </html>
    `;
    res.send(html);
}

exports.diet = function(req, res) {
    let html = `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Diet Management</title>
            <link rel="stylesheet" href="calendar.css">
        </head>
        <body>
        
            <div id="mySidenav" class="sidenav">
                <a href="javascript:void(0)" class="closebtn">&times;</a>
                <a href="/calendar">Calendar</a>
                <a href="/diet">Diet Management</a>
            </div>
            <span style="font-size:30px;cursor:pointer;" class="menubtn">&#9776; menu</span>
        
            <ul>
                <li>이번 주 보기</li>
        
                    <div>
                        <canvas id="weeklyChart"></canvas>
                    </div>
        
                <li>이번 달(<span id="thisMonth"></span>) 보기</li>
                    <div>
                        <canvas id="monthlyChart"></canvas>
                    </div>
            </ul>
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <script src="diet.js"></script>
            <script src="sideNavi.js"></script>
        </body>
        </html>
    `;
    res.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Security-Policy': `script-src 'self' https://cdn.jsdelivr.net`,
    });
    res.end(html);
}