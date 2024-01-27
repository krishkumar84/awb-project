import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoute from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userUploadRoute from './routes/upload.route.js';
import adminUploadRoute from './routes/admin-upload.route.js'; 

const app = express();
dotenv.config();

mongoose.set('strictQuery', true);
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('Connected to MongoDB');
  } catch (error) {
    handleError(error);
    console.error(error);
  }
};

app.use("/api/auth", authRoute);


app.use('/', userUploadRoute);
app.use('/admin', adminUploadRoute);

app.use((err, req, res, next) => {
  console.error(err);
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  
  return res.status(errorStatus).send(errorMessage);
});

app.listen(3000, () => {
  connect();
  console.log('Server listening on port 3000');
});
