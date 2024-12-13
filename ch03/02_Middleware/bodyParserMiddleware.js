const exp = require('constants')
const express = require('express')
const path = require('path')
require('dotenv').config()

const app = express()
app.set('port', process.env.PORT || 3000)

// 4. body-parser 미들웨어
// request 데이터를 json객체로 받아올 수 있게 해줌
app.use(express.json())
// form 태그에서 입력한 데이터를 'name=이름&age=00' 이런 형태로 인코딩해서 전송하게 해준다.
app.use(express.urlencoded({ extended: true })) // URL-encoded 요청 처리

app.get('/', (req, res) => {
   // submit.html 페이지 response
   res.sendFile(path.join(__dirname, '/submit.html'))
})

app.post('/submit', (req, res) => {
   // request, response 할 때는 header + body 형태로 데이터가 전송된다.
   // header영역 : request, response 정보가 들어있음
   // body영역 : 데이터가 들어있음
   console.log(req.body) // form태그에서 입력한 데이터가 들어있음
   res.send('데이터 수신 완료!')
})

app.listen(app.get('port'), () => {
   console.log(`서버가 작동 중 입니다. http://localhost:${app.get('port')}`)
})
