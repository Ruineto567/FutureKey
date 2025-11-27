import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  followers: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  bestDay: { type: String, default: null },
  bestHour: { type: String, default: null },
  hashtags: [{ type: String }]
}, {
  timestamps: true // adiciona createdAt e updatedAt automaticamente
});

export default mongoose.model("Analytics", analyticsSchema);
