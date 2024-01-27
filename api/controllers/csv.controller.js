import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs/promises';

const CSV_PATH = './public/temp/output.csv';

const csvWriter = createObjectCsvWriter({
  path: CSV_PATH,
  header: [
    { id: 'name', title: 'Name' },
    { id: 'email', title: 'Email' },
    { id: 'awb_no', title: 'AWB No' },
  ],
});

const writeCSV = async (data) => {
  await csvWriter.writeRecords(data);
};

const readCSV = async () => {
  try {
    return await fs.readFile(CSV_PATH, 'utf-8');
  } catch (error) {
    console.error('Error reading CSV:', error);
    throw error;
  }
};

const addColumnToCSV = async (newData) => {
  try {
    const existingContent = await readCSV();

    const existingData = existingContent
      .trim()
      .split('\n')
      .map((line) => line.split(','));

    const existingHeaders = existingData[0];

    if (!existingHeaders.includes('awb_no')) {
      existingHeaders.push('awb_no');

      csvWriter.header = existingHeaders.map(header => ({ id: header, title: header }));
    }

    for (let i = 1; i < existingData.length; i++) {
      existingData[i].push(newData[i - 1] || ''); 
    }

    await writeCSV(existingData);

    return 'CSV updated successfully.';
  } catch (error) {
    console.error('Error updating CSV:', error);
    throw error;
  }
};

export { writeCSV, readCSV, addColumnToCSV };
