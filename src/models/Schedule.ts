import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    login: { type: String, required: true},
    password: { type: String, required: true},
    date: { type: String, required: true},
    time: { type: String, required: true},
    teamName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '30d' }
});

export const Schedule = mongoose.model('Schedule', scheduleSchema);