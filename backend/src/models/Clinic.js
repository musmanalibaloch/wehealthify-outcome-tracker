import mongoose from 'mongoose';

const clinicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model('Clinic', clinicSchema);
