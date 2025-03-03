const express = require('express');
const knex = require('knex');
const { Model } = require('objection');
const knexConfig = require('./knexfile');
const cors = require("cors");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Knex and Objection
const db = knex(knexConfig.development);
Model.knex(db);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(cors());

// Import Routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Node.js API is running...');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
