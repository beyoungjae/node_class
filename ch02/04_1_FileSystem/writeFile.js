const fs = require('fs')

fs.writeFile('./writeme.txt', '글..이.. 입력됩니다..', (err) => {
   if (err) {
      throw err
   }

   console.log('파쓰완!')

   // 파일 작성 후 읽어오기
   fs.readFile('./writeme.txt', (err, data) => {
      console.log(data.toString())
   })
})
