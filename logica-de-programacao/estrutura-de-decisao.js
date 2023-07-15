//estrutura de decisão SIMPLES: Se-então (if)
//estrutura de decisão COMPOSTA: Se-então-SENÃO (if-else)

// let x, y;

// x = 2, y = 3

// if (x == y) {
//     console.log('Os numeros são iguais')
// }
// else {
//     console.log('Os numeros são diferetes')
// }

let n1, n2, res;
let ava = ''

n1 = parseInt(console.log())
console.log(`Nota1:`)

n2 = parseInt(console.log())
console.log(`Nota2:`)

res = (7 + 5) / 2

if (res >= 6) {
    ava = 'parabens!'

}
else if (res >= 5) {
    ava = 'recuperação'
    
} else {
    ava = 'reprovou'
}

console.log(`${res} + ${ava}`)