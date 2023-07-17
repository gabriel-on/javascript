let menuItem = document.querySelectorAll('.item-menu')

function select(){
    menuItem.forEach((item) => {
        item.classList.remove('ativo')
    })
    this.classList.add('ativo')
}

menuItem.forEach((item) => {
    item.addEventListener('click', select)
});

// Expandir o menu

let expandir = document.querySelector('#btn-exp')
let menuLateral = document.querySelector('.menu-lateral')

expandir.addEventListener('click', function(){
    menuLateral.classList.toggle('expandir')
})