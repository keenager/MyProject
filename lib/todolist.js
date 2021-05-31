let inputContent='';
const listElem = document.getElementById('list');
const todayId = '' + present.getFullYear() + modifyMonth(present.getMonth()) + modifyDate(present.getDate());


document.querySelector('input').addEventListener('keyup', (event)=>{
    if(event.keyCode === 13){
        event.preventDefault();
        document.querySelector('button').click();
    }
});

document.querySelector('button').addEventListener('click', ()=>{
    inputToStroage();
    document.querySelector('input').value = '';
    List.clear();
    List.display();
});

let List = {
    clear : function(){
        while(listElem.hasChildNodes()){
            listElem.removeChild(listElem.firstChild);
        }
    },
    display : function(){
        let scd = storage.getItem(todayId);

        if(scd != null){
            let splitedScd = scd.split('\n');
            for(e of splitedScd){
                List.item.create(e);
            }
        }  
    },
    item : {
        create : function(item){
            // 새로운 div 생성
            let newItem = createDivIn(listElem);
            newItem.classList.add('items');

            // 내용 부분 생성
            let contentDiv = createDivIn(newItem);
            contentDiv.textContent = item;
            contentDiv.classList.add('contents');
            setCheckFunc(contentDiv);

            // X 부분 생성
            let delDiv = createDivIn(newItem);
            delDiv.textContent = 'X';
            delDiv.classList.add('del');
            delDiv.addEventListener('click', (e)=>{
                this.delete(e.currentTarget.parentNode);
                List.clear();
                List.display();
            });
        },
        delete : function(item){
            item.remove();
            let contents = document.getElementsByClassName('contents')
            let newContents = '';
            for(let i = 0; i < contents.length; i++){
                newContents = newContents + contents[i].innerText + ((i != contents.length-1) ? '\n' : '');
            }
            storage.setItem(todayId, newContents);
        }
    }
}

List.display();


function inputToStroage(){
    inputContent = document.querySelector('input').value;
    if(inputContent === '') return
    let temp = storage.getItem(todayId);
    storage.setItem(todayId, temp + '\n' + inputContent);
}

function createDivIn(elem){
    return elem.appendChild(document.createElement('div'));
}

function setCheckFunc(elem){
    elem.addEventListener('click', (event)=>{
        if(event.target.classList.contains('checked')){
            event.target.classList.remove('checked');
        }else{
            event.target.classList.add('checked');
        }
    })
}