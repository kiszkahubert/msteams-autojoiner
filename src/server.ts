const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
import { encrypt } from './cryptoService';
import { connectDB } from './database';

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../src/front')));
require('dotenv').config();
connectDB();

let teamsData: string[] = [];
let scheduledDateTime: {date: any, time: any};

app.post('/update-teams',(req: any, res: any) => {
    console.log(req.body.teams);
    teamsData = req.body.teams;
    res.json({ success: true });
});

app.get('/get-teams', (req: any, res: any) =>{
    res.json({ teams: teamsData });
})

app.post('/get-datetime',(req: any, res: any) => {
    scheduledDateTime = req.body;
    res.json({ success: true });
})

app.post('/login',(req: any,res: any) => {
    const { email, password} = req.body;
    if(!email || !password || typeof email !== 'string' || typeof password !== 'string'){
        return res.status(400).json({ error: 'Invalid credentials' });
    }
    const encryptedEmail = encrypt(email);
    const encryptedPassword = encrypt(password);
    const childProcess = spawn('node',['dist/index.js', encryptedEmail, encryptedPassword],{
        detached: true,
        stdio: 'inherit',
        env:{
            ...process.env,
            NODE_ENV: 'production'

        }
    });
    childProcess.unref();
    res.json({ success: true })
});
app.get('/',(req: any, res: any) => {
    res.sendFile(path.join(__dirname, '../','src','front','index.html'))
})
app.listen(3000,() => console.log("Working"))