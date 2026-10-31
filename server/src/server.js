import app from './app/app.js';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
dotenv.config();
await connectDb();
const port= process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
