// Imports - Dependencies
import * as dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import 'express-async-errors';

// Imports - Routers
import jobRouter from './routers/jobRouter.js';
import authRouter from './routers/authRouter.js';
import userRouter from './routers/userRouter.js';

// Imports - Middleware
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { authenticateUser } from './middleware/authMiddleware.js';

// Configuration
dotenv.config();
const app = express();
const port = process.env.PORT || 5100;

// Middleware
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes - Test
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.get('/api/v1/test', (req, res) => {
  res.json({ msg: 'test route' });
});

app.post('/', (req, res) => {
  console.log(req);
  res.json({ message: 'Data received', data: req.body });
});

// Routes - API
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobRouter);
app.use('/api/v1/users', authenticateUser, userRouter);

// Routes - 404
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found' });
});

// Error Handler
app.use(errorHandlerMiddleware);

// Database Connection & Server Start
try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server running on PORT ${port}....`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}