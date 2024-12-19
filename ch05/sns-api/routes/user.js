const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('./middlewares')
const User = require('../models/user')

// 사용자를 팔로우하는 라우트 localhost:8000/:id/follow
router.post('/:id/follow', isLoggedIn, async (req, res) => {
   try {
      // 로그인 한 사용자(req.user)의 user객체를 가져온다.
      // 로그인 한 사용자의 req.user.id = 1
      const user = await User.findOne({
         where: { id: req.user.id },
      })
      if (user) {
         // 팔로우 하려고 하는 사람의 req.params.id = 2
         await user.addFollowing(parseInt(req.params.id, 10))
         res.json({
            success: true,
            message: '사용자를 성공적으로 팔로우했습니다.',
         })
      } else {
         res.status(404).json({
            success: false,
            message: '사용자를 찾을 수 없습니다.',
         })
      }
   } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, message: '팔로우 하는 중 오류가 발생했습니다.', error })
   }
})

module.exports = router
