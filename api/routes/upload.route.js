// routes/upload.route.js
import express from 'express';
import multer from 'multer';
import { addColumnToCSV, readCSV, writeCSV } from '../controllers/csv.controller.js';
import { sendEmail } from '../controllers/email.controller.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    // Process CSV file and add the awb_no column
    const records = req.file.buffer.toString('utf-8').split('\n');
    const newData = []; // Array to store values for the new column

    // Extract existing data and collect values for the new column
    const data = records.map((record, index) => {
      const [name, email] = record.split(',');
      newData.push(`AWB${index + 1}`); // Example: 'AWB1', 'AWB2', ...
      return { name, email, awb_no: '' }; // 'awb_no' initially empty
    });

    // Read the original CSV content
    const originalCSVContent = await readCSV();

    // Add the new column to the existing CSV
    await addColumnToCSV(newData);

    // Wait for the writeCSV function to complete before proceeding
    await writeCSV(data);

    // Read the updated CSV content
    const updatedCSVContent = await readCSV();

    // Send email with the original CSV file as an attachment
    const originalMailOptions = {
      from: 'krish221200867@gmail.com',
      to: 'sharmageeta847@gmail.com', // Update with the first recipient's email address
      subject: 'Original CSV File',
      attachments: [
        {
          filename: 'original.csv',
          content: Buffer.from(originalCSVContent),
        },
      ],
    };

    // Send email with the updated CSV file as an attachment
    const updatedMailOptions = {
      from: 'krish221200867@gmail.com',
      to: 'krish2212008@akgec.ac.in', // Update with the second recipient's email address
      subject: 'CSV File with AWB No',
      attachments: [
        {
          filename: 'updated.csv',
          content: Buffer.from(updatedCSVContent),
        },
      ],
    };

    // Send both emails
    await sendEmail(originalMailOptions);
    await sendEmail(updatedMailOptions);

    res.status(200).json({ message: 'File uploaded successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
