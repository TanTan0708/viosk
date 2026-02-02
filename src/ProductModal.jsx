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

                {product.tags && product.tags.length > 0 && (
                    <div className="modal-tags">
                        <ul>
                            {product.tags.map((tag, index) => (
                                <li key={index}>{tag}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="modal-images">
                    {product.extraPicture1 && (
                        <div className="modal-image-container">
                            <img 
                                src={product.extraPicture1} 
                                alt={`${product.name} - Image 1`}
                                className="modal-image"
                            />
                        </div>
                    )}
                    {product.extraPicture2 && (
                        <div className="modal-image-container">
                            <img 
                                src={product.extraPicture2} 
                                alt={`${product.name} - Image 2`}
                                className="modal-image"
                            />
                        </div>
                    )}
                    {!product.extraPicture1 && !product.extraPicture2 && (
                        <>
                            <div className="modal-image-placeholder"></div>
                            <div className="modal-image-placeholder"></div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductModal;