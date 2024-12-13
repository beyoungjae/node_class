const express = require('express')
const router = express.Router() // 라우터(경로를 지정해주는 라이브러리)를 가져온다

// localhost:8000/user
router.get('/', (req, res) => {
   res.send('Hello, User')
})

// localhost:8000/user/test
// router.get('/test', (req, res) => {
//    res.send('Hello, User test')
// })

// localhost:8000/user/person?page=1&lang=ko
router.get('/:id', (req, res) => {
   console.log(req.params, req.query)
   console.log(req.query.page)
   console.log(req.query.lang)
   res.send('Hello, User ' + req.params.id)
})

router.get('/cate/test', (req, res) => {
   res.send('GET /user/cate/test')
})

router.get('/cate/:id', (req, res) => {
   res.send('GET /user/cate/' + req.params.id)
})

/*
router.get('/cate/abc', (req, res) => {
   res.send('')
})
router.post('/cate/abc', (req, res) => {
   res.send('')
})

인 경우 아래와 같이 하나로 작성 가능
*/

router
   .route('/cate/abc')
   .get((req, res) => {
      res.send('')
   })
   .post((req, res) => {
      res.send('')
   })

module.exports = router // 라우터를 내보냄
