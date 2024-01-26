import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoute from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import multer from 'multer';
import nodemailer from 'nodemailer';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs/promises';


const app = express();
dotenv.config();

mongoose.set('strictQuery', true);
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());


// Multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Nodemailer configuration for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'krish221200867@gmail.com',
    pass: 'xkxd bikq qvyy ygtn',
  },
});

// CSV Writer configuration
const csvWriter = createObjectCsvWriter({
  path: 'output.csv',
  header: [
    { id: 'name', title: 'Name' },
    { id: 'email', title: 'Email' },
    { id: 'awb_no', title: 'AWB No' },
  ],
});

// ...

// API endpoint for uploading CSV file
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    // Process CSV file and add the awb_no column
    const records = req.file.buffer.toString('utf-8').split('\n');
    const data = records.map(record => {
      const [name, email] = record.split(',');
      return { name, email, awb_no: '' };
    });

    // Write to CSV file
    await csvWriter.writeRecords(data);

    // Read the content of the CSV file
    const csvContent = await fs.readFile('output.csv', 'utf-8');

    // Send email with the updated CSV file as an attachment
    const mailOptions = {
      from: 'krish221200867@gmail.com',
      to: 'hy945196@gmail.com',
      subject: 'CSV File with AWB No',
      attachments: [
        {
          filename: 'output.csv',
          content: csvContent,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'File uploaded successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ...



const connect = async () => {

try {
 await mongoose.connect(process.env.MONGO);
    console.log('Connected to MongoDB');
} catch (error) {
    handleError(error);
    console.error(error);
}
}

app.use("/api/auth", authRoute);


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