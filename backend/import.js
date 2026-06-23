require('dotenv').config();
const XLSX = require('xlsx');
const connectDB = require('./config/db');
const Order = require('./models/Order');

function normalizeStatus(status) {
  if (!status) return 'Active';
  const s = String(status).toLowerCase().trim();
  if (s.includes('complet')) return 'Completed';
  if (s.includes('cancel')) return 'Cancelled';
  return 'Active';
}

async function importOrders() {
  await connectDB();

  try {
    const workbook = XLSX.readFile('Order  Manegment.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const data = rawData.slice(2);

    console.log(`Found ${data.length} rows`);

    let imported = 0;

    for (const row of data) {
      const excelJobNo = row[1];
      const jobName = row[2];

      if (!excelJobNo || !jobName) continue;

      try {
        await Order.create({
          jobNo: `JOB-${excelJobNo}`,
          jobName,
          orderSource: row[3] || null,
          jobOwner: row[4] || null,
          assignPerson: row[5] || null,
          jobStatus: normalizeStatus(row[8]),
          remarks: row[10] || null,
        });
        imported++;
      } catch (err) {
        console.log(`Skipped JOB-${excelJobNo}: ${err.message}`);
      }
    }

    console.log(`✅ Imported ${imported} records`);
  } catch (err) {
    console.error('Import failed:', err);
  } finally {
    process.exit();
  }
}

importOrders();