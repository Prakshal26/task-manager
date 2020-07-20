const mongoose = require('mongoose')


/*
Creating a new DB by name task-manager-api
 */

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useNewUrlParser:true,
    useCreateIndex: true,
    useFindAndModify:true
})

