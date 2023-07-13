function contar(){
    var n1 = window.document.getElementById('txtn1')
    var n2 = window.document.getElementById('txtn2')
    var pas = window.document.getElementById('pas')
    var res = window.document.querySelector('div#res')

    if (n1.value.length == 0 || n2.value.length == 0 || pas.value.length == 0){
        res.innerHTML = 'Algo de errado não esta certo!!!'
        // window.alert(`Algo de errado não esta certo!`)
    } else {
        res.innerHTML = `Contando: <br> `
        var n1 = Number(n1.value)
        var n2 = Number(n2.value)
        var pas = Number(pas.value)
        if (pas <= 0) {
            window.alert('Passo invalido')
            pas = 1
        }
        if (n1 < n2){
            // contagem crescente
            for (var c = n1; c <= n2; c += pas){
                res.innerHTML += `${c} \u{1F449}`
            }
        } else {
            // contagem regressiva
            for (var c = n1; c >= n2; c -= pas){
                res.innerHTML += `${c} \u{1F449}`
            }
        }
        res.innerHTML += `\u{1F3C1}`
    }     
}
