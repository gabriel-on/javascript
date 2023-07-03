let num = [6, 2, 3, 5, 4]

num.push(1)
num.sort()
console.log(num)
console.log(`O numero é ${num.length}`)
console.log(`O primeiro numero e ${num[0]}`)
let pos = num.indexOf(7)
if(pos == -1){
    console.log('valor não encontrado')
} else{
    console.log(`O valor 6 esta em ${pos}`)
}