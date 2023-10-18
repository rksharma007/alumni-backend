const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const cors = require('cors')
app.use(cors())

// Connect Database
connectDB();

//Init Middleware
app.use(express.json({extended : false}));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res) => res.send('API running'));

// Define Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/join', require('./routes/api/join'));
app.use('/api/events', require('./routes/api/events'));
app.use('/api/news', require('./routes/api/news'));

// Define static assets in production
const PORT = process.env.PORT || 8081;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));