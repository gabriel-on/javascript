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
                img.setAttribute('src', 'imagens/origins/crianca-homem.jpg')
            } else if (idade < 21){
                img.setAttribute('src', 'imagens/origins/jovem-homem.jpg')
            } else if (idade < 50){
                img.setAttribute('src', 'imagens/origins/homem-adulto.jpg')
            } else {
                img.setAttribute('src', 'imagens/origins/homem-idoso.jpg')
            }
        } else if (fsex[1].checked){
            genero = 'Mulher'
            if (idade >=0 && idade < 10){
                img.setAttribute('src', 'imagens/origins/crianca-mulher.jpg')
            } else if (idade < 21){
                img.setAttribute('src', 'imagens/origins/jovem-mulher.jpg')
            } else if (idade < 50){
                img.setAttribute('src', 'imagens/origins/mulher-adulta.jpg')
            } else {
                img.setAttribute('src', 'imagens/origins/mulher-idosa.jpg')
            }
        }
        res.innerHTML = `Detectamos ${genero} com ${idade} anos.`
        res.appendChild(img)
    }
}