const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  avatar: { type: String, default: '' },
  likes: { type: Number, default: 0 },
  photos: { type: Number, default: 0 },
  videos: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  isFree: { type: Boolean, default: false },
  isNewModel: { type: Boolean, default: false },
  isOnline: { type: Boolean, default: false },
  bio: {
    en: { type: String, default: '' },
    he: { type: String, default: '' },
    fr: { type: String, default: '' },
  },
  tags: [String],
  category: {
    type: String,
    enum: ['top', 'new', 'free', 'popular'],
    default: 'popular',
  },

  onlyfansLink: { type: String, default: '' },
  socialLinks: {
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    snapchat: { type: String, default: '' },
    youtube: { type: String, default: '' },
    telegram: { type: String, default: '' },
    reddit: { type: String, default: '' },
    website: { type: String, default: '' },
  },
  age: { type: Number, default: null },
  location: { type: String, default: '' },
  ethnicity: { type: String, default: '' },
  bodyType: { type: String, default: '' },
  hair: { type: String, default: '' },
  eyes: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  previewVideo: { type: String, default: '' },

  createdAt: { type: Date, default: Date.now },
});

profileSchema.index({ name: 'text', username: 'text', 'bio.en': 'text' });

module.exports = mongoose.model('Profile', profileSchema);
