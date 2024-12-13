const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const morgan = require('morgan') // 로그 남기기
require('dotenv').config() // env파일을 사용하기 위한 라이브러리

const app = express()
app.set('port', process.env.PORT || 3000)

app.use(morgan('dev'))
app.use('/', express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 업로드 폴더 확인 및 생성

try {
   fs.readdirSync('uploads') // uploads 폴더가 있는지 확인
} catch (error) {
   // 폴더가 없으면 에러가 발생
   console.log('upload 폴더가 없어 uploads 폴더를 생성합니당.')
   fs.mkdirSync('uploads') // uploads 폴더 생성
}

app.get('/upload', (req, res) => {
   res.sendFile(path.join(__dirname, 'multipart.html'))
})

const upload = multer({
   storage: multer.diskStorage({
      // 업로드 파일 저장 경로 설정
      destination(req, file, done) {
         done(null, 'uploads/') // uploads 폴더에 저장
      },
      // 저장할 파일 이름 설정
      filename(req, file, done) {
         // file.originalname = dog.png
         // ext = .png
         const ext = path.extname(file.originalname) // 파일 확장자 추출

         // done(null, 어떤 파일명으로 지정할건지)
         // path.basename(file.originalname, ext) = dog
         // Date.now(): 중복되지 않는 파일명을 만들 수 있음
         done(null, path.basename(file.originalname, ext) + Date.now() + ext)
      },
   }),

   // 업로드 파일 크기 제한(5MB)
   limits: { fileSize: 5 * 1024 * 1024 },
})

app.post('/upload', upload.single('image'), (req, res) => {
   console.log(req.file)
   res.send('파일 업로드 완료')
})

app.listen(app.get('port'), () => {
   console.log(`서버가 작동 중 입니다. http://localhost:${app.get('port')}`)
})
