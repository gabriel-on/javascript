function carregar(){
    var msg = window.document.getElementById('msg')
    var img = window.document.getElementById('imagem')
    var data = new Date()
    var hora = data.getHours()
    var min = data.getMinutes()
    var seg = data.getSeconds()
    // var hora = 19
    msg.innerHTML = `Agora são ${hora} horas e ${min} minutos e ${seg} segundos.`

    if (hora >= 0 && hora < 12){
        img.src = "imagens/origins/manha.jpg"
        document.body.style.background = '#d59766'
    } else if (hora >= 12 && hora <= 18){
        img.src = "imagens/origins/tarde.jpg"
        document.body.style.background = '#f16d21'
    } else {
        img.src = "imagens/origins/noite.jpg"
        document.body.style.background = '#134f7c'
    }
}