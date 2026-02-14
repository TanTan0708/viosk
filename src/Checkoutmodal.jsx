import { useState } from 'react';

function CheckoutModal({ isOpen, onClose, cartItems, onConfirmPayment, calculating }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && !processing) {
            onClose();
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(item.price) || 0;
            return total + (price * item.quantity);
        }, 0).toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setProcessing(true);

        try {
            const result = await onConfirmPayment(password);
            if (!result.success) {
                setError(result.error || 'Invalid password');
                setProcessing(false);
            }
            // If successful, the parent component will handle closing the modal
        } catch (err) {
            setError('An error occurred. Please try again.');
            setProcessing(false);
        }
    };

    const handleClose = () => {
        if (!processing) {
            setPassword('');
            setError('');
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="checkout-modal-content">
                <button 
                    className="close-btn" 
                    onClick={handleClose}
                    disabled={processing}
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
                
                <div className="checkout-modal-header">
                    <h2 className="checkout-modal-title">Confirm Payment</h2>
                </div>

                <div className="checkout-summary">
                    <div className="checkout-items-count">
                        {cartItems.reduce((total, item) => total + item.quantity, 0)} items
                    </div>
                    <div className="checkout-total">
                        <span className="checkout-total-label">Total Amount:</span>
                        <span className="checkout-total-amount">P {calculateTotal()}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="checkout-form">
                    <div className="checkout-input-group">
                        <label htmlFor="payment-password" className="checkout-label">
                            Enter Business Password
                        </label>
                        <input
                            id="payment-password"
                            type="password"
                            className="checkout-password-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            disabled={processing}
                            autoFocus
                            required
                        />
                    </div>

                    {error && (
                        <div className="checkout-error">
                            <span className="material-symbols-outlined">error</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="checkout-confirm-btn"
                        disabled={processing || !password}
                    >
                        {processing ? (
                            <>
                                <span className="checkout-spinner"></span>
                                <span>Processing...</span>
                            </>
                        ) : (
                            'Confirm Payment'
                        )}
                    </button>
                </form>

                <p className="checkout-note">
                    Please enter the business password to confirm this payment.
                </p>
            </div>
        </div>
    );
}

export default CheckoutModal;