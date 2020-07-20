const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./tasks')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim : true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim:true,
        validator(value){ //In password enterted has keyword password then throw a error.
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    email: {
        type : String,
        required: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)){  //using isEmail method of validator npm to validate Email.
                throw new Error('Email is invalid')
            }
        },
        trim : true,
        lowercase :true
    },
    tokens: [{ //we are creating a sub document in model. Each token in token will have individually _id.
        token: {
            type : String,
            require: true
        }
    }]
}, {
    timestamps: true//Whenever user will be created create timestamp will be stored.
})


/*
A User can have multiple tasks associated with it.
So we are storing a relationship between them. It is not actual data that will be stored in db
but just a relationship for the reference.
 */
userSchema.virtual('tasks',{
    ref:'Task', //we have reference of tasks but it is virtual not actually stored in db,
    localField :'_id',
    foreignField:'owner'
})

userSchema.methods.generateAuthToken = async function () {

    const user = this
    const token = jwt.sign({_id:user._id.toString()}, 'thisismynewcourse')

    user.tokens=user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) =>{

//Find credentials function to validate user.

    //FindOne will check if that email exist in User table.
    const user = await User.findOne({email:email})

    if(!user) {
        throw new Error('Unable to login')
    }

    //Compare the password
    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch) {
        throw new Error ('Unable to login')
    }

    return user
}

//This method will be automatically called when we will do res.send.
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    /*
    When we will send response object, instead of sending entire model we can
    remove password and tokens from it.
     */
    delete userObject.password
    delete userObject.tokens

    return userObject
}


/*
We are now using userSchema as user Schema allow us to perform certain operation before and after saving
the document. Suppose we want password encryption before saving it into db then we can use pre method of
schema and perform the operations.
 */
//before save do this operation which is specified in the action function. save should be as it is, it is a keyword.
userSchema.pre('save',async function (next){

    const user = this

    /*
    IF user has modified the passowrd means creating a new password or different from the
    previous one. Then hash it's passowrd, 8 is number of round to perform for security.
     */
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    //Next tells the pre operation is completed now go ahead and save it.
    next()
})


/*
Delete all the task of Users if User is removed.
remove is keyword. So before removing user delete all it;s task.
 */
userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({owner:user.id})
    next()
})


const User = mongoose.model('User',userSchema)

module.exports = User