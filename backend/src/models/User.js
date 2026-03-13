import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true, select: false },
    clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
  },
  { timestamps: true }
);

userSchema.index({ username: 1, clinicId: 1 }, { unique: true });

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
