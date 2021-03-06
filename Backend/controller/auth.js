const User = require('../models/auth')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const UserController = {}

//create user
UserController.createUser = async (req, res) =>{

    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist){
        res.status(400).json({"error":'Email already exist'}) 
    }
    try {
        req.body.password = bcrypt.hashSync(req.body.password, 10)

        const newUser =  new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          })
        
        let result = await newUser.save()

        res.status(201).send({ message: 'Account created', result})
    } catch (error) {
        console.log(error)
        res.status(400).send({ message:'Invalid data'})
    }
}

//login user
UserController.loginUser = async(req,res) => {
    try {
        const body = req.body
        const user = await User.findOne({ email: body.email}).exec()

        console.log('user',user)
        const passwordCheck = user === null
        ? false
        : await bcrypt.compareSync(body.password, user.password)

        if(!(user && passwordCheck)){
            return res.status(401).json({
                error: 'invalid email or password'
            })
        }

        const userToken = {
            email: user.email,
            name: user.name,
            id: user._id
        }

        const token = jwt.sign(userToken, process.env.SECRET)
        res.status(200).send({ token})
    } catch (error) {
        res.status(500).send(error)
    }
}


module.exports = UserController