require('../src/db/mongoose')

const User = require('../src/models/user')
const Task = require('../src/models/tasks')
/*
Find the user with Id: 5f12cae568f5524cd046f297 and update it's age to 1.
 */

User.findByIdAndUpdate('5f12cae568f5524cd046f297',{age: 1}).then((user)=>{
    console.log(user)
    return User.countDocuments({age:1}) //Calling one more operation using promise chaining
}).then((result)=>{
        console.log(result)
}).catch((error)=>{
    console.log(error)
})

const updateAgeAndCount = async (id,age)=>{

    const user = await User.findByIdAndUpdate(id,{age: age})
    const count = await  User.countDocuments({age:age})

    return  count
}

updateAgeAndCount('5f12cae568f5524cd046f297',2).then((count)=>{
    console.log('count ',count)
}).catch((error)=>{
    console.log(error)
})

const deleteTaskAndCount = async (id)=>{

    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed:false})

    return count
}

deleteTaskAndCount('5f12cae568f5524cd046f297').then((count)=>{
    console.log('delete count ',count)
}).catch((error)=>{
    console.log(error)
})
