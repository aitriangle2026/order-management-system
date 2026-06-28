const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');

async function createAdmin() {
  await connectDB();
  try {
    const username = 'admin';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
    username,
    email: "trianglewebserver@gmail.com",
    password: hashedPassword,
});
    console.log('✅ Admin created successfully');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

createAdmin();