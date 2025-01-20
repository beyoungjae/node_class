const jwt = require('jsonwebtoken')

//로그인 상태 확인 미들웨어
exports.isLoggedIn = (req, res, next) => {
   // 사용자가 로그인된 상태인지 확인
   // 로그인이 됐을때는 isAuthenticated() = true
   if (req.isAuthenticated()) {
      //로그인 되었으면 다음 미들웨어로 이동
      next()
   } else {
      //로그인 되지 않은 경우
      res.status(403).json({
         success: false,
         message: '로그인이 필요합니다.',
      })
   }
}

//비로그인 상태 확인 미들웨어
exports.isNotLoggedIn = (req, res, next) => {
   // 사용자가 로그인 안된 상태인지 확인
   // 로그인이 안됐을때는 isAuthenticated() = false
   if (!req.isAuthenticated()) {
      //로그인 되지 않았을 경우 다음 미들웨어로 이동
      next()
   } else {
      //로그인 된 경우
      res.status(400).json({
         success: false,
         message: '이미 로그인이 된 상태입니다.',
      })
   }
}

// 관리자 권한 확인 미들웨어
exports.isAdmin = (req, res, next) => {
   // 로그인 상태 확인
   if (req.isAuthenticated()) {
      // 사용자 권한 확인
      if (req.user && req.user.role === 'ADMIN') {
         // ADMIN이면 다음 미들웨어로 이동
         next()
      }
   } else {
      res.status(403).json({
         success: false,
         message: '관리자 권한이 필요합니다.',
      })
   }
}

// 토큰 유효성 확인
exports.verifyToken = (req, res, next) => {
   try {
      // 프론트엔드에서 전달한 토큰
      console.log('req.headers.authorization: ', req.headers.authorization)

      // 토큰 검증
      req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)

      return next() // 다음 미들웨어로 이동
   } catch (error) {
      console.error(error)

      // 토큰 유효기간 초과
      if (error.name === 'TokenExpiredError') {
         return res.status(419).json({
            success: false,
            message: '토큰이 만료되었습니다.',
         })
      }

      return res.status(401).json({
         success: false,
         message: '유효하지 않은 토큰입니다.',
      })
   }
}
