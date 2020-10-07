const express=require('express')
const User=require('../model/user')
const auth =require('../middleware/auth')
const router = new express.Router()

router.post('/users', async (req,res) => {
    const user=new User(req.body)

    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (e){
        res.status(400).send()
    }
    // user.save().then(() =>{
    //     res.status(201).send(user)
    // }).catch((e) =>{
    //     res.status(400).send(e)
    // })
})


router.post('/users/login', async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout',auth,async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) =>{
            return token.token  !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.send().status(500)
    }
})

router.post('/users/logoutAll',auth,async (req,res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.send().status(500)
    }
})


router.get('/users/me', auth ,async (req,res) => {
    res.send(req.user)
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
        const user = await User.findById(_id)

        updates.forEach((update) => {
            user[update]=req.body[update]
        })
        await user.save()
        //remove this because findByIdAndUpdate bypass the mongoose method so we remove so middleware work correctly
        // const user =await User.findByIdAndUpdate(_id,req.body, { new : true ,runValidators: true})
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
