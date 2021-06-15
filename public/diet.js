let w_config = new Config('line', ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']);
let date = new Date();
date.setDate( 
    date.getDate() 
    - ( date.getDay() == 0 ? 6 : date.getDay() - 1 ) 
);   // 이번 주 월요일의 날짜를 구해서 첫 날로 지정.

let temp = new Date(date);
temp.setDate(date.getDate() + 6);
document.getElementById('thisWeek').textContent = `
    ${date.getMonth() + 1}월 ${date.getDate()}일 ~ ${temp.getMonth() + 1}월 ${temp.getDate()}일
`;
displayChart( 'weeklyChart', w_config, date.getDate() );


document.getElementById('thisMonth').textContent = date.getMonth() + 1 + '월';
function dateArr() {
    let arr = [];
    let n = 32 - new Date( date.getFullYear(), date.getMonth(), 32 ).getDate();   // 이번 달이 몇일까지 있는지 구하기. 또는 lastDate[date.getMonth()]
    for (let i = 0; i < n; i++) {
        arr[i] = i + 1;
    }
    return arr;
}
let m_config = new Config( 'line', dateArr() );
displayChart('monthlyChart', m_config, 1);


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

function displayChart(elemId, config, startDate) {
    for(let i = 0; i < config.data.labels.length; i++) {
        dateId = date.getFullYear() + '-' + modifyMonth(date.getMonth()) + '-' + modifyDate(i + startDate);
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
    let month = m + 1;
    let modifiedMonth = month < 10 ? '0'+month : month; 
    return modifiedMonth;
}

function modifyDate(d){
    let modifiedDate = d < 10 ? '0'+d : d; 
    return modifiedDate;
}