import userServices from "../service/userServices.js";

const userController = {

    async getUser(req, res) {
        try {
            const users = await userServices.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch users' });
        }

    },

    async createUser(req, res) {
        try {
            const userData = req.body;
            
            const file = req.file; 

            if (!userData || !userData.email) {
                return res.status(400).json({ error: "Invalid user data" });
            }

            const newUser = await userServices.createUser(userData, file);

            res.status(201).json({
                user: newUser,
                message: "User created successfully",
            });
        } catch (error) {
            console.error(error);
            
            res.status(400).json({ error: error.message || "Failed to create user" }); 
        }
    },





        // update
async updateUser(req, res) {
    try {
        const email = req.params.email;
        const updateData = req.body;
        
        
        const file = req.file; 
        
        if (!email) {
            return res.status(400).json({ error: 'Email parameter is required' });
        }
        if (!updateData && !file) { 
            return res.status(400).json({ error: 'No data provided for update' });
        }
        
        
        const updatedUser = await userServices.updateUser(email, updateData, file); 
        
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found or nothing to update' });
        }
        res.status(200).json({ user: updatedUser, message: 'User updated successfully' });
    } catch (error) {
        
        res.status(500).json({ error: 'Failed to update user' });
    }
},


        //delete 
    async deleteUser(req, res) {
        try {
            const email = req.params.email;
            
            
            await userServices.deleteUser(email);

            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            
            if (error.message.includes("User not found")) {
                 return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Failed to delete user' });
        }

    },
        //login
    async loginUser(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            const result = await userServices.login(email, password);
            
           if (!result || !result.user) {
               return res.status(401).json({ error: 'Invalid email or password' });
           }

           
           return res.status(200).json({ message: 'Login successful', token: result.token, user: result.user });


        } catch (error) {
            
            res.status(401).json({ error: error.message || 'Failed to login user' });
        }
    },
        //profile
    async getUserProfile (req, res){
        try {
            
            const id=req.user.id; 
            const exists = await userServices.getUserById(id);
            if (!exists) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json({ user: exists });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch user profile' });    
        }
    },

    //register
    async register(req, res) {
        try {
            const user = await userServices.register(req.body);
            
            res.status(201).json({ message: "Register successful", user });
        } catch (error) {
            
            res.status(400).json({ error: error.message });
        }
    },


};

export default userController;