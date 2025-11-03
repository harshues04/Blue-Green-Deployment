const express = require('express');
const app = express();

// Get port from environment variable or default to 3000
const port = process.env.PORT || 3000;

// Health check route
app.get('/health', (req, res) => {
  res.send('OK');
});

// Root route
app.get('/', (req, res) => {
  res.send(`🚀 new Node.js Blue-Green App running on port ${port}`);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
