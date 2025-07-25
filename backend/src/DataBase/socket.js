import http from "http";
import express from 'express';
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        // methods: ["GET", "POST"]
        credentials: true,
    },
});
export function getReceiverSocketId(userId) {
    return userSocketMap[userId]
}
const userSocketMap = {};
io.on("connection", (socket) => {
    console.log("✅ A user Connected:", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        console.log("✅ A user Disconnected:", socket.id.fullName, socket.fullName);
        delete userSocketMap[userId],
            io.emit("getOnlineUsers", Object.keys(userSocketMap))
    });
});

export { io, app, server };
