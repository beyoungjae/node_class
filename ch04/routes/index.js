const express = require('express')
const User = require('../models/user')

const router = express.Router()

// localhost:8000/
router.get('/', async (req, res, next) => {
   try {
      const users = await User.findAll()
      res.status(200).json(users)
   } catch (error) {
      console.log(error)
      next(error)
   }
})

module.exports = router
