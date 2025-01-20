const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { Domain } = require('../models')
const { isLoggedIn } = require('./middewares')

// 토큰 발급
router.get('/get', isLoggedIn, async (req, res) => {
   try {
      const origin = req.get('origin') // http를 포함한 도메인 주소를 가져온다

      // jwt 토큰 생성
      const token = jwt.sign(
         {
            id: req.user.id,
            email: req.user.email,
         },
         process.env.JWT_SECRET, // 토근 서명에 사용할 비밀키
         {
            expiresIn: '30d', // 토큰 만료 시간 설정: 30일(예: '30m' = 30분, '1d' = 1일)
            issuer: 'shopmaxadmin', // 토큰 발급자 정보 설정(예: 어플리케이션 이름)
         }
      )

      await Domain.create({
         userId: req.user.id,
         host: origin,
         clientToken: token,
      })

      return res.json({
         success: true,
         message: '토큰이 발급되었습니다.',
         token, // 발급받은 토큰
      })
   } catch (error) {
      console.error(error)
      return res.status(500).json({
         success: false,
         message: '토큰 발급 중 오류가 발생했습니다.',
      })
   }
})

// DB에 저장된 토큰 가져오기
router.get('/read', isLoggedIn, async (req, res) => {
   try {
      const origin = req.get('origin')
      const userId = req.user.id

      const domainData = await Domain.findOne({
         where: { userId, host: origin },
      })

      if (!domainData) {
         return res.status(404).json({
            success: false,
            message: '토큰을 찾을 수 없습니다.',
         })
      }

      return res.json({
         success: true,
         message: '토큰이 성공적으로 발급 되었습니다.',
         token: domainData.clientToken, // DB에서 가져온 토큰
      })
   } catch (error) {
      console.error(error)
      return res.status(500).json({
         success: false,
         message: '토큰을 가져오는 중 오류가 발생했습니다.',
      })
   }
})

module.exports = router
