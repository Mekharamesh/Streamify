import express from 'express'
import "dotenv/config"
import cookieParser from "cookie-parser"
import cors from "cors"

import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import chatRoutes from "./routes/chat.route.js"
import { connectDB } from './lib/db.js';

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://funny-kashata-554c5a.netlify.app"
  ],
  credentials: true
}));

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // ✅ FIXED
app.use('/api/chat', chatRoutes);

// ✅ Test route
app.get("/", (req, res) => {
    res.send("Server is running");
});

// ✅ Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});