var express = require('express')
var router = express.Router()
const { Todo } = require('../models/Todo')
const jwt = require('jsonwebtoken')
const ObjectId = require('mongoose').Types.ObjectId
const { SECRET_ACCESS_TOKEN } = require('../../config')

const verifyToken = (req, res, next) => {
  try {
    req.user = jwt.verify(req.headers.authorization, SECRET_ACCESS_TOKEN)
    return next()
  } catch (err) {
    console.log(err)
    return res.status(401)
  }
}

router.post('/', verifyToken, async (req, res) => {
  try {
    const { userId } = req.user
    const pendingTodosCount = await Todo.find({ user: userId, done: false }).countDocuments()

    let body = req.body

    let match = { 
      $match: { 
        user: new ObjectId(userId),
        $or: [
          {
            name: {
              $regex: req.body.searchString || '',
              $options: 'i'
            }
          }
        ]
      } 
    }

    if (body.todoFilter == 'Pending') {
      match.$match.done = false
    } else if (body.todoFilter == 'Done') {
      match.$match.done = true
    }

    let aggregator = [
      match
    ]
    
    const todosData = await Todo.aggregate(aggregator)

    res.json({ todosData, pendingTodosCount })
  } catch (error) {
    console.log(error)
    return res.status(401)
  }
})

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { userId } = req.user
    const { id } = req.params
    const todo = await Todo.findOne({ _id: id, user: userId })

    res.json(todo)
  } catch (error) {
    console.log(error)
    return res.status(401)
  }
})

router.post('/new', verifyToken, async (req, res) => {
  try {
    const { name } = req.body
    const { userId } = req.user

    const todo = new Todo({ name: name, done: false, user: userId })
    await todo.save()

    res.json(todo)
  } catch (error) {
    console.log(error)
    return res.status(401)
  }
})

router.put('/update/:id', verifyToken, async (req, res) => {
  try {
    const body = req.body
    const { id } = req.params

    const todo = await Todo.findOneAndUpdate({ _id: id }, { name: body.name } )
    await todo.save()

    res.json(todo)
  } catch (error) {
    console.log(error)
    return res.status(401)
  }
})

router.put('/update_status/:id', verifyToken, async (req, res) => {
  try {
    const body = req.body
    const { id } = req.params

    const todo = await Todo.findOneAndUpdate({ _id: id }, { done: body.done } )
    await todo.save()

    res.json(todo)
  } catch (error) {
    console.log(error)
    return res.status(401)
  }
})

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params

    await Todo.deleteOne({ _id: id })

    res.status(200).send()
  } catch (error) {
    console.log(error)
    return res.status(401)
  }
})

module.exports = router