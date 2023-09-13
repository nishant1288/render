import express, { response } from 'express';
import Controller from './Controller';

const app = express();

app.get('/', (request, response) => {
    Controller();
    response.send('Server is running successfully')
})

const PORT = process.env.PORT || 8211;

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})