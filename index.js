import express, { response } from 'express';
import Controller from './Controller.js';

const app = express();

app.get('/', Controller)

const PORT = process.env.PORT || 8211;

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})