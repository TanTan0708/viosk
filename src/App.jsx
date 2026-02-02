import { useState, useEffect } from "react";
import Header from "./Header";
import ProductModal from "./ProductModal";

function App() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Google Sheets Configuration
    // These values come from environment variables
    const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
    const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
    const SHEET_NAME = import.meta.env.VITE_SHEET_NAME || 'Sheet1';
    const RANGE = 'A2:F';

    useEffect(() => {
        fetchProductsFromSheet();
    }, []);

    const fetchProductsFromSheet = async () => {
        try {
            // Check if required env variables are set
            if (!SHEET_ID || !API_KEY) {
                throw new Error('Missing environment variables. Please check your .env file or Vercel environment variables.');
            }

            // Build the API URL
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!${RANGE}?key=${API_KEY}`;
            
            console.log('Fetching products from Google Sheets...');
            console.log('Sheet ID:', SHEET_ID ? 'Set ✓' : 'NOT SET ✗');
            console.log('API Key:', API_KEY ? 'Set ✓' : 'NOT SET ✗');
            console.log('Sheet Name:', SHEET_NAME);
            
            const response = await fetch(url);
            
            console.log('Response status:', response.status);
            
            // Try to get the response text to see the actual error
            const responseText = await response.text();
            
            if (!response.ok) {
                // Try to parse as JSON to get the error message
                try {
                    const errorData = JSON.parse(responseText);
                    const errorMessage = errorData.error?.message || 'Unknown error';
                    throw new Error(`Google Sheets API Error: ${errorMessage}`);
                } catch (parseError) {
                    throw new Error(`Failed to fetch data (Status: ${response.status}). Check console for details.`);
                }
            }
            
            const data = JSON.parse(responseText);
            console.log('Successfully fetched', data.values?.length || 0, 'products');
            
            // Check if we have values
            if (!data.values || data.values.length === 0) {
                throw new Error('No data found in the sheet. Make sure you have products starting from row 2.');
            }
            
            // Transform sheet data into product objects
            const productsData = data.values.map((row, index) => ({
                id: index + 1,
                name: row[0] || '',
                thumbnail: row[1] || '',
                tags: row[2] ? row[2].split(',').map(tag => tag.trim()).filter(tag => tag) : [],
                price: row[3] || '0.00',
                extraPicture1: row[4] || '',
                extraPicture2: row[5] || ''
            }));
            
            setProducts(productsData);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const handleCardClick = (product) => {
        setSelectedProduct(product);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
    };

    const handleAddClick = (e, product) => {
        e.stopPropagation();
        console.log("Add clicked for:", product.name);
        // Your add to cart logic here
    };

    if (loading) {
        return (
            <>
                <Header />
                <main className="main-content">
                    <div className="loading">Loading products...</div>
                </main>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <main className="main-content">
                    <div className="error-message">
                        <h3>⚠️ Error Loading Products</h3>
                        <p><strong>Error:</strong> {error}</p>
                        <div className="error-instructions">
                            <h4>Common Issues:</h4>
                            <ol>
                                <li><strong>Missing environment variables:</strong> Make sure VITE_GOOGLE_SHEET_ID and VITE_GOOGLE_API_KEY are set</li>
                                <li><strong>Sheet not public:</strong> Make sure your Google Sheet is shared as "Anyone with the link can view"</li>
                                <li><strong>Wrong Sheet ID:</strong> Check that SHEET_ID is correct (from the URL between /d/ and /edit)</li>
                                <li><strong>API Key issues:</strong> Verify your API key is correct and Google Sheets API is enabled</li>
                                <li><strong>Wrong sheet name:</strong> Make sure SHEET_NAME matches your tab name (default is "Sheet1")</li>
                            </ol>
                            <p><strong>Check the browser console (F12) for detailed error information.</strong></p>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="main-content">
                <div className="section-header">
                    <div className="section-title">
                        <h2>Explore</h2>
                        <h2>Items</h2>
                    </div>
                    <button className="filter-btn">
                        <span>Filter</span>
                        <span className="material-symbols-outlined">filter_alt</span>
                    </button>
                </div>
                
                <div className="product-grid">
                    {products.map(product => (
                        <div 
                            key={product.id} 
                            className="product-card"
                            onClick={() => handleCardClick(product)}
                        >
                            <div className="product-image">
                                {product.thumbnail ? (
                                    <img 
                                        src={product.thumbnail} 
                                        alt={product.name}
                                        className="product-thumbnail"
                                    />
                                ) : (
                                    <div className="no-image"></div>
                                )}
                                <span className="material-symbols-outlined info-icon">info</span>
                                <button 
                                    className="add-btn"
                                    onClick={(e) => handleAddClick(e, product)}
                                >
                                    <span className="material-symbols-outlined">add</span>
                                </button>
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-price">P {product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            
            <ProductModal 
                product={selectedProduct} 
                onClose={handleCloseModal}
            />
        </>
    );
}

export default App;