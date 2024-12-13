const express = require('express')
const router = express.Router() // 라우터(경로를 지정해주는 라이브러리)를 가져온다

// localhost:8000/
router.get('/', (req, res) => {
   res.send('Hello, Express')
})

// localhost:8000/test
router.get('/test', (req, res) => {
   res.send('Hello, Express test')
})

router.get('/:id', (req, res) => {
   res.send('GET /' + req.params.id)
})

router.get('/:id/test', (req, res) => {
   res.send('GET /' + req.params.id + '/test')
})

module.exports = router // 라우터를 내보냄
