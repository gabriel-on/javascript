var idade = 16
console.log(`Vc tem ${idade} anos.`)
if (idade < 16){
    console.log('Não vota')

}else if (idade < 18 || idade > 66){
        console.log('Voto opcional')
}else {
        console.log('Voto obrigatorio')
}

