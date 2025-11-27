import mongoose from 'mongoose';

const InstagramPostSchema = new mongoose.Schema({
  username: { type: String, index: true, required: true }, // sem @
  createdAt: { type: Date, index: true, required: true },
  likes:     { type: Number, default: 0 },
  comments:  { type: Number, default: 0 },
  caption:   { type: String, default: '' },
  image:     { type: String, default: null },
  mediaType: { type: String, default: null }, // ex: 'image', 'video', 'carousel'
}, { timestamps: true });

InstagramPostSchema.index({ username: 1, createdAt: -1 });

export default mongoose.model('InstagramPost', InstagramPostSchema);
