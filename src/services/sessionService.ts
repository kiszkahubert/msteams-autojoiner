import Redis from 'ioredis'
import { v4 as uuidv4 } from 'uuid'
import { encrypt } from './cryptoService'
import { Schedule } from '../models/Schedule';

interface ClientSession {
    teamsData?: string[]
    loginData?: {
        email: string;
        password: string
    },
    scheduleDateTime?: {
        date: string
        time: string
        teamName: string;
    }
}

const redis = new Redis({
    host: 'localhost',
    port: parseInt('6379')
});

async function createSession(): Promise<string> {
    const sessionId = uuidv4();
    await redis.set(`session:${sessionId}`, JSON.stringify({}),'EX', 1800);
    return sessionId;
}
async function updateLoginData(sessionId: string, email: string, password: string) {
    const encryptedEmail = encrypt(email);
    const encryptedPassword = encrypt(password);
    await updateSessionData(sessionId, {
        loginData: {
            email: encryptedEmail,
            password: encryptedPassword
        }
    });
}
async function updateTeamsData(sessionId: string, teams: string[]) {
    await updateSessionData(sessionId, { teamsData: teams });
}
async function updateScheduleDateTime(sessionId: string, date: string, time: string, teamName: string) {
    await updateSessionData(sessionId, {
        scheduleDateTime: {
            date,
            time,
            teamName
        }
    });
}
async function updateSessionData(sessionId: string, data: Partial<ClientSession>) {
    const existingSessionJson = await redis.get(`session:${sessionId}`);
    const existingSession = existingSessionJson ? JSON.parse(existingSessionJson) : {};
    const updatedSession = { ...existingSession, ...data };
    await redis.set(`session:${sessionId}`, JSON.stringify(updatedSession), 'EX', 3600);
}
async function getSessionData(sessionId: string): Promise<ClientSession | null>{
    const sessionJson = await redis.get(`session:${sessionId}`);
    return sessionJson ? JSON.parse(sessionJson) : null;
}
async function redisToMongo(){
    const sessionIds = await redis.keys('session:*');
    let newSchedule = null
    for(const sessionId of sessionIds){
        const sessionData = await getSessionData(sessionId.replace('session:',''));
        if(sessionData && sessionData.scheduleDateTime){
            newSchedule = new Schedule({
                login: sessionData.loginData!.email,
                password: sessionData.loginData!.email,
                date: sessionData.scheduleDateTime.date,
                time: sessionData.scheduleDateTime.time,
                teamName: sessionData.scheduleDateTime.teamName
            });
        }
        try{
            await newSchedule!.save();
        } catch(error){
            console.log(error)
        }
        await redis.del(sessionId);
    }
}

export { 
    createSession, 
    updateSessionData, 
    getSessionData, 
    updateLoginData, 
    updateTeamsData, 
    updateScheduleDateTime,
    redisToMongo
}