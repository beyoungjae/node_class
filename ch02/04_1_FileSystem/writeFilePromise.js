const fs = require('fs').promises

fs.writeFile('./writeme2.txt', '글.이. 입.력.됩.니.다.')
   .then(() => {
      console.log('파일쓰기 완')
      // 작성한 파일 바로 읽기
      return fs.readFile('./writeme2.txt')
   })
   .then((data) => {
      console.log(data.toString())
   })
   .catch((err) => {
      console.log(err)
   })
