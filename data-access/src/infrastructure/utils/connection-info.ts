import mongoose from "mongoose";

export const printConnectionInfo = () => {
    console.log()
    console.log("Session Pool size = ", mongoose.connection['client'].s.sessionPool.sessions.count);
    console.log("Number of active sessions = ", mongoose.connection['client'].s.activeSessions.size);
}