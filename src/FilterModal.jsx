import { useState, useEffect } from 'react';

function FilterModal({ isOpen, onClose, onApplyFilters, allTags, currentFilters }) {
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        if (currentFilters) {
            setPriceMin(currentFilters.priceMin || '');
            setPriceMax(currentFilters.priceMax || '');
            setSelectedTags(currentFilters.tags || []);
        }
    }, [currentFilters, isOpen]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleTagToggle = (tag) => {
        setSelectedTags(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const handleApply = () => {
        onApplyFilters({
            priceMin: priceMin ? parseFloat(priceMin) : null,
            priceMax: priceMax ? parseFloat(priceMax) : null,
            tags: selectedTags
        });
        onClose();
    };

    const handleClear = () => {
        setPriceMin('');
        setPriceMax('');
        setSelectedTags([]);
        onApplyFilters({
            priceMin: null,
            priceMax: null,
            tags: []
        });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="filter-modal-content">
                <button className="close-btn" onClick={onClose}>
                    <span className="material-symbols-outlined">close</span>
                </button>
                
                <div className="filter-modal-header">
                    <h2 className="filter-modal-title">Filter Products</h2>
                </div>

                <div className="filter-section">
                    <h3 className="filter-section-title">Price Range</h3>
                    <div className="price-inputs">
                        <div className="price-input-group">
                            <label htmlFor="price-min" className="price-label">Min</label>
                            <div className="price-input-wrapper">
                                <span className="price-currency">P</span>
                                <input
                                    id="price-min"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="price-input"
                                    value={priceMin}
                                    onChange={(e) => setPriceMin(e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <span className="price-separator">-</span>
                        <div className="price-input-group">
                            <label htmlFor="price-max" className="price-label">Max</label>
                            <div className="price-input-wrapper">
                                <span className="price-currency">P</span>
                                <input
                                    id="price-max"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="price-input"
                                    value={priceMax}
                                    onChange={(e) => setPriceMax(e.target.value)}
                                    placeholder="999.99"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {allTags.length > 0 && (
                    <div className="filter-section">
                        <h3 className="filter-section-title">Tags</h3>
                        <div className="tags-container">
                            {allTags.map(tag => (
                                <button
                                    key={tag}
                                    className={`tag-btn ${selectedTags.includes(tag) ? 'tag-btn-active' : ''}`}
                                    onClick={() => handleTagToggle(tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="filter-actions">
                    <button className="filter-clear-btn" onClick={handleClear}>
                        Clear All
                    </button>
                    <button className="filter-apply-btn" onClick={handleApply}>
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FilterModal;