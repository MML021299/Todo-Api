var express = require('express')
var router = express.Router()
const bcrypt = require('bcrypt')
const { User } = require('../models/Users')
const { SECRET_ACCESS_TOKEN } = require('../../config')
const jwt = require('jsonwebtoken')
const saltRounds = 10

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const existingUser = await User.findOne({ name })

    if (existingUser) {
      return res.json({ err: 'user already exists' }).status(401)
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const user = new User({
      name,
      email,
      password: hashedPassword
    })
    await user.save()

    res.json(user).status(201)
  } catch (error) {
    console.log(error)
    return res.status(401)
  }
})

router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body
    const user = await User.findOne({ name })

    if (!user) {
      return res.json({ message: 'Incorrect username' }).status(401)
    }

    const match = await bcrypt.compare(password, user.password)

    if (match) {
      const userId = user._id
      const token = await jwt.sign({ name, userId }, SECRET_ACCESS_TOKEN)

      return res.json({ token, user })
    } else {
      return res.json({ message: 'Incorrect password' }).status(401)
    }
  } catch (error) {
    console.log(error)
    return res.status(401)
  }
})

module.exports = router