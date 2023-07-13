let valores = [0, 1, 4, 2, 8]

valores.sort()

// for(let pos=0; pos < valores.length; pos++){
//     console.log(`${pos} ${valores[pos]}`)
// }

for(let pos in valores){
    console.log(`${pos} e ${valores[pos]}`)
}