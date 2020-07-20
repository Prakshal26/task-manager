// const mongoose = require('mongoose')
//
// const validator = require('validator')
//
// /*
// Creating a new DB by name task-manager-api
//  */
//
// mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
//     useNewUrlParser:true,
//     useCreateIndex: true
// })
//
// /*
// Working with mongoose. Here we are specifying what kind of data we need to store.
// Below we are not actually storing the data but just creating a model.
// We have created a model that goes by name User. It will have name,age,password property
// and we have specified some additional fields to those property.
//
// type: String ---> It will only accept String, if user enter something else error will come.
// required: true---> It is compulsory field, without this error.
// trim:true ---> If user enter some white spaces then it will be removed. Ex-(   praks  h ) will be converted
// to (praksh).
// minlength:7 ---> If someone enter password less then length 7 then error will come.
//
// validator(value)---> It is the function where we can perform some additional validation on top of that
// we specified above. Whatever user will enter will come in value and we can perform some validation.
// If not as per requirement then we can throw a user defined Error with a message.
//
// default:0---> If someone does not enter that parameter then by default it will store 0.
//
// lowercase: true ---> Will convert the input into lower case.
//  */
//
//
// const User = mongoose.model('User',{
//     name: {
//         type: String,
//         required: true,
//         trim : true
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 7,
//         trim:true,
//         validator(value){ //In password enterted has keyword password then throw a error.
//             if(value.toLowerCase().includes('password')){
//                 throw new Error('Password cannot contain "password"')
//             }
//         }
//     },
//     age: {
//         type: Number,
//         default: 0,
//         validate(value) {
//             if (value < 0) {
//                 throw new Error('Age must be a positive number')
//             }
//         }
//     },
//     email: {
//         type : String,
//         required: true,
//         validate(value) {
//             if(!validator.isEmail(value)){  //using isEmail method of validator npm to validate Email.
//                 throw new Error('Email is invalid')
//             }
//         },
//         trim : true,
//         lowercase :true
//     }
// })
// /*
//   Here we are specifying the value to model we have created. The model we had created was having
//   name as user and now we give the value as Andrew and 27. If suppose we give something else instead
//   of number in age then we will get a error.
//   */
// const me =new  User({
//     name: '   Andrew   ',
//     age : 27,
//     email: 'JpraksHAL@gmail.com',
//     password:'Password123'
// })
// /*
// Saving the model we had just created. That save by default return the promises.
//  */
// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log('Error ',error)
// })
//
//
// const Task = mongoose.model('Task',{
//     description: {
//         type:String,
//         required: true,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })
//
// // const task = new Task({
// //     description: 'Learn the Mongoose Library',
// //     completed: false
// // })
// //
// // task.save().then(()=>{
// //     console.log(task)
// // }).catch((error)=>{
// //     console.log(error)
// // })
//
//
