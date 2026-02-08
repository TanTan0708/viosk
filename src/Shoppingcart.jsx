function ShoppingCart({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(item.price) || 0;
            return total + (price * item.quantity);
        }, 0).toFixed(2);
    };

    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="cart-content">
                <button className="close-btn" onClick={onClose}>
                    <span className="material-symbols-outlined">close</span>
                </button>
                
                <div className="cart-header">
                    <h2 className="cart-title">Shopping Cart</h2>
                    <p className="cart-count">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
                </div>

                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <span className="material-symbols-outlined empty-cart-icon">shopping_bag</span>
                        <p>Your cart is empty</p>
                    </div>
                ) : (
                    <>
                        <div className="cart-items">
                            {cartItems.map(item => (
                                <div key={item.id} className="cart-item">
                                    <div className="cart-item-image">
                                        {item.thumbnail ? (
                                            <img 
                                                src={item.thumbnail} 
                                                alt={item.name}
                                                className="cart-thumbnail"
                                            />
                                        ) : (
                                            <div className="cart-no-image"></div>
                                        )}
                                    </div>
                                    
                                    <div className="cart-item-details">
                                        <h3 className="cart-item-name">{item.name}</h3>
                                        <p className="cart-item-price">P {item.price}</p>
                                    </div>

                                    <div className="cart-item-controls">
                                        <button 
                                            className="cart-control-btn"
                                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                        >
                                            <span className="material-symbols-outlined">remove</span>
                                        </button>
                                        <span className="cart-item-quantity">{item.quantity}</span>
                                        <button 
                                            className="cart-control-btn"
                                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                        >
                                            <span className="material-symbols-outlined">add</span>
                                        </button>
                                    </div>

                                    <button 
                                        className="cart-remove-btn"
                                        onClick={() => onRemoveItem(item.id)}
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-footer">
                            <div className="cart-total">
                                <span className="cart-total-label">Total:</span>
                                <span className="cart-total-amount">P {calculateTotal()}</span>
                            </div>
                            <button className="checkout-btn">
                                Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ShoppingCart;