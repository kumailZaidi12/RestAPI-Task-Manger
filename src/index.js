const express=require('express')
require('./db/mongoose')
const User=require('./model/user')
const Task=require('./model/task')

const app=express()
const port=process.env.PORT || 3000

//express parse the json into object
app.use(express.json())

app.post('/users', (req,res) => {
    const user=new User(req.body)

    user.save().then(() =>{
        res.status(201).send(user)
    }).catch((e) =>{
        res.status(400).send(e)
    })
})

app.post('/tasks', (req,res) => {
    const task=new Task(req.body)

    task.save().then(() =>{
        res.status(201).send(task)
    }).catch((e) =>{
        res.status(400).send(e)
    })
})

//fetch multiple user
app.get('/users',(req,res) => {
    User.find({}).then((users) =>{
        res.send(users)
    }).catch(() => {
        res.status(500).send()
    })
})



app.listen(port, () =>{
    console.log('Server has started at',port);
})