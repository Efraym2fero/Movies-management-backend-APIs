import "dotenv/config"
import jwt from "jsonwebtoken"


export const genToken = (id,res)=>{
    const payload = {id:id}
    const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXP_IN||"2d"})
    res.cookie("jwt",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",
        maxAge:(1000*60*60*24)*2
    })
    return token
}
