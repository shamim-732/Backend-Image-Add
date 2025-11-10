import express from 'express';
import userController from '../controller/userController.js';
import verifyMiddleware from '../middleware/verify.js';
import upload from '../middleware/multer.js';

const router = express.Router();



router.post("/register", userController.register);
router.post('/login', userController.loginUser);
router.post('/create', upload.single('pic'), userController.createUser);
router.get('/getall', userController.getUser);

router.put('/:email', upload.single('pic'), userController.updateUser);
router.delete('/:email', userController.deleteUser);



router.get('/profile', verifyMiddleware, userController.getUserProfile); 

export default router;