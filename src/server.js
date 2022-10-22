require('dotenv').config();
const express = require('express');
const app = express(), morgan = require('morgan');
const mongoose = require('mongoose'), cors = require('cors');
const { Port, Mongourl } = process.env;

// Connect to MongoDB
mongoose.connect(Mongourl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));
app.use(cors());

// Routes
app.use('/api/seller', require('../routers/SellerRouter.js'));
app.use('/api/buyer', require('../routers/BuyerRouter.js'));
app.use("/api/order", require("../routers/OrderRouter.js"));

app.listen(Port, () => console.log(`Server is running on port ${Port}`));