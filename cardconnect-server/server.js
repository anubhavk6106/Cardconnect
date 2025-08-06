const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();

// --- Middleware ---
// Enable Cross-Origin Resource Sharing
app.use(cors()); 
// Allow the server to accept and parse JSON data in request bodies
app.use(express.json()); 


// --- Basic Test Route ---
// This is a simple endpoint to check if the server is running
app.get('/', (req, res) => {
  res.send('CardConnect API is running...');
});


// --- Start the Server ---
const PORT = process.env.PORT || 5001; // Use port from .env or default to 5001

app.listen(PORT, () => {
  console.log(`Server is running in on port ${PORT}`);
});