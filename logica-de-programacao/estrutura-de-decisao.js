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

n1 = 2
console.log(`nota 1: ${n1}`)

n2 = 7
console.log(`nota 2: ${n2}`)

res = (n1 + n2) / 2

if (res >= 6) {
    ava = 'parabens! vc passou.'

}
else if (res >= 5) {
    ava = 'foi para recuperação'
    
} else {
    ava = 'vc reprovou'
}

console.log(`Media ${res}, ${ava}`)