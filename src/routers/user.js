const express=require('express')
const User=require('../model/user')
const router = new express.Router()

router.post('/users', async (req,res) => {
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



router.get('/users', async (req,res) => {

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
router.get('/users/:id',  async (req, res) => {
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


router.patch('/users/:id', async (req,res) => {
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

router.delete('/users/:id', async (req,res) =>{

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

module.exports=router
