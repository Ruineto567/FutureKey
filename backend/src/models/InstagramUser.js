// backend/src/models/InstagramUser.js
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  createdAt: Date,
  likes: Number,
  comments: Number,
  caption: String,
  image: String,
  mediaType: String
});

const InstagramUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  companyName: {
    type: String,
    default: ''
  },
  profileImage: {
    type: String,
    default: ''
  },
  posts: [PostSchema]
});

const InstagramUser = mongoose.model('InstagramUser', InstagramUserSchema);

export default InstagramUser;
