import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware';
import { AppError } from './utils/AppError';
import authRouter from './routes/auth.routes';
import leadsRouter from './routes/leads.routes';

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://smartleads-frontend-v1ho.onrender.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/leads', leadsRouter);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});

// Handle unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(errorHandler);

export default app;
