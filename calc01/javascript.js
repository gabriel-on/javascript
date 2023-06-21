var n1 = window.document.querySelector('#n1')
var n2 = window.document.querySelector('#n2')
var p = window.document.querySelector('span')

function somar(){
    p.innerHTML = parseInt(n1.value) + parseInt(n2.value)
}
function subtrair(){
    p.innerHTML = parseInt(n1.value) - parseInt(n2.value)
}
function multiplicar(){
    p.innerHTML = parseInt(n1.value) * parseInt(n2.value)
}
function dividir(){
    p.innerHTML = parseInt(n1.value) / parseInt(n2.value)
}