import express from 'express';
import multer from 'multer';
import { addColumnToCSV, readCSV, writeCSV } from '../controllers/csv.controller.js';
import { sendEmail } from '../controllers/email.controller.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const records = req.file.buffer.toString('utf-8').split('\n');
    const newData = []; 

    const data = records.map((record, index) => {
      const [name, email] = record.split(',');
      newData.push(`AWB${index + 1}`);
      return { name, email, awb_no: '' }; 
    });

    const originalCSVContent = await readCSV();

    await addColumnToCSV(newData);

    await writeCSV(data);

    const updatedCSVContent = await readCSV();

    const originalMailOptions = {
      from: 'krish221200867@gmail.com',
      to: 'sharmageeta847@gmail.com', 
      subject: 'Original CSV File',
      attachments: [
        {
          filename: 'original.csv',
          content: Buffer.from(originalCSVContent),
        },
      ],
    };

    const updatedMailOptions = {
      from: 'krish221200867@gmail.com',
      to: 'krish2212008@akgec.ac.in', 
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
