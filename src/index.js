const express = require('express')

/*
Code to start the monggose server is in db/mongoose so it will start the mongoose.
 */
require('./db/mongoose')

/*
We have two request one is for User and one is for Task.
So we have stored it in seperate files namely /routers/user and task.
 */
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT ||8080


// /*
// v108: Express MiddleWare.
//
// without middleware : new request => Run Route handler.
// with middleware: new request =>do something ==>run router handler.
//
// Whenever any request will come it will come to this function and here we can perform middleware.
// That is the operations before caling the actual things.
//  */
// //Note: The middleware should be mentioned on top before any other request.
// app.use((req,res,next)=>{
//
//     if(req.method =='GET') { //If it is a GET mapping then disable it.
//         res.send('Get Request are disable')
//
//     }else {
//         next() //Procced further if not GET.
//     }
// })
//





/*
Whenever some data will come from browser, this will automatically parse it as a JSON.
 */
app.use(express.json())

// To call the routers i.e where we have our mapping.
app.use(userRouter)
app.use(taskRouter)



app.listen(port,()=>{
    console.log('Server is up on ', port)
})

