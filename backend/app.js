import express from "express";
import authRoutes from "./src/routes/auth.route.js";
import contactRou from './src/routes/contactRoutes.js';
import userRoutes from './src/routes/user.route.js';
import messageRoute from './src/routes/message.route.js';

import cookieParser from "cookie-parser";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from "./src/DataBase/db.js";
import { app, server } from "./src/DataBase/socket.js";

// ✅ Fix for loading .env correctly from backend folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, ".env") });

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoute);
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRou);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("/*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

server.listen(PORT, () => {
    console.log(`🚀 Server is Running on Port ${PORT}`);
    connectDB();
});
