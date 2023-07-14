function confirmar(){
    let num1 = document.querySelector('#n1')
    // let res = document.querySelector('#res')

    if (num1.value >= 18){
        window.alert ('ok')

    }

    else if (num1.value <= 0) {
        window.alert ('Numero invalido!')}
        else {
            window.alert ('AVISO! Você não é de maior')
    }
}

// -----------------------------------------------------

// function somar(){
//     let num1 = document.querySelector('#nu1')
//     let num2 = document.querySelector('#nu2')
//     let res = document.querySelector('#res')

//     if (num1.value + num2.value >= 18){
//         window.alert ('ihuu!!')

//     }
//     else if (num1.value + num2.value <=! 0) {
//         window.alert ('Numero invalido!')}
//         else {
//             window.alert ('AVISO!!! Você é burro?')
//     }
// }