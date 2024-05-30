"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [amount, setAmount] = useState<string>('');
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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleFindClick();
    }
  };

  const isDepositSelected = type === 'deposit';
  const isWithdrawSelected = type === 'withdraw';

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80">
        <div className="flex mb-4">
          <button
            onClick={() => setType('deposit')}
            className={`flex-1 py-2 rounded-l-lg ${
              isDepositSelected ? 'bg-yellow-400 opacity-75' : 'bg-yellow-400 opacity-100 hover:opacity-75'
            } text-black font-semibold`}
            onMouseEnter={() => {
              if (isWithdrawSelected) setType('');
            }}
            onMouseLeave={() => {
              if (isWithdrawSelected) setType('withdraw');
            }}
          >
            Deposit
          </button>
          <button
            onClick={() => setType('withdraw')}
            className={`flex-1 py-2 rounded-r-lg ${
              isWithdrawSelected ? 'bg-yellow-400 opacity-75' : 'bg-yellow-400 opacity-100 hover:opacity-75'
            } text-black font-semibold`}
            onMouseEnter={() => {
              if (isDepositSelected) setType('');
            }}
            onMouseLeave={() => {
              if (isDepositSelected) setType('deposit');
            }}
          >
            Withdraw
          </button>
        </div>
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={handleAmountChange}
          onKeyDown={handleKeyDown}
          className="w-full p-2 mb-3 border border-gray-300 rounded-md text-black"
        />
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full p-2 mb-3 border border-gray-300 rounded-md text-black"
        >
          <option value="US">US</option>
          <option value="CA">CA</option>
          {/* Add more countries as needed */}
        </select>
        <select
          value={coin}
          onChange={(e) => setCoin(e.target.value)}
          className="w-full p-2 mb-3 border border-gray-300 rounded-md text-black"
        >
          {coinList.map((coin, index) => (
            <option key={index} value={coin}>
              {coin}
            </option>
          ))}
        </select>
        <button
          onClick={handleFindClick}
          className="w-full py-2 mb-4 bg-yellow-400 text-black rounded-md font-semibold hover:opacity-75 active:opacity-75"
        >
          Find
        </button>
        <div>
          <h2 className="text-white text-xl font-bold mb-2">Response from API</h2>
          {response ? (
            <div>
              {response.map((res: any, index: number) => (
                <div key={index} className="border border-gray-500 p-3 rounded-md mb-2 text-white">
                  <p><strong>Coin:</strong> {res.coin}</p>
                  <p><strong>Fee Fixed:</strong> {res.fee_fixed}</p>
                  <p><strong>Source:</strong> {res.source}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white">No response yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
