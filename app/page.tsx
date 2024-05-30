"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [id, setId] = useState<string>('');
  const [country, setCountry] = useState<string>('US');
  const [coin, setCoin] = useState<string>('');
  const [type, setType] = useState<string>('deposit');
  const [response, setResponse] = useState<any>(null);
  const [coinList, setCoinList] = useState<string[]>([]);

  useEffect(() => {
    const getCoins = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/all_coins_list');
        setCoinList(res.data);
        setCoin(res.data[0]); // Set the first coin as the default selected value
      } catch (error) {
        console.error('Error fetching coins:', error);
      }
    };

    getCoins();
  }, []);

  const handleFindClick = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/aggregate', {
        params: {
          coin,
          type
        }
      });
      setResponse(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Stellar Anchor</h1>
      <div style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          >
            <option value="US">US</option>
            <option value="CA">CA</option>
            {/* Add more countries as needed */}
          </select>
          <select
            value={coin}
            onChange={(e) => setCoin(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          >
            {coinList.map((coin, index) => (
              <option key={index} value={coin}>
                {coin}
              </option>
            ))}
          </select>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <button
              onClick={() => setType('deposit')}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: type === 'deposit' ? 'blue' : 'gray',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Deposit
            </button>
            <button
              onClick={() => setType('withdraw')}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: type === 'withdraw' ? 'blue' : 'gray',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Withdraw
            </button>
          </div>
          <button
            onClick={handleFindClick}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: 'green',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Find
          </button>
        </div>
        <div>
          <h2>Response from API</h2>
          {response ? (
            <div>
              {response.map((res: any, index: number) => (
                <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                  <p><strong>Coin:</strong> {res.coin}</p>
                  <p><strong>Fee Fixed:</strong> {res.fee_fixed}</p>
                  <p><strong>Source:</strong> {res.source}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No response yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
