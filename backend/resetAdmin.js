const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');

async function resetAdmin() {
  await connectDB();
  try {
    const hashedPassword = await bcrypt.hash('1234', 10);
    await Admin.updateOne({ username: 'admin' }, { password: hashedPassword });
    console.log('Admin password reset successfully');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

resetAdmin();