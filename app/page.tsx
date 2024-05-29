"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import '../styles/style.css'; // Ensure this path is correct and the CSS file exists

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
    <div className="container">
      <header className="header">
        <Image src="/logo.png" alt="Logo" width={150} height={150} />
        <h1 className="title">Stellar Anchors</h1>
      </header>
      <main className="main">
        <div className="search">
          <label>
            Select Coin:
            <input
              type="text"
              value={selectedCoin}
              onChange={(e) => setSelectedCoin(e.target.value.toUpperCase())}
              className="input"
            />
          </label>
          <button onClick={handleSearch} className="button">Search</button>
        </div>
        <div className="results">
          {results.length > 0 ? (
            results.map((result, index) => (
              <div key={index} className="resultCard">
                <h2>{result.domain}</h2>
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
