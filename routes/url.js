// routes/url.js
require("dotenv").config();
const express = require('express');
const router = express.Router();
const Url = require('../model');
const geoip = require('geoip-lite');

// Helper function to generate short URLs
const generateShortUrl = () => Math.random().toString(36).substring(2, 8);

// Route to create a short URL
router.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;

  // Check if URL already exists
  let url = await Url.findOne({ originalUrl });
  if (!url) {
    // Create new short URL
    const shortUrl = generateShortUrl();
    url = new Url({ originalUrl, shortUrl, clicks: 0 }); // Ensure `clicks` is initialized
    await url.save();
  }

  res.json({ originalUrl: url.originalUrl, shortUrl: `https://pickandpartner3.onrender.com/`+url.shortUrl });
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    console.log("Accessing Short URL with ID:", id);
  
    const url = await Url.findOne({ shortUrl: id });
    if (!url) {
      console.log("No URL found for ID:", id);
      return res.status(404).json({ message: 'URL not found' });
    }
  
    // Increment click count
    url.clicks += 1;
    console.log(`Incremented click count to: ${url.clicks}`);
  
    // Save updated click count
    await url.save();
  
    // Redirect to the original URL
    res.redirect(url.originalUrl);
  });
  
  module.exports = router;
  
  
module.exports = router;
