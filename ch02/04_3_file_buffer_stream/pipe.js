const fs = require('fs')

const readStream = fs.createReadStream('./readme4.txt')
const writeStream = fs.createWriteStream('./writeme3.txt')

// 읽기 스트림의 데이터를 쓰기 스트림으로 연결(파이프 처리)
// readme4.txt의 내용을 writeme3.txt로 복사
readStream.pipe(writeStream)
