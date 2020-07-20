
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
/*
It will run for all this handler
GET /tasks?completed=true
GET /tasks/

Limit means how much task to display. Like in Google we only see 10 result at once, so based on limit
we can also display only 10 tasks.
Skip means we can skip certain number of tasks. Like if 10 result are stored and we want to display from
5 then we can set skip = 5.
GET /tasks?limit=10&skip=10.

It will allow to sort the data.
GET /tasks?sortBy=createdAt:asc  // As we are storing timestamp so it will sort data on when they were created.
GET /tasks?sortBy=createdAt:desc //ascending or descending
 */

router.get('/tasks', auth, async (req,res)=>{

    /*
    This router handler is dynamic. It can have url like /tasks or it can also take
    something like /tasks?completed=true .
    If we are passing some completed value from the url then we are checking what is the value.

     */
    //If completed value now specified then display all the taks.
    const match = {}
    //check what is the query value, if true then only display task which are completed = true and vice versa.
    if(req.query.completed) {
        match.completed = req.query.completed === true
    }

    /*
    For SORT . IF user does not provide sort field then display as it is like we did for match.
    Otherwise fetch on basic of which we want to sort and sort the data.
    if nothing specified in URL for sort then display all.
     */

    const sort = {}
    if(req.query.sortBy) {
        /*
        We are splitting it depending if we want to sort based on asc or desc. If we want
        to sort in desc we will supply -1 and for asc we will supply 1.
        sortBy will have createdBy:desc.
        createdBy is the field inside the user model so we are sorting based on it.
        sort[parts[0]] means;
        sort will have createdBy 1 or -1.
        so sort based on createdBy and asc or desc is 1 or -1.
         */
        const parts = req.query.sortBy.split(':')
        sort [parts[0]] =parts[1]==='desc' ? -1 :1
    }


    try {
        await req.user.populate({
            path:'tasks',
            match,//match has query value, it will either display all tasks or based on completed value from url.
            options : {
                limit : parseInt(req.query.limit),//If we are passing limit in URL then it will only display that many record. If no limit specified then all will be displayed.
                skip: parseInt(req.query.skip),//It will skip n result and will display remaining.
                sort
            }
        }).execPopulate()

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