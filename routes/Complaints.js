import express from 'express';
import multer from 'multer';
import path from 'path';
import Complaint from '../models/Complaint.js';

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// POST: Submit complaint
router.post('/', upload.single('image'), async (req, res) => {
  const { fullName, email, title, description, location } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const count = await Complaint.countDocuments();
    const complaintId = "CMP" + String(count + 1).padStart(3, "0");

    const newComplaint = new Complaint({
      fullName,
      email,
      title,
      description,
      location,
      imageUrl,
      complaintId,
      status: "Pending",
    });

    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Fetch all complaints
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
