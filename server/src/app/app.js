import express from 'express';
import 'dotenv/config';
import authRoutes from '../routes/auth.routes.js';
import interviewRoutes from '../routes/interview.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
const app = express();
app.use(morgan('dev'));
app.use(express.json());
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
}));
app.use(cookieParser()); 
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
export default app;
