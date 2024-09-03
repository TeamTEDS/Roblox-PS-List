// models/Link.js
import mongoose from 'mongoose';

const LinkSchema = new mongoose.Schema({
  name: String,
  url: String,
  imageUrl: String,
  category: String,
});

module.exports = mongoose.models.Link || mongoose.model('Link', LinkSchema);