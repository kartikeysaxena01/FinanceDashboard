const express=require('express');
const bcrypt=require("bcryptjs");
const User = require('../model/User');
const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');
const {generateToken}=require('../utils/jwtService');
exports.registerUser=async(req,res)=>{
  try{
   const{name,email,password,role}=req.body;
   if(!name || !email || !password){
    return res.status(400).json({
      message:"Name,email and Password are required!"
    });
   }
   const existingUser=await User.findOne({email});
   if(existingUser){
    return res.status(400).json({
      message:"User already exists"
    });
   }
   const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if(!emailRegex.test(email)){
    return res.status(400).json({
      message:"Invalid Email",
    })
   }
   const nameRegex=/^[A-Za-z\s]+$/;
   if(!nameRegex.test(name)){
    return res.status(400).json({
      message:"Invalid name",
    })
   }
   const hashedPassword=await bcrypt.hash(password,10);
   const user=new User({
    name,
    email,
    password:hashedPassword,
    role:role||"viewer"
   });
   await user.save();
   return res.status(201).json({
    message:"User registered successfully",
    user:{
      name:user.name,
      email:user.email,
      password:user.password,
      role:user.role
    }
   })
  }catch(error){
    return res.status(500).json({
      message:"Server Error",
      error:error.message
    })
  }
}

exports.loginUser=async(req,res)=>{
  try{
    const{email,password}=req.body;
    if(!password || !email){
      return res.status(400).json({
        message:"Email and Password are required"
      })
    }
    const user=await User.findOne({email});
    if(!user){
      return res.status(401).json({
        message:"Invalid credentials"
      })
    }
    if(user.status==="inactive"){
      return res.status(403).json({
        message:"User account is inactive"
      });
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(401).json({
        message:"Invalid credentials"
      });
    }
    const token = generateToken(
      {
        id: user._id,
        role: user.role
      },
    );
    return res.status(200).json({
      message:"Login successful",
      token,
      user:{
        name:user.name,
        email:user.email,
        role:user.role,
      }
    });
  }catch(error){
    return res.status(500).json({
      message:"Server error",
      error:error.message
    });
  }
};
exports.getUser=async(req,res)=>{
  try{
    const users=await User.find().select("-password");
    res.status(200).json({
      message:"User fetched successfully",
      count:users.length,
      users
    });
  }catch(error){
    return res.status(500).json({
      message:"Server Error",
      error:error.message
    })
  }
}
exports.updateUserRole=async(req,res)=>{
  try{
    const {id}=req.params;
    const {role}=req.body;
    const allowedRole=["viewer","analyst","admin"];
    if(!role){
      return res.status(400).json({
        success:false,
        message:"role is missing to assign"
      })
    }
    if(!allowedRole.includes(role)){
     return res.status(400).json({
      message:"Invalid role"
     }) 
    }
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({
        message:"Invalid Id"
      })
    }
    const user=await User.findById(id);
    if(!user){
      return res.status(404).json({
        success:false,
        message:"User not found"
      })
    }
    if(user.role===role){
      return res.status(400).json({
        message:"User already has this role"
      })
    }
    user.role=role;
    await user.save();
    return res.status(200).json({
      message:"User role updated successfully",
      user:{
        name:user.name,
        email:user.email,
        role:user.role,
      }
    });  
  }catch(error){
    return res.status(500).json({
      success:false,
      message:"Server Error"
    })
  }
}
exports.updateUserStatus=async(req,res)=>{
  try{
    const {id}=req.params;
  const {status}=req.body;
  const allowedStatus=["active","inactive"];
  if(!status){
    return res.status(400).json({
      message:"Status is missing"
    })
  }
  if(!allowedStatus.includes(status)){
    return res.status(400).json({
      message:"Invalid Status"
    })
  }
  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json({
      message:"Invalid Id"
    })
  }
  const user=await User.findById(id);
  if(!user){
    return res.status(404).json({
      message:"User not found"
    })
  }
  if(user.status===status){
    return res.status(400).json({
      message:"User already has this status",
    })
  }
  user.status=status;
  await user.save();
  return res.status(200).json({
    message:"User status updated successfully",
    user:{
      name:user.name,
      email:user.email,
      role:user.role,
    }
  })
  }catch(error){
    return res.status(500).json({
      message:"Server Error",
    })
  }
}
