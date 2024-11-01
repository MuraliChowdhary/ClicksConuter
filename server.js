// server.js
const express = require('express');
const mongoose = require('mongoose');
const urlRoutes = require('./routes/url');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019/shorturl?replicaSet=rs0')
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error(err));

app.use('/', urlRoutes);

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
