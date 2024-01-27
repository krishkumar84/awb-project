// controllers/csvController.js
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
    // Read existing CSV content
    const existingContent = await readCSV();

    // Parse the existing CSV data
    const existingData = existingContent
      .trim()
      .split('\n')
      .map((line) => line.split(','));

    // Determine existing headers
    const existingHeaders = existingData[0];

    // Add the 'awb_no' column to the headers if not already present
    if (!existingHeaders.includes('awb_no')) {
      existingHeaders.push('awb_no');

      // Set the determined headers in the csvWriter configuration
      csvWriter.header = existingHeaders.map(header => ({ id: header, title: header }));
    }

    // Add the new column values to each data row
    for (let i = 1; i < existingData.length; i++) {
      existingData[i].push(newData[i - 1] || ''); // Use an empty string if newData is undefined
    }

    // Write the updated CSV data back to the file
    await writeCSV(existingData);

    return 'CSV updated successfully.';
  } catch (error) {
    console.error('Error updating CSV:', error);
    throw error;
  }
};

export { writeCSV, readCSV, addColumnToCSV };
