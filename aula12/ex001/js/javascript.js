function verificar(){
    var data = new Date()
    var ano = data.getFullYear()
    var fano = window.document.getElementById('txtano')
    var res = window.document.querySelector('div#res')

    if (fano.value.length == 0 || Number(fano.value) > ano){
        window.alert('Verifique os dados e tente novamente!')
    } else {
        var fsex = document.getElementsByName('radsex')
        var idade = ano - Number(fano.value)
        var genero = ''
        var img = document.createElement('img')
        img.setAttribute('id', 'foto')

        if (fsex[0].checked){
            genero = 'Homem'
            if (idade >=0 && idade < 10){

            } else if (idade < 21){

            } else if (idade < 50){

            } else {

            }
        } else if (fsex[1].checked){
            genero = 'Mulher'
            if (idade >=0 && idade < 10){

            } else if (idade < 21){

            } else if (idade < 50){

            } else {
                
            }
        }
        res.innerHTML = `Detectamos ${genero} com ${idade} anos.`
    }
}