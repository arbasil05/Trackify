import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js";
import cors from "cors";
import trackifyRoutes from "./routes/trackifyRoutes.js"
import cookieParser from "cookie-parser";
dotenv.config();
const PORT = process.env.PORT || 5001;


const app = express();

app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
// app.use(cors({
//   origin: "https://d2gxqtxb-5173.inc1.devtunnels.ms",
//   credentials: true
// }));

app.use(express.json());

app.use("/api/",trackifyRoutes)


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server started on PORT : ${PORT}`);
        
    })
})