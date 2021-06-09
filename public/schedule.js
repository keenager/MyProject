const url = new URL(window.location.href);
const dateId = url.searchParams.get('dateId');
const scdListElem = document.getElementById('scheduleList');
const Auto = {
    ㅈㅇ : '중앙지법',
    ㄴㅂ : '남부지법',
    ㅅㅇㄱ : '수원고등',
    ㅅㅇㅈ : '수원지법',
    ㅈㅍ : '재판',
    ㅍㄱ : '판결',
}

// document.getElementById('toCalendarButton').addEventListener('click', event => {
//     location.href='/calendar';
// });

document.getElementById('titleDate').textContent = dateId;

document.getElementById('scheduleInput').addEventListener('keyup', (event)=>{
    if(event.keyCode === 13){
        event.preventDefault();
        document.getElementById('save').click();
    }
});

document.getElementById('scheduleInput').addEventListener('input', function(event){
    for(key in Auto){
        if(event.target.value.includes(key + ' ')){
        event.target.value = event.target.value.replace(key + ' ', Auto[key] + ' ');
        }
    }
});

let hiddenInput = document.querySelectorAll('input[name=dateId]');
for (e of hiddenInput) {
    e.value = dateId;
}

function inputCheck(self){
    if(self.children[1].value === ''){
        alert('스케쥴을 입력하세요.');
        return false
    }
}

let List = {
    clear : function(elem){
        while(elem.hasChildNodes()){
            elem.removeChild(elem.firstChild);
        }
    },
    displaySchedule : function(){
        fetch('/db_read_calendar/' + dateId)
        .then(response => {
            if(response.status === 200) return response.json()
            else console.log(response.statusText);
        })
        .then(data => {
            if(data){
                for(e of data){
                    List.createItem(e.id, e.date, e.schedule, e.checked);
                }
            }
        })
        .catch(err => {
            console.log(err);
        });
    },
    createItem : function(id, dateId, schedule, checked){
        // 새로운 div 생성
        let newItem = createDivIn(scdListElem);
        newItem.classList.add('items');

        // 내용 부분 생성
        let contentDiv = createDivIn(newItem);

        let modifiedSchedule;
        if(schedule.includes('판결')){
            modifiedSchedule = 'X ' + schedule + '&nbsp;&nbsp;';
        } else{
            modifiedSchedule = '&nbsp;&nbsp;&nbsp;&nbsp;' + schedule + '&nbsp;&nbsp;';
        } 
        contentDiv.innerHTML = modifiedSchedule;

        contentDiv.classList.add('contents');
        
        if(checked){
            contentDiv.classList.add('checked');
        }
        setCheckFunc(contentDiv, id, checked);

        // X 부분 생성
        let delDiv = createDivIn(newItem);
        delDiv.innerHTML = '<button>X</button>';
        delDiv.classList.add('del');
        delDiv.addEventListener('click', (event)=>{
            fetch(`/db_delete/${id}`)
            .then(response => {
                if(response.status === 200) location.href=`/schedule.html?dateId=${dateId}`;
                else console.log(response.statusText);
            });
        });
    }
}

function displayWeight() {
    fetch('/db_read_diet/' + dateId)
    .then(response => {
        if(response.status === 200) return response.json()
        else console.log(response.statusText);
    })
    .then(data => {
        if(data){
            for(e of data){
                document.getElementById('weight').textContent = e.weight + 'kg';
            }
        }
    })
    .catch(err => {
        console.log(err);
    });
}

List.displaySchedule();
displayWeight();

function createDivIn(elem){
    return elem.appendChild(document.createElement('div'));
}

function setCheckFunc(elem, id, checked){
    elem.addEventListener('click', (event)=>{
        fetch(`/db_update_checked/${id}/${checked}`)
            .then(response => {
                if(response.status === 200){
                    List.clear(scdListElem);
                    List.displaySchedule();
                }else{
                    console.log(response.statusText);
                }
            });
    })
}