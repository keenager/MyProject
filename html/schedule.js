const url = new URL(window.location.href);
const queryData = url.searchParams;
const dateId = queryData.get('dateId');
let inputContent='';
const listElem = document.getElementById('list');
// const todayId = '' + present.getFullYear() + modifyMonth(present.getMonth()) + modifyDate(present.getDate());


document.getElementById('schedule').addEventListener('keyup', (event)=>{
    if(event.keyCode === 13){
        event.preventDefault();
        document.getElementById('save').click();
    }
});

document.getElementById('save').addEventListener('click', ()=>{
    inputToStroage();
    document.getElementById('schedule').value = '';
    List.clear();
    List.display();
});

let temp1 = 'update 부분 db.query에서 queryData.checked가 들어가는 과정에서 문자로 들어가서 type 오류 발생';
let temp2 = 'inputWindow.html의 script 부분에서 자동완성 기능 가져오기';

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
                        List.item.create(e.id, e.date, e.schedule, e.checked);
                    }
                }
            })
            .catch(err => {
                console.log(err);
            })  
    },
    item : {
        create : function(id, date, schedule, checked){
            // 새로운 div 생성
            let newItem = createDivIn(listElem);
            newItem.classList.add('items');

            // 내용 부분 생성
            let contentDiv = createDivIn(newItem);
            contentDiv.textContent = schedule;
            contentDiv.classList.add('contents');
            if(checked === 1){
                contentDiv.classList.add('checked');
            }else{
                contentDiv.classList.remove('checked');
            }
            setCheckFunc(contentDiv, id, checked);

            // X 부분 생성
            let delDiv = createDivIn(newItem);
            delDiv.textContent = 'X';
            delDiv.classList.add('del');
            delDiv.addEventListener('click', (e)=>{
                let targetSchedule = e.currentTarget.previousSibling.textContent;
                fetch(`/db_delete?dateId=${dateId}&schedule=${targetSchedule}`)
                .then(response => {
                    if(response.status === 200) location.href=`/schedule.html?dateId=${dateId}`;
                    else console.log(response.statusText);
                });
            });
        }
    }
}

List.display();


function createDivIn(elem){
    return elem.appendChild(document.createElement('div'));
}

function setCheckFunc(elem, id, checked){
    elem.addEventListener('click', (event)=>{
        
        if(checked === 1){
            //0으로 바꾸고 class 삭제
            fetch(`/db_update_checked?id=${id}&checked=${checked}`);
        }else{
            //1로 바꾸고 class 추가

        } 
        

        // if(event.target.classList.contains('checked')){
        //     event.target.classList.remove('checked');
        // }else{
        //     event.target.classList.add('checked');
        // }
    })
}