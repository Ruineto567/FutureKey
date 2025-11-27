// backend/src/models/User.js

import mongoose from 'mongoose';

const GoogleTokenSchema = new mongoose.Schema({
  access_token: String,
  refresh_token: String,
  scope: String,
  token_type: String,
  expiry_date: Number
}, { _id: false });

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  passwordHash: {
    type: String,
    required: true,
    select: false, // não retorna por padrão
  },
  plan: {
    type: String,
    enum: ['free', 'starter', 'pro', 'agency'],
    default: 'free',
  },
  googleTokens: GoogleTokenSchema,
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);
export default User;
