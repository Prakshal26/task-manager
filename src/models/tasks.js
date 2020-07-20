const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type:String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: { //Every task will be accociated with a owner. So we will link task based on ID. So mongoose id is bit long and that's how we specify its type.
        type: mongoose.Schema.Types.ObjectID,
        require: true,
        ref:'User'//This is the name of User model so we are specifying reference .
    }               //Each Task will be associated with a User.
},{
    timestamps:true

})

const Task = mongoose.model('Task',taskSchema)

module.exports = Task

