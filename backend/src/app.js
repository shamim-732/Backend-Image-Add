import express from 'express';
import path from 'path';


import userRoutes from './route/userRoutes.js'

import cors from 'cors';


const app = express();


app.use(cors());

app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/uploads', express.static('uploads'));

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});