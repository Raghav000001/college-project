import jwt from 'jsonwebtoken'

 export const createToken= (userId,res) => {
    const token=jwt.sign({userId},process.env.JWT_SECRET)
    res.cookie("jwt",token)
}