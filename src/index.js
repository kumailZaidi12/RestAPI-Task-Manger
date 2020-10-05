const express=require('express')
require('./db/mongoose')
const User=require('./model/user')
const Task=require('./model/task')
const { ObjectID } = require('mongodb')

const app=express()
const port=process.env.PORT || 3000

//express parse the json into object
app.use(express.json())


//Users
app.post('/users', async (req,res) => {
    const user=new User(req.body)

    try{
        await user.save()
        res.status(201).send(user)
    } catch (e){
        res.status(400).send()
    }
    // user.save().then(() =>{
    //     res.status(201).send(user)
    // }).catch((e) =>{
    //     res.status(400).send(e)
    // })
})



//fetch multiple user
app.get('/users', async (req,res) => {

    try{
        const users= await User.find({})
        res.send(users)

    } catch (e){
        res.status(500).send()
    }


    // User.find({}).then((users) =>{
    //     res.send(users)
    // }).catch(() => {
    //     res.status(500).send()
    // })
})



//fetch single user by id
app.get('/users/:id',  async (req, res) => {
    const _id = req.params.id // Access the id provided

    try {
        const user = await User.findById(_id)
        if(!user)
            return res.status(404).send()
        res.send(user)    

    } catch (e) {
        res.status(500).send()
    }
    
    // User.findById(_id).then((user) => {
    //     if (!user) { // this will come if id is of 12 byte agr isse kam ya zada hogi to 500 wala error come
    //     return res.status(404).send()
    // }
    // res.send(user)
    // }).catch((e) => {
    //  res.status(500).send()
    // })
})


app.patch('/users/:id', async (req,res) => {
    const _id=req.params.id
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const isVaildOperation=updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isVaildOperation){
        return res.status(400).send({error: 'Invaild operation'})
    }


    try {
        const user =await User.findByIdAndUpdate(_id,req.body, { new : true ,runValidators: true})
        if(!user){
            return res.status(404).send()
        }

        res.send(user)
    } catch (e){
        res.status(400).send()
    }

})

//Tasks
app.post('/tasks', async (req,res) => {
    const task=new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send()
    }
})

app.get('/tasks', async (req,res) => {

    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) {
        res.status(500).send()
    }

})

app.delete('/users/:id', async (req,res) =>{

    try {
        const user= await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)

    } catch (e) {
        res.status(500).send()
    }


})

app.get('/tasks/:id', async (req,res) =>{
    const _id=req.params.id
    try {
        const task = await Task.findById(_id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

app.patch('/tasks/:id', async (req,res) => {
    const update=Object.keys(req.body)
    const allowedUpdates=['description','completed']
    const isVaildOperation=update.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isVaildOperation){
        return res.status(400).send({error: 'Invaild operation'})
    }
    
    try{
        const task= await Task.findByIdAndUpdate(req.params.id,req.body, { new :true , runValidators:true  })
        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    }catch (e){
        res.status(400).send()
    }
})


app.delete('/tasks/:id', async (req,res) => {
    try {
        const task= await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})



app.listen(port, () =>{
    console.log('Server has started at',port);
})