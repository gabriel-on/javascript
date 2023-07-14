// function mudarSelect(){
//     let select = document.querySelector('#options')
//     let optionValue = select.options[select.selectedIndex]
    
//     let value = optionValue.value
//     console.log(value)
// }

// function gerarTabuada() {
//     let num = document.querySelector('#num')
//     let res = document.querySelector('#restab')

//     if (num.value.length == 0){
//         window.alert ('Digite um numero!')
//     } else {
//         let n = Number(num.value)
//         let c = 1
//         res.innerHTML = ''
//         while (c <= 10) {
//             let item = document.createElement('option')
//             item.text = `${n} + ${c} = ${n+c}`
//             item.value = `res ${c}`
//             res.appendChild(item)
//             c++
//         }
//     } 
// }