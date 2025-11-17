import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js"
import semesterRoutes from  "./routes/semesterRoutes.js"
dotenv.config();
const PORT = process.env.PORT || 5001;

const app = express();

app.use(cookieParser());
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/semester",semesterRoutes);
app.use("/api/user",userRoutes);

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server started on PORT : ${PORT}`);
        
    })
})