const axios = require('axios');

const apis = [
  'https://stellar-anchor.payfura.com/sep24/info',
  'https://transfer-server.zetl.network/info',
  'https://connect.clickpesa.com/sep24/info',
  'https://api.anclap.com/transfer24/info'
];

// Function to fetch data from an API
const fetchApiData = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error.message);
    return null;
  }
};

// Function to aggregate results for a specific coin and find the best one based on the lowest fixed fee
const aggregateResults = (data, coin, type) => {
  let bestResult = null;

  if (type == 'deposit') {
    data.forEach((apiData) => {
      console.log(apiData)
      if (apiData && apiData.deposit && apiData.deposit[coin]) {
        const coinData = apiData.deposit[coin];

        if (
          coinData.enabled &&
          (!bestResult || (coinData.fee_fixed && coinData.fee_fixed < bestResult.fee_fixed))
        ) {
          bestResult = { coin, ...coinData };
        }
      }

    });
  } else if (type == 'withdraw') {
    data.forEach((apiData) => {
      console.log(apiData)
      if (apiData && apiData.withdraw && apiData.withdraw[coin]) {
        const coinData = apiData.withdraw[coin];

        if (
          
          (!bestResult || (coinData.fee_fixed && coinData.fee_fixed < bestResult.fee_fixed))
        ) {
          bestResult = { coin, ...coinData };
        }
      }
    })
  }

  return bestResult;
  };

  const main = async () => {
    const coin = process.argv[2];
    if (!coin) {
      console.error('Please provide a coin as an argument');
      process.exit(1);
    }
    const type = process.argv[3];
    

    const apiPromises = apis.map((api) => fetchApiData(api));
    const apiData = await Promise.all(apiPromises);

    const bestResult = aggregateResults(apiData, coin.toUpperCase(), type);

    if (bestResult) {
      console.log('Best Result:', bestResult);
    } else {
      console.log(`No suitable result found for coin: ${coin}`);
    }
  };

  main();
