import "dotenv/config"
import express from "express"
import { connectDB } from "./config/db.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";
import { guestIdentifier, apiLimiter } from "./middleware/rateLimiter.js";
import authRoutes from "./routes/authRoutes.js"
import semesterRoutes from "./routes/semesterRoutes.js"
import feedbackRoutes from "./routes/feedbackRoutes.js";
const PORT = process.env.PORT || 5001;

const app = express();

app.set('trust proxy', 1); // rate limit setup behind proxy (vercel)

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(guestIdentifier);
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/semester", apiLimiter, semesterRoutes);
app.use("/api/user", apiLimiter, userRoutes);
app.use("/api/feedback", feedbackRoutes);

connectDB().then(() => {
    if (!process.env.VERCEL) {
        app.listen(PORT, () => {
            console.log(`Server started on PORT : ${PORT}`);
        });
    }
})
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

export default app;