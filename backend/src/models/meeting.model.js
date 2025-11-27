// backend/src/models/meeting.model.js
import mongoose from 'mongoose';

const MeetingSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true },
  title:    { type: String, required:true },
  datetime: { type: Date, required:true },
  link:     { type: String, default:'' },
}, { timestamps: true });

export default mongoose.model('Meeting', MeetingSchema);
