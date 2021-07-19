let scdData = {basis: 'fromToday'};

button.onclick = () => {
    displayScd(+totalPage.value, +goalPage.value);
}

let inputs = document.querySelectorAll('input[type=radio]');
for (input of inputs) {
    input.onchange = event => {
        scdData.basis = event.currentTarget.value;
        displayScd(+totalPage.value, +goalPage.value);
    }
}

function calcScd(totalPage, goalpage) {
    scdData.day = Math.ceil(totalPage / goalpage);
    scdData.last = totalPage % goalpage;
}

function getYMD(idx) {
    let date = scdData.basis === 'fromToday' ? new Date() : new Date(specDate.value);
    date.setDate(date.getDate() + idx);
    return date
}

function displayScd(totalPage, goalpage) {
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    calcScd(totalPage, goalpage);
    let startPage = 1;
    let endPage;
    for (let i = 0; i < scdData.day; i++) {
        endPage = i === scdData.day - 1 ?
                startPage + scdData.last - 1 :
                startPage + goalpage - 1;
        let newRow = tbody.insertRow(-1);
        newRow.insertCell(0).innerHTML = `
            ${getYMD(i).getFullYear()}년 ${getYMD(i).getMonth() + 1}월 ${getYMD(i).getDate()}일:`;
        newRow.insertCell(1).innerHTML = `
            ${startPage}쪽 ~ ${endPage}쪽`;
        startPage = endPage + 1;
    }
}