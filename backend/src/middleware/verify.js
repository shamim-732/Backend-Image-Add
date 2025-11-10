import { verifyToken } from "../middleware/jwt.js";
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient(); // Prisma ক্লায়েন্ট এখানে অপ্রয়োজনীয়, কারণ এটি শুধুমাত্র টোকেন যাচাই করে।


const verifyMiddleware = async (req, res, next) => {
  
  try {
      const authHeader = req.headers.authorization;
    // console.log(authHeader); // Postman-এ টেস্টিং-এর জন্য এটি প্রিন্ট করবে
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    
 
    const decoded = verifyToken(token); 

    
    req.user = decoded; 
    next();
  } catch (err) {
    // টোকেন অবৈধ বা এক্সপায়ারড হলে এই এরর আসবে
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};

export default verifyMiddleware;