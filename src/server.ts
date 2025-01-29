const express = require('express');
const { spawn } = require('child_process');
const path = require('path')
const app = express();

app.use(express.json());
app.post('/login',(req: any,res: any) => {
    const { email, password} = req.body;
    const process = spawn('node',['dist/index.js', email, password],{
        detached: true,
        stdio: 'inherit'
    });
    process.unref();
    res.json({ success: true })
});
app.get('/',(req: any, res: any) => {
    res.sendFile(path.join(__dirname, '../','src','front','index.html'))
})
app.listen(3000,() => console.log("Working"))