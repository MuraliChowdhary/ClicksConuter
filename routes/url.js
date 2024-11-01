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
  
    // Retrieve user's IP and lookup geo data
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let geo = geoip.lookup(ip);
  
    // If geo data is unavailable, log and use default data
    if (!geo) {
      geo = { region: "Local", ll: [0, 0] };
      console.log("Geo lookup result: null - Using default geo data for local testing:", geo);
    } else {
      console.log("Geo lookup successful. Region:", geo.region, "Coordinates:", geo.ll);
    }
  
    const { region, ll: [latitude, longitude] } = geo;
  
    // Determine if the click is unique
    const isUniqueClick = !url.clickData.some(
      (click) => click.region === region && click.latitude === latitude && click.longitude === longitude
    );
  
    // Increment clicks if unique
    if (isUniqueClick) {
      url.clicks += 1;
      console.log(`Unique click detected. Incremented click count to: ${url.clicks}`);
    } else {
      console.log("Repeat click detected for region:", region);
    }
  
    // Log and save click data
    url.clickData.push({ region, latitude, longitude });
    await url.save();
  
    // Redirect to the original URL
    res.redirect(url.originalUrl);
  });
  
module.exports = router;
