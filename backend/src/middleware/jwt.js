import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (user) =>{
    return jwt.sign({id:user.id, email:user.email}, process.env.SECRET_KEY, { expiresIn: '7d'})
};


const verifyToken = (token) =>{
    return jwt.verify(token, process.env.SECRET_KEY);
};

export{generateToken,verifyToken}