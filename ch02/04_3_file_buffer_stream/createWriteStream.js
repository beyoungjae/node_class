const fs = require('fs')

// 파일에 데이터를 쓰기 위한 쓰기 스트림 생성
const writeStream = fs.createWriteStream('./writeme2.txt')

writeStream.on('finish', () => {
   console.log('파일 쓰기 완료')
})

writeStream.write('이 글을씁니다.\n')
writeStream.write('한 번 더 씁니다.')

// 스트림 종료( 더이상 쓸 데이터가 없음을 알림 )
writeStream.end()
