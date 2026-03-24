import "dotenv/config"
import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";


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

    res.status(201).json({
      status: "created",
      data: {
        id: user.id,
        name,
        email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export { register ,getDate};