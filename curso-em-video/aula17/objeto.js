let amigo = {nome: 'jose', 
sexo: 'm', 
peso: '85.4',
engordar(p){
    console.log('Engordar')
    this.peso += p
}}
amigo.engordar(7)
console.log(`${amigo.nome} pesa ${amigo.peso} kg`)