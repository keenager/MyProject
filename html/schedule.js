const url = new URL(window.location.href);
const queryData = url.searchParams;
const dateId = queryData.get('dateId');
const listElem = document.getElementById('list');
const Auto = {
    ㅈㅇ : '중앙지법',
    ㄴㅂ : '남부지법',
    ㅅㅇㄱ : '수원고등',
    ㅅㅇㅈ : '수원지법',
    ㅈㅍ : '재판',
    ㅍㄱ : '판결',
}

document.getElementById('titleDate').textContent = dateId;

document.getElementById('schedule').addEventListener('keyup', (event)=>{
    if(event.keyCode === 13){
        event.preventDefault();
        document.getElementById('save').click();
    }
});

document.getElementById('schedule').addEventListener('input', function(event){
    for(key in Auto){
        if(event.target.value.includes(key + ' ')){
        event.target.value = event.target.value.replace(key + ' ', Auto[key] + ' ');
        }
    }
});

let List = {
    clear : function(){
        while(listElem.hasChildNodes()){
            listElem.removeChild(listElem.firstChild);
        }
    },
    display : function(){
        document.getElementById('dateId').value = dateId;

        fetch('/db_read?dateId=' + dateId)
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
            })  
    },
    createItem : function(id, date, schedule, checked){
        // 새로운 div 생성
        let newItem = createDivIn(listElem);
        newItem.classList.add('items');

        // 내용 부분 생성
        let contentDiv = createDivIn(newItem);
        if(schedule.includes('판결')){
            schedule = 'X ' + schedule + '&nbsp;&nbsp;';
        } else{
            schedule = '&nbsp;&nbsp;&nbsp;&nbsp;' + schedule + '&nbsp;&nbsp;';
        } 
        contentDiv.innerHTML = schedule;
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
            let targetSchedule = event.currentTarget.previousSibling.textContent;
            fetch(`/db_delete?dateId=${dateId}&schedule=${targetSchedule}`)
            .then(response => {
                if(response.status === 200) location.href=`/schedule.html?dateId=${dateId}`;
                else console.log(response.statusText);
            });
        });
    }
}

List.display();


function createDivIn(elem){
    return elem.appendChild(document.createElement('div'));
}

function setCheckFunc(elem, id, checked){
    elem.addEventListener('click', (event)=>{
        fetch(`/db_update_checked?id=${id}&checked=${checked}`)
            .then(response => {
                if(response.status === 200){
                    List.clear();
                    List.display();
                }else{
                    console.log(response.statusText);
                }
            });
    })
}