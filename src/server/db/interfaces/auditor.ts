import { Document, Types } from 'mongoose';

export enum AuditorStatus {
  INVITED = 'invited',
  VERIFIED = 'verified',
}

export interface IAuditor extends Document {
  customer: Types.ObjectId;
  auditor: Types.ObjectId;
  auditor_email: string;
  status: AuditorStatus;
}
