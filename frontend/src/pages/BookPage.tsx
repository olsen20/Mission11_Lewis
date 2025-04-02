import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CartItem } from "../types/CartItem";
import CartSummary from "./CartSummary";

function BookPage() {
    const navigate = useNavigate();
    const { bookID, title, price } = useParams();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState<number>(0);
    const [showModal, setShowModal] = useState<boolean>(false);

    const handleAddToCart = () => {
        const newItem: CartItem = {
            bookID: Number(bookID),
            title: title || 'No Book Found',
            price: Number(price),
            quantity: Number(quantity),
        };
        addToCart(newItem);
        setShowModal(true); // show confirmation modal
    };

    const handleCloseModal = () => {
        setShowModal(false);
        navigate('/cart');
    };

    return (
        <div className="container mt-4">
            <CartSummary />
            <div className="row justify-content-center">
                <div className="col-12 col-md-12">
                    <div className="card shadow-sm p-4">
                        <h2 className="card-title mb-3">Buy {title}</h2>
                        <p><strong>Price:</strong> ${price}</p>
                        <div className="mb-3">
                            <label htmlFor="quantity" className="form-label">Quantity</label>
                            <input
                                type="number"
                                id="quantity"
                                className="form-control"
                                placeholder="Enter quantity"
                                value={quantity}
                                onChange={(x) => setQuantity(Number(x.target.value))}
                                min={1}
                            />
                        </div>
                        <button className="btn btn-success w-100" onClick={handleAddToCart}>
                            Buy Book
                        </button>
                        <button className="btn btn-secondary mt-2 w-100" onClick={() => navigate(-1)}>
                            Go Back
                        </button>
                    </div>
                </div>
            </div>

            {/* Bootstrap Modal */}
            {showModal && (
                <div className="modal show fade d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Added to Cart</h5>
                            </div>
                            <div className="modal-body">
                                <p><strong>{title}</strong> (x{quantity}) has been added to your cart!</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-primary" onClick={handleCloseModal}>
                                    View Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookPage;
