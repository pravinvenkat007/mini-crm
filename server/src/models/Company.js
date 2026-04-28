import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    industry: { type: String, trim: true },
    location: { type: String, trim: true },
    website: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

export default mongoose.model('Company', companySchema);
