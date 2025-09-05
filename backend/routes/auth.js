const express = require("express")
const jwt  = require("jsonwebtoken")
const auth = require("../models/user")
const router = express.Router()

require("dotenv").config();  // load .env
const SECRET = process.env.JWT_SECRET

// signup
router.post('/signup', async (req,res)=>{
    const {username,password} = req.body
    try{
        const user = new auth({username,password})
        await user.save()

        const token = jwt.sign({id:user._id}, SECRET, {expiresIn:"1d"})
        console.log("Generated token (signup):", token);

        res.cookie("token", token, 
            {   httpOnly:true,
                secure:false,
                maxAge:24*60*60*1000,
                sameSite:'lax',
                path:'/'
            })
        res.status(200).json({
            message:"SignUp success"
        })
    }
    catch(err){
        res.status(400).json({
            message:"username exist"
        })
    }
})

//login
router.post('/login', async (req,res)=>{
    try{
        const {username,password} = req.body
        const user = await auth.findOne({username})
        if(!user) return res.status(400).json({message:"invaild credentials"})

        const comparePassword = await user.comparePass(password)
        if(!comparePassword) return res.status(400).json({message:"invaild credentials"})

        const token = jwt.sign({id:user._id}, SECRET, {expiresIn:"1d"})
        console.log("Generated token (login):", token);

        res.cookie("token", token, 
            {   httpOnly:true, 
                secure:false,
                maxAge:24*60*60*1000,
                sameSite:'lax',
                path:'/'
            })
        res.status(200).json({
            message:"login success"
        })
    }
    catch(err){
        res.status(400).json({
            message:err
        })
    }

})

//logout
router.post("/logout", async (req,res)=>{
    res.clearCookie("token")
    res.status(200).json({
        message:"logged out"
    })
})

module.exports = router