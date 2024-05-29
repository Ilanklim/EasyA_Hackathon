const express = require('express');
const axios = require('axios');
const app = express();
const port = 3001;

// List of anchor domains
const anchorDomains = [
  'https://stellar-anchor.payfura.com/sep24/info',
  'https://transfer-server.zetl.network/info',
  'https://connect.clickpesa.com/sep24/info',
  'https://api.anclap.com/transfer24/info'
  // Add more anchors as needed
];

// Fetch stellar.toml files from the given anchor domains
app.get('/api/anchors', async (req, res) => {
  try {
    const anchorDataPromises = anchorDomains.map(async domain => {
      const url = `https://${domain}`;
      const response = await axios.get(url);
      return { domain, data: response.data };
    });

    const anchorData = await Promise.all(anchorDataPromises);
    res.json(anchorData);
  } catch (error) {
    console.error('Error fetching anchor data:', error);
    res.status(500).json({ error: 'Failed to fetch anchor data' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});