const fs = require('fs').promises

// './folder' 디렉터리 내용 확인
fs.readdir('./folder')
   .then((dir) => {
      console.log('폴더 내용 확인', dir)
      return fs.unlink('./folder/newfile.js') // folder/newfile.js 삭제
   })
   .then(() => {
      // 파일 삭제 성공 메세지 출력
      console.log('파일 삭제 성공')
      return fs.rmdir('./folder') // folder 폴더 삭제
   })
   .then(() => {
      console.log('폴더 삭제 성공')
   })
   .catch((err) => {
      console.error(err) // 모든 단계에서 발생한 에러 처리
   })
