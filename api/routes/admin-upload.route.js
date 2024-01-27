
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

    await addColumnToCSV(newData);

    await writeCSV(data);

    const updatedCSVContent = await readCSV();

    const adminMailOptions = {
      from: 'krish2212008@akgec.ac.in',
      to: 'sharmageeta847@gmail.com', 
      subject: 'Admin CSV File',
      attachments: [
        {
          filename: 'admin-updated.csv',
          content: Buffer.from(updatedCSVContent),
        },
      ],
    };

    await sendEmail(adminMailOptions);

    res.status(200).json({ message: 'Admin File uploaded successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
