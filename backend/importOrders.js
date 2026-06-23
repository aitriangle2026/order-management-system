require('dotenv').config();
const XLSX = require('xlsx');
const mysql = require('mysql2/promise');

function normalizeStatus(status) {
  if (!status) return 'Pending';

  const s = String(status).toLowerCase().trim();

  if (
    s.includes('complete') ||
    s.includes('completed') ||
    s.includes('comkplete')
  ) {
    return 'Completed';
  }

  if (
    s.includes('cancel') ||
    s.includes('cancled') ||
    s.includes('cancelled')
  ) {
    return 'Cancelled';
  }

  if (s.includes('progress')) {
    return 'In Progress';
  }

  return 'Pending';
}

async function importOrders() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  });

  try {
    const workbook = XLSX.readFile('Order  Manegment.xlsx');

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rawData = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
    });

    // Skip:
    // Row 0 = empty row
    // Row 1 = headers
    const data = rawData.slice(2);

    console.log(`Found ${data.length} rows`);

    let imported = 0;

    for (const row of data) {
      const excelJobNo = row[1];
      const jobName = row[2];

      // Skip blank rows
      if (!excelJobNo || !jobName) {
        continue;
      }

      const jobNo = `JOB-${excelJobNo}`;
      const orderSource = row[3] || null;
      const jobOwner = row[4] || null;
      const assignPerson = row[5] || null;
      const jobStatus = normalizeStatus(row[8]);
      const remarks = row[10] || null;

      try {
        await connection.query(
          `
          INSERT INTO orders (
            job_no,
            job_name,
            order_source,
            job_owner,
            assign_person,
            job_status,
            remarks
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          [
            jobNo,
            jobName,
            orderSource,
            jobOwner,
            assignPerson,
            jobStatus,
            remarks,
          ]
        );

        imported++;
      } catch (err) {
        console.log(
          `Skipped ${jobNo}: ${err.code || err.message}`
        );
      }
    }

    console.log(`✅ Imported ${imported} records`);
  } catch (err) {
    console.error('Import failed:', err);
  } finally {
    await connection.end();
  }
}

importOrders();