import mongoose from 'mongoose';
import { AuditorStatus, IAuditor } from '../interfaces/auditor';

const AuditorSchema = new mongoose.Schema<IAuditor>(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    auditor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    auditor_email: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(AuditorStatus),
      default: AuditorStatus.INVITED,
    },
  },
  { timestamps: true }
);

const AuditorModel =
  mongoose.models.auditor || mongoose.model<IAuditor>('auditor', AuditorSchema);

export default AuditorModel;
