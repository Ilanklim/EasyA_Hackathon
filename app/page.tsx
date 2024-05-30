"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import '../styles/style.css'; // Updated to match the existing file

type AnchorData = {
  domain: string;
  data: any;
};

export default function Home() {
  const [anchors, setAnchors] = useState<AnchorData[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);

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

  const handleSearch = () => {
    const filteredResults = anchors.flatMap(anchor => {
      const { domain, data } = anchor;
      if (data.deposit && data.deposit[selectedCoin]) {
        return {
          domain,
          ...data.deposit[selectedCoin],
        };
      }
      return [];
    });
    setResults(filteredResults);
  };

  return (
    <div className="container mx-auto p-4">
      <header className="header text-center mb-4">
        <Image src="/logo.png" alt="Logo" width={150} height={150} />
        <h1 className="text-4xl font-bold">Stellar Anchors</h1>
      </header>
      <main className="main">
        <div className="search flex justify-center items-center mb-4">
          <label className="mr-2">
            Select Coin:
            <input
              type="text"
              value={selectedCoin}
              onChange={(e) => setSelectedCoin(e.target.value.toUpperCase())}
              className="input border p-2"
            />
          </label>
          <button onClick={handleSearch} className="button bg-blue-500 text-white p-2 ml-2">Search</button>
        </div>
        <div className="results">
          {results.length > 0 ? (
            results.map((result, index) => (
              <div key={index} className="resultCard border p-4 mb-4">
                <h2 className="text-2xl font-bold">{result.domain}</h2>
                <p>Min Amount: {result.min_amount}</p>
                <p>Max Amount: {result.max_amount}</p>
                <p>Fixed Fee: {result.fee_fixed}</p>
                <p>Percent Fee: {result.fee_percent}</p>
              </div>
            ))
          ) : (
            <p>No results found. Please enter a valid coin code.</p>
          )}
        </div>
      </main>
    </div>
  );
}
