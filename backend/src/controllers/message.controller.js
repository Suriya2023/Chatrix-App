import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../DataBase/clloudnary.js";
import { getReceiverSocketId, io } from "../DataBase/socket.js";
// import { Socket } from "socket.io";

export const getUserForSideBar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getUserForSideBar:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const SendMessages = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;

        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });
        await newMessage.save();
        const receiverSocketId = getReceiverSocketId(receiverId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }
        res.status(201).json(newMessage);

    } catch (error) {
        console.error("Error in SendMessages:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
