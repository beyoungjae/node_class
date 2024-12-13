const express = require('express')
require('dotenv').config()

const app = express()
app.set('port', process.env.PORT || 3000)

// 5. 에러처리 미들웨어 : 에러처리를 위해 사용하는 미들웨어

app.get('/', (req, res) => {
   res.send('환영합니다!')
})

// 강제로 에러발생 시킴
app.get('/error', (req, res, next) => {
   const err = new Error('에러 발생') // 강제로 에러 발생
   err.status = 500 // http 상태 코드 지정
   next(err) // 에러처리 미들웨어로 이동(에러객체를 넘기고 있으므로)
})

// 에러처리 미들웨어(매개변수에 err가 있는 경우)
app.use((err, req, res, next) => {
   console.error('Error: ', err.message)
   res.status(err.status).json({
      error: {
         message: err.message,
      },
   })
})

app.listen(app.get('port'), () => {
   console.log(`서버가 작동 중 입니다. http://localhost:${app.get('port')}`)
})
