import { useState, useEffect } from "react";
import Header from "./Header";
import ProductModal from "./ProductModal";
import ShoppingCart from "./ShoppingCart";
import CheckoutModal from "./CheckoutModal";

function App() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // Google Sheets Configuration
    // These values come from environment variables
    const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
    const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
    const SHEET_NAME = import.meta.env.VITE_SHEET_NAME || 'Sheet2';
    const RANGE = 'A2:G';
    
    // Business Password Configuration
    // Set this in your .env file as VITE_BUSINESS_PASSWORD
    const BUSINESS_PASSWORD = import.meta.env.VITE_BUSINESS_PASSWORD || 'default123';

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
                extraPicture2: row[5] || '',
                title: row[6] || ''
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
        
        // Check if product is already in cart
        const existingItem = cartItems.find(item => item.id === product.id);
        
        if (existingItem) {
            // Increase quantity
            setCartItems(cartItems.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            // Add new item to cart
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }
    };

    const handleUpdateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            handleRemoveItem(productId);
        } else {
            setCartItems(cartItems.map(item =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            ));
        }
    };

    const handleRemoveItem = (productId) => {
        setCartItems(cartItems.filter(item => item.id !== productId));
    };

    const handleToggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const handleCheckout = () => {
        if (cartItems.length > 0) {
            setIsCheckoutOpen(true);
        }
    };

    const handleConfirmPayment = async (password) => {
        // Verify password
        if (password !== BUSINESS_PASSWORD) {
            return { success: false, error: 'Invalid password' };
        }

        try {
            // Generate order data
            const orderId = `ORD-${Date.now()}`;
            const now = new Date();
            const date = now.toLocaleDateString('en-US');
            const time = now.toLocaleTimeString('en-US', { hour12: false });
            
            // Format order items
            const orderItems = cartItems.map(item => 
                `${item.name} (x${item.quantity})`
            ).join(', ');
            
            const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
            const subtotal = cartItems.reduce((total, item) => {
                const price = parseFloat(item.price) || 0;
                return total + (price * item.quantity);
            }, 0);
            const totalAmount = subtotal; // You can add tax or fees here if needed
            
            // Prepare order data
            const orderData = {
                orderId: orderId,
                date: date,
                time: time,
                order: orderItems,
                totalQuantity: totalQuantity,
                subtotal: subtotal.toFixed(2),
                totalAmount: totalAmount.toFixed(2),
                paymentMethod: 'Cash',      // You can make this dynamic
                paymentStatus: 'Paid',
                customerType: 'Walk-in'     // You can make this dynamic
            };

            // Get the Google Apps Script Web App URL from environment variable
            const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
            
            if (!SCRIPT_URL) {
                console.error('VITE_GOOGLE_SCRIPT_URL not configured');
                throw new Error('Sheet integration not configured. Please contact support.');
            }

            // Send order data to Google Apps Script
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (!result.success) {
                console.error('Failed to save order:', result.error);
                throw new Error(result.error || 'Failed to save order to sheet');
            }

            console.log('Order saved successfully:', orderId);
            
            // Clear cart and close modals
            setCartItems([]);
            setIsCheckoutOpen(false);
            setIsCartOpen(false);
            
            // Show success message (you can replace this with a proper notification)
            alert(`Order confirmed! Order ID: ${orderId}`);
            
            return { success: true };
        } catch (err) {
            console.error('Error processing payment:', err);
            return { success: false, error: err.message || 'Failed to process payment. Please try again.' };
        }
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
            <Header 
                siteTitle={products[0]?.title || "Default Title"} 
                onCartClick={handleToggleCart}
                cartCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
            />
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

            <ShoppingCart 
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onCheckout={handleCheckout}
            />

            <CheckoutModal 
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cartItems={cartItems}
                onConfirmPayment={handleConfirmPayment}
            />
        </>
    );
}

export default App;