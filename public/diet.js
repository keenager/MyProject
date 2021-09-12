const curDate = new Date();

//오늘 포함 최근 1주일의 요일을 배열로
const dayTemplateArr = ['일', '월', '화', '수', '목', '금', '토'];
let sevenDaysFromTodayArr = [];
for(let i = 0; i < 7; i++) {
    let temp = curDate.getDay() - i;
    temp = temp >= 0 ? temp : 7 - i;
    sevenDaysFromTodayArr[i] = dayTemplateArr[temp];
}

//config와 첫째날 설정
const w_config = new Config('line', sevenDaysFromTodayArr.reverse());
let w_date = new Date();
w_date.setDate(curDate.getDate() - 6);

//제목 표시
document.getElementById('week').textContent = `
    ${w_date.getMonth() + 1}월 ${w_date.getDate()}일 ~ ${curDate.getMonth() + 1}월 ${curDate.getDate()}일
`;

//화면 표시
displayChart( 'weeklyChart', w_config, w_date );

//-------------------

//오늘 포함 최근 1달의 날짜를 배열로
let thirtyDaysFromTodayArr = [];

const lastDate = beforeMonthLastDate(new Date());

for(let i = 0; i < 31; i++) {
    let temp = curDate.getDate() - i;
    temp = temp > 0 ? temp : lastDate + temp;
    thirtyDaysFromTodayArr[i] = temp;
}

//config와 첫째날 설정
const m_config = new Config( 'line', thirtyDaysFromTodayArr.reverse() );
let m_date = new Date();
m_date.setDate(m_date.getDate() - 30);

//제목 표시
let m_title = curDate.getMonth() + 1 + '월';
if(m_date.getMonth() !== curDate.getMonth()) {
    m_title = m_date.getMonth() + 1 + '~' + m_title;
}
document.getElementById('month').textContent = m_title;

//화면 표시
displayChart('monthlyChart', m_config, m_date);

//---------------

function Config(type, labels) {
    this.type = type;
    this.data = {
        labels: labels,
        datasets: [{
            label: '몸무게',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [],
        }]
    },
    this.options = {
        scales: {
            y: {
                min: 50,
                max: 60,
            }
        }
    }
}

function beforeMonthLastDate(dateObj) {
    dateObj.setDate(1);
    dateObj.setDate(dateObj.getDate() - 1);
    return dateObj.getDate()
}

function displayChart(elemId, config, date) {
    for(let i = 0; i < config.data.labels.length; i++) {
        let tempDate = new Date(date);
        tempDate.setDate(tempDate.getDate() + i);
        dateId = tempDate.getFullYear() + '-' + modifyMonth(tempDate.getMonth()) + '-' + modifyDate(tempDate.getDate());
        // dateId 를 이용해서 서버에서 weight 데이터 불러온 뒤,
        // w_config.data.datasets[0].data[i] 에 입력
        fetch('/diet/db_read/' + dateId)
        .then(response => {
            if(response.status === 200) return response.json()
            else console.log(response.statusText);
        })
        .then(result => {
            if(result){
                for(e of result){
                    config.data.datasets[0].data[i] = result[0].weight;
                }
                myChart.update();
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    let myChart = new Chart(
    document.getElementById(elemId),
    config
    );
}

function modifyMonth(m){
    let realMonth = m + 1;
    return realMonth < 10 ? '0'+realMonth : realMonth
}

function modifyDate(d){
    return d < 10 ? '0'+d : d; 
}