
const express = require('express')


/*
We have placed the model inside seprerate directory. To learn about models
see read_this_for_mongoose.js file.
 */
const Task = require('../models/tasks')

const router = new express.Router()

const auth = require('../middleware/auth')


router.post('/tasks', auth, async (req,res)=>{

    //const task = new Task(req.body)

    const task = new Task({
        ...req.body, //Whatever task will be inside req will be copied inside the task we are creating.
        owner:req.user._id
    })

    try {
        await task.save()  // if some error in saving then catch will be called.
        res.status(201).send(task)
    } catch (e) {
        res.status(404).send()
    }

    // task.save().then(()=>{
    //     res.send(task)
    // }).catch((error)=>{
    //     res.status(400).send(error)
    // })
})

//***************R : Read Sources******************

/*
It will get all the task associated with the user who is currently logged in.
So auth will be called which will get the details of user currently logged in and then
we will fetch all the tasks associated with it.
 */
router.get('/tasks', auth, async (req,res)=>{

    try {

        await req.user.populate('tasks').execPopulate()

        //2 way: It will populate all the tasks associated with that user.
        //await req.user.populate('tasks').execPopulate()
        //res.send(req.user.tasks)


        res.send(req.user.tasks)
    }catch (e) {
        res.status(500).send()
    }
})

/*
One can only get the task if he is logged in.
We are calling middleware auth which is fetching the details of logged in user.
Since we have stored owner field in Task model, so we will only get the task if
the id matches with the id of logged in user.
 */
router.get('/tasks/:id',auth, async (req,res)=>{

    const _id = req.params.id

    try {
       // const task = await Task.findById(_id)
        const task = await Task.findOne({_id, owner:req.user._id})

        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    }catch (e) {
        res.status(500).send()
    }
})

//**************U: UPDATE*************************************




router.patch('/tasks/:id',auth, async (req,res)=>{

    const update = Object.keys(req.body)
    const allowedUpdates =['description','completed']
    const isValidOperation = update.every((update)=>allowedUpdates.includes((update)))

    const _id =req.params.id

    if(!isValidOperation) {
        return res.status(400).send({errors:'Invalid Update operation'})
    }

    try {
      //  const task = await Task.findByIdAndUpdate(_id,req.body,{new:true, runValidators: true})

        const task = await Task.findOne({_id:_id, owner:req.user._id})

        //const task = await Task.findById(_id)


        if(!task) {
            return res.status(404).send('Task Not Found')
        }
        update.forEach((update)=>{
            task[update] = req.body[update]
        })
        await task.save()

        res.send(task)
    }catch (e) {
        res.status(404).send()
    }
})

//*******************D;DELETE**********




router.delete('/tasks/:id',auth ,async(req,res)=>{

    const _id = req.params.id

    try {
        //const task = await Task.findById(_id)
        const task = await Task.findOneAndDelete({_id:_id,owner: req.user._id})

        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    }catch (e) {
        res.status(500).send()

    }
})

module.exports= router