import "dotenv/config"
import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";
import { genToken } from './../utils/genToken.js';

const getDate = async (req,res)=>{
  const users = await prisma.user.findMany()
  return res.json({"data":users})
}



const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;


    console.log("EMAIL:", email);
    
    const userExist = await prisma.user.findUnique({where:{email:email}})
    console.log(userExist);
    if (userExist) {
      return res.status(400).json({ message: "This user already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    console.log(typeof hashedPass);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPass },
    });

    const token = genToken(user.id,res)

    res.status(201).json({
      status: "created",
      data:
      {
        user:
        {
          id: user.id,
          name,
          email,
        },
        token
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const login = async (req,res)=>{
  try {
    const {email,password} = req.body

    const user = await prisma.user.findUnique({where:{email:email}})
    if(!user){
      return res.status(400).json({message:"invalid email or password"})
    }
    
    const validPass = await bcrypt.compare(password,user.password)

    if (!validPass){
      return res.status(400).json({message:"invalid email or password"})
    }

    const token = genToken(user.id,res)

    res.status(200).json(
      {"data":
        {
          user:{
            id:user.id,
            email,
            password
          },
          token
        }
      })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

const logout = async(req,res)=>{
  res.cookie("jwt","",{
    httpOnly:true,
    expires:new Date(0)
  })
  res.status(200).json(
    {
      status:"success",
      message:"logged out successfully"
    })
}


export { register,login,logout};