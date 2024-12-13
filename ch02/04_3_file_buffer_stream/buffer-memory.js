// buffer로 읽었을 때 메모리를 얼마나 사용하는지 확인

const fs = require('fs')

// 현재 메모리 사용량 확인
console.log('before: ', process.memoryUsage().rss) // rss : 프로세스가 사용중인 메모리

const data1 = fs.readFileSync('./big.txt') // 파일을 동기적으로 읽기
fs.writeFileSync('./big2.txt', data1) // 읽어드린 파일을 big2.txt에 동기적으로 쓰기

// 파일 읽기, 쓰기 작업 후 메모리 사용량 다시 확인
console.log('buffer: ', process.memoryUsage().rss) // 메모리 사용량이 1GB가 넘어가 버림
