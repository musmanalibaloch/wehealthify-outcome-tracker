import mongoose from 'mongoose';

const outcomeSchema = new mongoose.Schema(
  {
    clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
    patientIdentifier: { type: String, required: true },
    painScore: { type: Number, required: true, min: 1, max: 10 },
    mobilityScore: { type: Number, required: true, min: 1, max: 10 },
    dateRecorded: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

outcomeSchema.index({ clinicId: 1, dateRecorded: -1 });

export default mongoose.model('Outcome', outcomeSchema);
