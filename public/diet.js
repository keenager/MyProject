let w_config = new Config('line', ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']);
let w_date = new Date();
w_date.setDate( 
    w_date.getDate() 
    - ( w_date.getDay() == 0 ? 6 : w_date.getDay() - 1 ) 
);   // 이번 주 월요일의 날짜를 구해서 첫 날로 지정.

let temp = new Date(w_date);
temp.setDate(w_date.getDate() + 6);
document.getElementById('thisWeek').textContent = `
    ${w_date.getMonth() + 1}월 ${w_date.getDate()}일 ~ ${temp.getMonth() + 1}월 ${temp.getDate()}일
`;
displayChart( 'weeklyChart', w_config, w_date );

let m_date = new Date();
document.getElementById('thisMonth').textContent = m_date.getMonth() + 1 + '월';
function dateArr() {
    let arr = [];
    let n = 32 - new Date( m_date.getFullYear(), m_date.getMonth(), 32 ).getDate();   // 이번 달이 몇일까지 있는지 구하기. 또는 lastDate[date.getMonth()]
    for (let i = 0; i < n; i++) {
        arr[i] = i + 1;
    }
    return arr;
}
let m_config = new Config( 'line', dateArr() );
m_date.setDate(1);
displayChart('monthlyChart', m_config, m_date);


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
                max: 70,
            }
        }
    }
}

function displayChart(elemId, config, date) {
    for(let i = 0; i < config.data.labels.length; i++) {
        dateId = date.getFullYear() + '-' + modifyMonth(date.getMonth()) + '-' + modifyDate(date.getDate() + i);
        // dateId 를 이용해서 서버에서 weight 데이터 불러온 뒤,
        // w_config.data.datasets[0].data[i] 에 입력
        fetch('/diet/db_read/' + dateId)
        .then(response => {
            if(response.status === 200) return response.json()
            else console.log(response.statusText);
        })
        .then(data => {
            if(data){
                for(e of data){
                    config.data.datasets[0].data[i] = e.weight;
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