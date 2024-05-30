"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import '../styles/globals.css'; // Correctly import global styles

type AnchorData = {
  domain: string;
  data: any;
};

export default function Home() {
  const [anchors, setAnchors] = useState<AnchorData[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [isDeposit, setIsDeposit] = useState(true);
  const [amount, setAmount] = useState<number>(0);
  const [currencyFrom, setCurrencyFrom] = useState<string>('USD');
  const [currencyTo, setCurrencyTo] = useState<string>('EUR');

  // Fetch anchor data from API on component mount
  useEffect(() => {
    const fetchAnchors = async () => {
      try {
        const response = await axios.get<AnchorData[]>('/api/anchors');
        setAnchors(response.data);
      } catch (error) {
        console.error('Error fetching anchor data:', error);
      }
    };
    fetchAnchors();
  }, []);

  const handleDepositWithdrawToggle = () => {
    setIsDeposit(!isDeposit);
  };

  const handleFindAnchors = () => {
    // Mock data for anchors
    const mockAnchors = [
      { name: 'Anchor 1', rating: 4.5 },
      { name: 'Anchor 2', rating: 4.0 },
      { name: 'Anchor 3', rating: 3.5 },
    ];
    setResults(mockAnchors);
  };

  return (
    <div className="bg-white text-black p-6">
      <header className="header text-center mb-4">
        <Image src="/logo.png" alt="Logo" width={150} height={150} />
        <h1 className="text-4xl text-yellow-500 font-bold">Stellar Anchors</h1>
      </header>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setIsDeposit(true)}
          className={`px-4 py-2 w-1/2 text-black rounded-l-lg ${
            isDeposit ? 'bg-yellow-600' : 'bg-yellow-400'
          } hover:bg-yellow-700 active:bg-yellow-800 transition-colors`}
        >
          Deposit
        </button>
        <button
          onClick={() => setIsDeposit(false)}
          className={`px-4 py-2 w-1/2 text-black rounded-r-lg ${
            !isDeposit ? 'bg-yellow-600' : 'bg-yellow-400'
          } hover:bg-yellow-700 active:bg-yellow-800 transition-colors`}
        >
          Withdraw
        </button>
      </div>
      <main className="main flex justify-center items-center">
        <div className="w-full p-4 bg-gray-100 rounded-lg">
          <div className="mb-4">
            <label className="block mb-2">
              Amount:
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                className="ml-2 p-2 border rounded"
              />
            </label>
            <label className="block mb-2">
              Convert from:
              <select
                value={currencyFrom}
                onChange={(e) => setCurrencyFrom(e.target.value)}
                className="ml-2 p-2 border rounded"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="JPY">JPY</option>
              </select>
            </label>
            <label className="block mb-2">
              to:
              <select
                value={currencyTo}
                onChange={(e) => setCurrencyTo(e.target.value)}
                className="ml-2 p-2 border rounded"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="JPY">JPY</option>
              </select>
            </label>
          </div>
          <div className="mb-4">
            <button
              onClick={handleFindAnchors}
              className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600 active:bg-yellow-700 transition-colors"
            >
              Find
            </button>
          </div>
          <div className="border p-4 rounded bg-white">
            <h2 className="text-2xl mb-4">Available Anchors</h2>
            <ul>
              {results.length > 0 ? (
                results.map((result, index) => (
                  <li key={index} className="mb-2">
                    {result.name} - Rating: {result.rating}
                  </li>
                ))
              ) : (
                <p>No results found.</p>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
