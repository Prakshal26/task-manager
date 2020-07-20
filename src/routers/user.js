const express = require('express')

/*
We have placed the model inside seprerate directory. To learn about models
see read_this_for_mongoose.js file.
 */
const User = require('../models/user')

const router = new express.Router()

const auth = require('../middleware/auth')

/*
Using Post so some data is coming from browser. We have given app.use(express.json()) so it will
be automatically parsed as JSON.
 */

router.post('/users', async (req,res)=>{
    const user = new User(req.body) //User will submit the data which will be in req. We will send it
                                    //in User model and store it in db.
    // user.save().then(()=>{              //To save it.
    //     res.send(user)
    // }).catch((error)=>{
    //     res.status(400)
    //     res.send(error)
    // })

    try {
        await user.save()
        const token = await user.generateAuthToken()

        res.status(201).send({user,token})
    }catch (e) {
        res.status(400).send(e)
    }

})

router.post('/users/login',async (req,res)=>{

    //In models we have created a function findByCredentials, there we are passing
    //email and pass and checking if user is present or not.

    //generateAuthTokens is also created by us which is generating the tokens.
    try {

        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()

        /*
        We have created a method called toJSON, so intead of sending entire model we can
        just send some important thing only like name and email. toJSON method is automatically caleed
        and we can filter unwanted things from there.
        Whenever we will give res.send that function will be automatically called.
         */
        res.send({user,token})

    }catch (e) {
        res.status(400).send()
    }
})


/*
We have a token array which has a Json token every time user is logged in. Suppose user is already
logged in and he try to log in once again, in that case he will be logged in and new token will
be generated and stored in the token array.
This function deletes the token which is generated at last, and hence allowing him to logout.
If we want to close or log out from all the sessions then in that case we have created a logout all
request which will logout him from everywhere. It will clear the entire token array.
 */

router.post('/users/logout',auth,async(req,res)=>{

    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !==   req.token
        })
        await req.user.save()
        res.send()
    }catch (e) {
        res.status(500).send()
    }
})


router.post('/users/logoutAll', auth, async (req,res)=>{

    try {
        req.user.tokens = []
        req.user.save()
        res.status(500).send()
    }catch (e) {
        req.status(500).send()
    }
})

/*
We have created a middleware in video 106. When request will come to get users then we will
call a middleware called auth, that we have created in middleware/auth.
Before actually calling this request we can perform certain operations in middleware like
if we really want to allow that user to see the list of users.
 */
router.get('/users/me',auth,async (req,res)=>{

    // User.find({}).then((users)=>{ //From User Model find all the entries. The returned entries will be stored in users.
    //     res.send(users)
    // }).catch((error)=>{
    //     res.status(500).send()
    // })

    try {
      //  const user = await User.find({})
        //in auth method  we have fethced and stored user in req method.
        res.send(req.user)
    }catch (e) {
        res.status(500).send()
    }

})



router.patch('/users/me', auth, async(req,res)=>{

    //Check if user has entered something else apart from name, email, password, age in property.
    const updates = Object.keys(req.body)
    const allowedUpdate = ['name','email','password','age']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdate.includes(update)
    })

    if(!isValidOperation){
        return  res.status(400).send({error:'Invalid Update Operation'})
    }

    try {
       // const _id = req.params.id
        /*
        We are using Schema now in models/users. Schema allow us to perform some middle operation before
        saving the data in db. We can perform password encryption before saving it to db.
        Now save function automatically goes in to schema which we have defined in models but
        update by passes it. So we have to specify explicitly to go to schema operation before saving.
         */
        //const user = await User.findByIdAndUpdate(_id,req.body,{new : true, runValidators: true})

        /*
        now we have to search which property user is trying to update, so we loop in a updates array
        which have all the property stored.
        store the user property with the property passed by user.
         */
        //const user = await User.findById(_id)
        updates.forEach((update)=>{
            req.user[update]= req.body[update]
        })
        await req.user.save()

        // if(!user) {
        //     console.log('User not found')
        //     return res.status(404).send()
        // }

        res.send(req.user)

    }catch (e) {
        res.status(400).send(e)
    }

})

/*
If user has logged in then only it can be deleted. So setting up here to delete the logged in user.
 */

router.delete('/users/me',auth, async(req,res)=>{

    /*
    we do not need id as logged in user id will be in req.id
     */
    //const _id = req.params.id

    try {
        // const user = await User.findByIdAndDelete(_id)
        // if(!user) {
        //     return res.status(404).send('User not found')
        // }
//We have made a pre method based on remove to delete all the task of the users, before deleting the user.
   //so that method will be callled first before deleting the user.
        await req.user.remove()
        res.send(req.user)

    }catch (e) {
        res.status(500).send()

    }
})




module.exports = router