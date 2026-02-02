function ProductModal({ product, onClose }) {
    if (!product) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>
                    <span className="material-symbols-outlined">close</span>
                </button>
                
                <div className="modal-header">
                    <h2 className="modal-title">{product.name}</h2>
                    <p className="modal-price">P {product.price}</p>
                </div>

                <div className="modal-tags">
                    <ul>
                        <li>16 inches</li>
                        <li>for motor cycle</li>
                        <li>phone linging</li>
                        <li>rice bowl</li>
                    </ul>
                </div>

                <div className="modal-images">
                    <div className="modal-image-placeholder"></div>
                    <div className="modal-image-placeholder"></div>
                </div>
            </div>
        </div>
    );
}

export default ProductModal;