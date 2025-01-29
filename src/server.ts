const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
import { error } from 'console';
import crypto, { Cipher } from 'crypto';

const app = express();
app.use(express.json());
require('dotenv').config();

function encrypt(text: string): string{
    const key = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf-8','hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
}

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