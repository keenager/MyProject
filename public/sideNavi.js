function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}
    
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

document.querySelector('.menubtn').addEventListener('click', event => openNav());
document.querySelector('.closebtn').addEventListener('click', event => closeNav());