import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateToken } from "../middleware/jwt.js";

const prisma = new PrismaClient();

const userServices = {
    
    async getUserById(id) {
        return await prisma.user.findUnique({
            where: { id: id },
        });
    },

    async getAllUsers() {
        return await prisma.user.findMany();
    },

    ///USER CREATE
async createUser(data, file) {
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existingUser) {
        throw new Error("Email already exists");
    }

    
    const profile_pic = file ? `http://localhost:5000/uploads/${file.filename}` : null;


    const newUser = await prisma.user.create({
        data: {
            ...data,
            
            password: data.password ? await bcrypt.hash(data.password, 10) : undefined, 
            profile_pic, 
        },
    });

    return newUser;
},


   
 //USER UPDATE

async updateUser(email, data, file) { 
    try {
        const updatePayload = { ...data }; 

        
        if (updatePayload.password) {
            updatePayload.password = await bcrypt.hash(updatePayload.password, 10);
        }

        
        if (file) {
            updatePayload.profile_pic = `http://localhost:5000/uploads/${file.filename}`;
        }
        
        const updatedUser = await prisma.user.update({
            where: { email: email },
            data: updatePayload, 
        });
        return updatedUser;
    } catch (error) {
         if (error.code === 'P2025') { 
            throw new Error("User not found for update"); 
        }
        throw error;
    }
},
    //DELETE
    async deleteUser(email) {
        try {
            const deleted = await prisma.user.delete({
                where: { email: email },
            });
            return deleted;
        } catch (error) {
            
            if (error.code === 'P2025') {
                 throw new Error("User not found for deletion"); 
            }
            throw error;
        }
    },

    //  REGISTER
    async register(data) {
        const exists = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (exists) {
            throw new Error("User already exists");
        }

        const hashed = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashed,
                
            },
        });

        return user;
    },

    //  LOGIN
    async login(email, password) {

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            
            throw new Error("Invalid email or password"); 
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
           
            throw new Error("Invalid email or password"); 
        }

       
        const token = generateToken({
            id: user.id,
            email: user.email,
        });

        return { token, user };
    }

};
export default userServices;