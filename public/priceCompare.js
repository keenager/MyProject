const marts = ['ssg', 'hp'];
let savedQuery;

//저장된 스케줄
const listDiv = document.querySelector('.list_container');
if( localStorage.getItem('priceCompare') === '[]' || localStorage.getItem('priceCompare') === null ) {
    listDiv.innerHTML = '저장된 목록이 없습니다.';
    savedQuery = [];
} else {
    loadSavedLists();
    addEventToLists();    
}

function enterkey() {
    if(window.event.keyCode === 13) {
        document.querySelector('#schBtn').click();
    }
}

document.querySelector('#schBtn').addEventListener('click', () => {
    let query = document.querySelector('input').value;
    if(!savedQuery.includes(query)) {
        savedQuery.push(query);
        localStorage.setItem('priceCompare', JSON.stringify(savedQuery));
        listDiv.innerHTML = '';
        loadSavedLists();
        addEventToLists();
    }

    marts.forEach(mart => document.querySelector('#' + mart).innerHTML = '');
    let requests = marts.map(mart => fetch(`/priceCompare/get_prices/${mart}/${query}`));
    Promise.all(requests)
    .then(responses => Promise.all(responses.map(r => r.json())))
    .then(lists => lists.forEach( (list, index) => {        // lists: 마트별 검색결과 리스트
        let elem = document.getElementById(marts[index]);   // list: 특정 마트 검색결과 리스트
        for(let item of list) {
            elem.insertAdjacentHTML('beforeend', `
                <div class='item'>
                    <a href=${item.link} target='_blank' rel='noopner noreferrer'>${item.title}</a>
                    <em>${item.price}</em>
                <div>
            `);
        }
    }));    
});

function loadSavedLists() {
    savedQuery = JSON.parse(localStorage.getItem('priceCompare'));
    for(let item of savedQuery) {
        listDiv.insertAdjacentHTML('beforeend', `
            <div class='list'>
                <a href='javascript:void(0)'>${item}</a>
                <button class='delBtn'>X</button>
            </div>
            `
        );
    }
}

function addEventToLists() {
    //검색 목록 클릭 이벤트
    let listElemArr = Array.from(document.querySelectorAll('.list > a'));
    for(let listElem of listElemArr) {
        listElem.addEventListener('click', event => {
            document.querySelector('input').value = event.target.textContent;
        });
    }
    //검색 목록 삭제 이벤트
    let xElemArr = Array.from(document.querySelectorAll('.delBtn'));
    for(let xElem of xElemArr) {
        xElem.addEventListener('click', event => {
            let index = savedQuery.findIndex(item => item === event.target.previousElementSibling.textContent);
            savedQuery.splice(index, 1);
            localStorage.setItem('priceCompare', JSON.stringify(savedQuery));
            listDiv.innerHTML = '';
            loadSavedLists();
            addEventToLists();
        });
    }
}