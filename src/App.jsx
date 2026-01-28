import React, { useState } from 'react';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const products = [
    { id: 1, name: 'Suzuki Motor Wheels', price: '₱ 5,000.00' },
    { id: 2, name: 'Honda Car Wheels', price: '₱ 20,000.00' },
    { id: 3, name: 'Razer Black Top Bill Eilish', price: '₱ 40,000.67' },
    { id: 4, name: 'Logitech Wheels', price: '₱ 6,000.00' },
    { id: 5, name: 'Prime Wheels', price: '' },
    { id: 6, name: 'Reaver Wheels', price: '' },
  ];

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo-placeholder">
          <div className="logo-icon"></div>
        </div>
        <button className="cart-button">
          <div className="cart-icon"></div>
        </button>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">Welcome to, Gensan Automotive Parts</h1>
        
        <div className="search-bar">
          <div className="search-icon"></div>
          <input
            type="text"
            placeholder="Searching for something?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="section-header">
          <h2 className="section-title">Explore<br />Items</h2>
          <button className="filter-button">
            Filter
            <span className="filter-icon">⚙</span>
          </button>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <button className="info-button">i</button>
              <div className="product-image-placeholder"></div>
              <button className="add-button">+</button>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                {product.price && <p className="product-price">{product.price}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;