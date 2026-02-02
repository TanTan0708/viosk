import { useState } from "react";
import Header from "./Header";
import ProductModal from "./ProductModal";

function App() {
    const [selectedProduct, setSelectedProduct] = useState(null);

    const products = [
        { id: 1, name: "Suzuki Motor Wheels", price: "5,000.00" },
        { id: 2, name: "Honda Car Wheels", price: "20,000.00" },
        { id: 3, name: "Razer Black Top Bili Eilish", price: "40,000.67" },
        { id: 4, name: "Logitech Wheels", price: "6,000.00" },
        { id: 5, name: "Prime Wheels", price: "12,500.00" },
        { id: 6, name: "Reaver Wheels", price: "15,200.00" }
    ];

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