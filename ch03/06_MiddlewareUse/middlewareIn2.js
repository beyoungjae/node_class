const express = require('express')
require('dotenv').config() // env파일을 사용하기 위한 라이브러리
const morgan = require('morgan')

const app = express()
app.set('port', process.env.PORT || 3000)

app.use((req, res, next) => {
   console.log(req.path)
   // startsWith(문자열): 해당 문자열로 시작하는지 true, false 값을 리턴해줌
   if (req.path.startsWith('/api')) {
      //api로 시작하는 경로라면,
      morgan('dev')(req, res, next) // 조건부로 morgan실행시, morgan('dev')(req,res,next) 꼭 붙여야 한다.
   } else {
      next() // 다음 미들웨어로 이동
   }
})

app.get('/', (req, res) => {
   res.send('Welcome to the show!')
})

app.get('/api/user', (req, res) => {
   res.json([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
   ])
})

app.get('/api/product', (req, res) => {
   res.json([
      { id: 1, name: 'Labtop' },
      { id: 2, name: 'Phone' },
   ])
})

app.listen(app.get('port'), () => {
   console.log(`서버가 작동 중 입니다. http://localhost:${app.get('port')}`)
})
