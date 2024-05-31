const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());

const apis = [
  {
    url: 'https://stellar-anchor.payfura.com/sep24/info', name: 'Payfura', countries: [
      "Brazil",
      "Chile",
      "Colombia",
      "Ghana",
      "Indonesia",
      "Malaysia",
      "Mexico",
      "Nigeria",
      "Peru",
      "Philippines",
      "Singapore",
      "Thailand",
      "United States"
    ]
  },
  { url: 'https://transfer-server.zetl.network/info', name: 'Latamex', countries: ["Argentina", "Brazil", "United States"] },
  { url: 'https://connect.clickpesa.com/sep24/info', name: 'ClickPesa', countries: ["Kenya", "Tanzania", "Rwanda"] },
  { url: 'https://api.anclap.com/transfer24/info', name: 'Anclap', countries: ["Argentina", "Chile", "Colombia", "Peru", "Mexico", "United States"] }
];

// Function to fetch data from an API
const fetchApiData = async (api) => {
  try {
    const response = await axios.get(api.url);
    return { data: response.data, name: api.name };
  } catch (error) {
    console.error(`Error fetching data from ${api.url}:`, error.message);
    return null;
  }
};

// Function to extract unique coins from the deposit sections
const fetch_coins = (data) => {
  const coinSet = new Set();

  data.forEach((apiData) => {
    console.log(apiData)
    if (apiData && apiData.data && apiData.data.deposit) {
      const depositCoins = Object.keys(apiData.data.deposit);
      depositCoins.forEach((coin) => {
        if (apiData.data.deposit[coin].enabled) {
          coinSet.add(coin);
        }
      });
    }
  });

  return Array.from(coinSet).sort();
};

// Function to aggregate results for a specific coin and type (deposit or withdraw)
const aggregateResults = (data, value, coin, type, country) => {
  let results = [];
  console.log(data)

  data.forEach((apiData) => {
    console.log(apiData)
    // if (apiData.countries.includes(country)) {

    // For type = deposits
    if (type === 'deposit' && apiData && apiData.data.deposit && apiData.data.deposit[coin]) {
      const coinData = apiData.data.deposit[coin];
      results.push({ coin, ...coinData, source: apiData.name, countries: apiData.countries });
    } // For type = withdraw
    else if (type === 'withdraw' && apiData && apiData.data.withdraw && apiData.data.withdraw[coin]) {
      const coinData = apiData.data.withdraw[coin];
      results.push({ coin, ...coinData, source: apiData.name, countries: apiData.countries });
    }
    // } else {
    //   results.push({ msg: "No Anchor Found" });
    // }
  });



  // Sort results by fee_fixed in ascending order
  results.sort((a, b) => a.fee_fixed - b.fee_fixed);

  return results;
};

// API to get the list of all coins supported by Anchors
app.get('/api/all_coins_list', async (req, res) => {
  const apiPromises = apis.map((api) => fetchApiData(api));
  const apiData = await Promise.all(apiPromises);

  const allCoins = fetch_coins(apiData);

  if (allCoins.length > 0) {
    res.json(allCoins);
  } else {
    res.status(404).json({ error: 'No coins found.' });
  }
});

// API to get the list of all coins and countries supported by Anchors
app.get('/api/countries_list', async (req, res) => {
  const apiPromises = apis.map((api) => fetchApiData(api));
  const apiData = await Promise.all(apiPromises);

  const allCountries = [...new Set(apis.flatMap(api => api.countries))]; // Aggregate unique countries

  if (allCountries.length > 0) {
    res.json(allCountries);
  } else {
    res.status(404).json({ error: 'No country found.' });
  }
});


// API to get the aggregate result
app.get('/api/aggregate', async (req, res) => {
  const { value, coin, type, country } = req.query;
  if (!coin || !type ) {
    return res.status(400).json({ error: 'Please provide both coin and type as query parameters' });
  }

  const apiPromises = apis.map((api) => fetchApiData(api));
  const apiData = await Promise.all(apiPromises);

  // Result an array of Anchor Objects 
  const aggregatedResults = aggregateResults(apiData,value, coin.toUpperCase(), type, country);

  if (aggregatedResults.length > 0) {
    res.json(aggregatedResults);
  } else {
    res.status(404).json({ error: `No suitable result found for coin: ${coin}` });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
