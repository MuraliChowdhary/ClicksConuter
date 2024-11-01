// models/Url.js
const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true,},
  shortUrl: { type: String, unique: true },
  clicks: { type: Number, default: 0 },
  clickData: [
    {
      region: String,
      latitude: Number,
      longitude: Number,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model('Url', UrlSchema);
