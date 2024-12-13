const express = require('express')
const cookieParser = require('cookie-parser')
require('dotenv').config() // env파일을 사용하기 위한 라이브러리

const app = express()
app.set('port', process.env.PORT || 3000)

// 쿠키 파서 설정(보안을 강화하기 위해 서명을 추가한 쿠키, 서명은 자유롭게 지정)
app.use(cookieParser('my-secret-ky'))

// 쿠키 만들기
app.get('/set-cookie', (req, res) => {
   // res.cookie('키', '값')
   res.cookie('age', '25', { signed: false, maxAge: 1000 * 60 * 60 }) // 1시간 동안 쿠키가 저장되고, 값에는 서명된 암호화가 적용.
   res.cookie('user', 'Alice', { signed: true, maxAge: 1000 * 60 * 60 })
   res.send('서명된 쿠키가 설정되었습니다.')
})

// 쿠키 읽기
app.get('/get-cookie', (req, res) => {
   console.log('cookies: ', req.cookies) // 일반쿠키 (서명되지 않은 쿠키)
   console.log('cookies: ', req.signedCookies) // 암호화된 쿠키 (서명된 쿠키)

   res.send(`쿠키: ${req.cookies.age}, 서명된 쿠키: ${req.signedCookies.user}`)
})

// 쿠키 삭제
app.get('/clear-cookie', (req, res) => {
   res.clearCookie('age')
   res.clearCookie('user')``
   res.send('쿠키가 삭제되었습니다.')
})

app.listen(app.get('port'), () => {
   console.log(`서버가 작동 중 입니다. http://localhost:${app.get('port')}`)
})
