const mongoose = require('mongoose')
const validator=require('validator')
const bycrpt= require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const userSchema= new mongoose.Schema({
    name: {
    type: String,
    required:true,
    trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email is invaild')
            }
        }
    },
    age: {
        type: Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age must be positive value')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:6,
        validate(value){
          if(value.toLowerCase().includes('password')){
              throw new Error('Password cannot contain "password" ')
          }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON =  function (){
    const user =this

    const userObject = user.toObject() //raw  data of profile
    
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
   
    return userObject
}
userSchema.methods.generateAuthToken = async function (){
    const user =this
    const token = jwt.sign({ _id: user._id.toString()},'verify')

    user.tokens=user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({ email})
    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch =await bycrpt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user

}

// Hash the plan text password before savinf
userSchema.pre('save', async function (next) {
    const user=this
    
    if(user.isModified('password')){
        user.password= await bycrpt.hash(user.password,8)
    }
   
    next()
})

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next){
    const user =this
    await Task.deleteMany({owner:user._id})
    next()
})

const User = mongoose.model('User',userSchema )

module.exports=User