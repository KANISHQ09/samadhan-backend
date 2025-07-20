import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import nodemailer from 'nodemailer';
import complaintRoutes from './routes/Complaints.js';
import { db } from './firebase.js';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === Complaint Routes ===
app.use('/api/complaints', complaintRoutes);

// === Send Verification Code ===
app.post('/api/sendCode', async (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    console.log("📥 Request to send code to:", email);

    // Save the code in Firestore
    await setDoc(doc(db, 'verifications', email), { code });
    console.log("✅ Code saved to Firestore");

    // Send code via Gmail using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // use app password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Verification Code',
      text: `Your verification code is: ${code}`,
    });

    console.log("📨 Email sent to", email);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error sending code:', err);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});

// === Verify Code ===
app.post('/api/verifyCode', async (req, res) => {
  const { email, code } = req.body;

  try {
    const docRef = doc(db, 'verifications', email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().code === code) {
      console.log("✅ Code verified for:", email);
      return res.json({ valid: true });
    }

    console.log("❌ Incorrect code for:", email);
    res.json({ valid: false });
  } catch (err) {
    console.error('❌ Verification error:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// === MongoDB Connection ===
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('📦 MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// === Start Server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
