var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')
var mongoose = require('mongoose')

var todorouter = require('./src/routes/todos')
var usersRouter = require('./src/routes/users')

const { URI, PORT } = require('./config')

var app = express()
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

mongoose.promise = global.Promise
mongoose.set("strictQuery", false)
mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to database"))
  .catch((err) => console.log(err))

app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
)

app.use('/todos', todorouter)
app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

// render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app