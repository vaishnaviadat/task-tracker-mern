const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // JSON डेटा parse करण्यासाठी
app.use('/api/tasks', require('./routes/taskRoutes'));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully!"))
    .catch((err) => console.log("Database connection error: ", err));

// Basic Route
app.get('/', (req, res) => {
    res.send("Task Tracker API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});