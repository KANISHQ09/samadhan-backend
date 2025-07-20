import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    title: String,
    description: String,
    location: String,
    imageUrl: String,
    complaintId: { type: String, required: true, unique: true },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);


const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
