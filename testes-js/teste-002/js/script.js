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


// -------------------------------------------------------

// let mainItem = document.querySelectorAll('.menu-item')

// function selecteD(){
//     mainItem.forEach((mItem) => {
//         mItem.classList.remove('ativo2')
//     })
//     this.classList.add('ativo2')
// }
// mainItem.forEach((mItem) => {
//     mItem.addEventListener('click', selecteD)
// });


// let mainContainer = document.querySelector('#main-container')
// let menuMain = document.querySelector('.main')

// menuMain.addEventListener('click', function(){
//     mainContainer.classList.toggle('mainContainer')
//     console.log('logo')
// })