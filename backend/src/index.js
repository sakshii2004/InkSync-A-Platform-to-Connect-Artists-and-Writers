import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import profileRoutes from "./routes/profile.route.js";
import colabRoutes from "./routes/colab.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from"./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";


dotenv.config()
//const app = express(); //creates an express application instance

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

const PORT = process.env.PORT

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, //allow cookies and authorization headers to be sent
}))
app.use("/api/auth", authRoutes);
app.use("/api/user", profileRoutes); 
app.use("/api/colab", colabRoutes); 
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
    console.log("server is running on port:" + PORT);
    connectDB()
})