var mongoose = require("mongoose")

const TodoSchema = new mongoose.Schema(
    {
        name: String,
        done: Boolean,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    }
)

const Todo = mongoose.model('Todo', TodoSchema)

module.exports = { Todo }