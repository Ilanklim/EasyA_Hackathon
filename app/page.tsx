"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [amount, setAmount] = useState<string>('');
  const [country, setCountry] = useState<string>('US');
  const [coin, setCoin] = useState<string>('');
  const [type, setType] = useState<string>('deposit');
  const [coinList, setCoinList] = useState<string[]>([]);
  const [anchors, setAnchors] = useState<any[]>([]);
  const [showAnchors, setShowAnchors] = useState<boolean>(false);
  const [countryList, setCountryList] = useState<string[]>([]);

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
    const getCountries = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/countries_list');
        setCountryList(res.data);
        setCountry(res.data[0]); // Set the first country as the default selected value
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    getCountries();
    getCoins();
  }, []);

  const handleFindClick = async () => {
    try {
      const anchor_result = await axios.get('http://localhost:3001/api/aggregate', {
        params: {
          amount,
          coin,
          type,
          country
        }
      });
      setAnchors(anchor_result.data);
      setShowAnchors(true);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className={`flex space-x-4 ${showAnchors ? 'transform transition-transform duration-500' : ''}`}>
        <div className={`bg-gray-800 p-6 rounded-lg shadow-lg w-96 h-auto transition-all duration-500`}>
          <h1 className="text-2xl font-bold text-center mb-6" style={{ background: 'linear-gradient(to right, #fcd34d, #b45309)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            Stanchor
          </h1>
          <div className="flex mb-4">
            <button
              onClick={() => setType('deposit')}
              className={`flex-1 py-2 rounded-l-lg ${type === 'deposit' ? 'bg-yellow-400 opacity-75' : 'bg-yellow-400 opacity-100 hover:opacity-75'} text-black font-semibold active:opacity-75`}
            >
              Deposit
            </button>
            <button
              onClick={() => setType('withdraw')}
              className={`flex-1 py-2 rounded-r-lg ${type === 'withdraw' ? 'bg-yellow-400 opacity-75' : 'bg-yellow-400 opacity-100 hover:opacity-75'} text-black font-semibold active:opacity-75`}
            >
              Withdraw
            </button>
          </div>
          <label className="block text-white mb-2">Amount</label>
          <input
            type="text"
            placeholder="Amount"
            value={amount}
            onChange={handleAmountChange}
            onKeyDown={handleKeyDown}
            className="w-full p-2 mb-3 border border-gray-300 rounded-md text-black"
          />
          <label className="block text-white mb-2">From</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full p-2 mb-3 border border-gray-300 rounded-md text-black"
          >
            {countryList.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
          <label className="block text-white mb-2">To</label>
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
            className="w-full py-2 bg-yellow-400 text-black rounded-md font-semibold hover:opacity-75 active:opacity-75 relative"
          >
            Find
          </button>
        </div>
        {showAnchors && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 h-auto transition-opacity duration-500">
            <h2
              className="text-xl font-bold mb-4 text-center"
              style={{ background: 'linear-gradient(to right, #fcd34d, #b45309)', WebkitBackgroundClip: 'text', color: 'transparent' }}
            >
              Available Anchors
            </h2>
            {anchors.length ? (
              anchors.slice(0, 3).map((anchor, index) => (
                <div key={index} className="border border-gray-500 p-3 rounded-md mb-2 text-white">
                  <p><strong>Name:</strong> {anchor.name}</p>
                  <p><strong>Fee:</strong> {anchor.fee}</p>
                  <p><strong>Availability:</strong> {anchor.availability}</p>
                </div>
              ))
            ) : (
              <p className="text-white text-center">No anchors available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
