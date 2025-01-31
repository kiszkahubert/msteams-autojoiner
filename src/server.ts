const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
import { createSession, updateLoginData, updateTeamsData, updateScheduleDateTime, getSessionData } from './services/sessionService';
import { connectDB } from './database';

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../src/front')));
require('dotenv').config();
connectDB();

app.post('/update-teams', async (req: any, res: any) => {
    const { sessionId, teams } = req.body;
    if (!sessionId || !Array.isArray(teams)) {
        return res.status(400).json({ error: 'invalid data' });
    }
    await updateTeamsData(sessionId, teams);
    res.json({ success: true });
});

app.get('/get-teams', async (req: any, res: any) => {
    const { sessionId } = req.query;
    if (!sessionId) {
        return res.status(400).json({ error: 'session id is required' });
    }
    const sessionData = await getSessionData(sessionId);
    res.json({ teams: sessionData?.teamsData || [] });
});

app.post('/save-schedule', async (req: any, res: any) => {
    const { sessionId, date, time, teamName } = req.body;
    if (!sessionId || !date || !time || !teamName) {
        return res.status(400).json({ error: 'Invalid data' });
    }
    await updateScheduleDateTime(sessionId, date, time, teamName);
    res.json({ success: true });
});

app.post('/login',async (req: any,res: any) => {
    const { email, password} = req.body;
    if(!email || !password || typeof email !== 'string' || typeof password !== 'string'){
        return res.status(400).json({ error: 'Invalid credentials' });
    }
    try{
        const sessionId = await createSession();
        await updateLoginData(sessionId, email, password);
        const childProcess = spawn('node',['dist/mainSEscript.js', sessionId],{
            detached: true,
            stdio: 'inherit',
            env:{
                ...process.env,
                NODE_ENV: 'production'
            }
        });
        childProcess.unref();
        res.json({ success: true, sessionId })
    } catch (error){
        res.status(500).json({ error: error })
    }
});
app.get('/',(req: any, res: any) => {
    res.sendFile(path.join(__dirname, '../','src','front','index.html'))
})
app.listen(3000,() => console.log("Working"))