const Task = require("../models/task")
const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken");

require("dotenv").config();  // load .env
const SECRET = process.env.JWT_SECRET

const Auth = (req,res,next)=>{
    console.log("All cookies:", req.cookies); // Debug line
    // console.log("Headers:", req.headers); // Debug line

    const token = req.cookies.token
    if(!token)return res.status(401).json({message:"No token"})
    try{
        const decode = jwt.verify(token, SECRET)
        req.userid = decode.id
        next()
    }
    catch(err){
        res.status(400).json({message:err})
    }
}

//ADD TASK
router.post("/todo", Auth, async (req,res)=>{
    try{
        const {id,task,message} = req.body
        const todo = new Task({id:req.body.id, task:req.body.task, message:req.body.message, userid:req.userid})
        await todo.save()

        res.status(200).json({
            status:"success",
            message:`${task} task added successfully`
        })
    }
    catch(err){
        console.log(err)
        return res.status(400).json({
            status:"error",
            message:"Something wrong"
        })
    }
})

// GET TASK
router.get("/todo", Auth, async (req,res)=>{
    try{
        const data = await Task.find({userid:req.userid})

        if(data.length === 0){
            return res.status(404).json({
                status:"error",
                message:"No task found"
            })
        }

        res.status(200).json({
            status:"success",
            id: data.map(task => task.id),
            message:data
        })
    }
    catch(err){
        res.status(400).json({
            status:"error",
            message:err.message
        })
    }
})

//DELETE TASK
router.delete("/todo/:id", Auth, async (req,res)=>{
    try{
        const id = Number(req.params.id)
        await Task.deleteOne({id:id, userid: req.userid})

        res.json({
            status:"success",
            message:"Your task deleted"
        })
    }
    catch(err){
        console.log(err)
        res.status(400).json({
            status:"error",
            message:err.message
        })
    }
})

// UPDATE TASK
router.patch("/todo/:id", Auth, async (req,res)=>{

    try{
        const id = Number(req.params.id)
        const {task, message} = req.body
        await Task.updateOne({id: id, userid:req.userid},{$set:{task:task, message:message}})

        res.status(200).json({
            status:"success",
            message:"Task updated"
        })
    }
    catch(err){
        console.log(err)
        res.status(400).json({
            status:"error",
            message:err.message
        })
    }

})

module.exports = router