const marts = ['ssg', 'hp'];

function enterkey() {
    if(window.event.keyCode === 13) {
        document.querySelector('button').click();
    }
}

document.querySelector('button').addEventListener('click', () => {
    marts.forEach(mart => document.querySelector('#' + mart).innerHTML = '');
    let query = document.querySelector('input').value;
    let requests = marts.map(mart => fetch(`/priceCompare/get_prices/${mart}/${query}`));
    Promise.all(requests)
    .then(responses => Promise.all(responses.map(r => r.json())))
    .then(lists => lists.forEach( (list, index) => {
        let elem = document.getElementById(marts[index]);
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