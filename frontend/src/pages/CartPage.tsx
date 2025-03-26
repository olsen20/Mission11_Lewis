// This is the Cart page that displays all of the books that have been placed in the cart

import { useNavigate } from "react-router-dom";
import { CartItem } from "../types/CartItem";
import { useCart } from "../context/CartContext";

function CartPage() {
    const navigate = useNavigate();
    const { cart, removeFromCart } = useCart();

    // Calculate totals
    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0)
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        // Displayed cart
        <div className="container mt-4">
        <h2 className="mb-4">Your Cart</h2>

        {cart.length === 0 ? (
            <div className="alert alert-info">Your cart is empty.</div>
        ) : (
            <div className="row justify-content-center">
            {cart.map((item: CartItem) => (
                <div className="col-12 col-md-12 mb-3" key={item.bookID}>
                    <div className="card shadow-sm">
                        <div className="card-body d-flex flex-column flex-md-row align-items-center">
                            <div className="me-auto">
                                <h5 className="card-title">{item.title}</h5>
                                <p className="mb-0">Price: ${item.price.toFixed(2)}</p>
                                <p className="mb-0">Quantity: {item.quantity}</p>
                                <p className="mb-1"><strong>Subtotal: ${(item.quantity * item.price).toFixed(2)}</strong></p>
                            </div>
                            <button
                                className="btn btn-danger mt-3 mt-md-0"
                                onClick={() => removeFromCart(item.bookID)}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        )}

        {/* Cart summary numbers */}
        {cart.length > 0 && (
        <>
            <h5 className="mt-4 text-center">Total Items: {totalQuantity}</h5>
            <h4 className="mt-4 text-center">Total: ${totalPrice.toFixed(2)}</h4>
        </>
        )}

        {/* Action buttons */}
        <div className="d-flex justify-content-center gap-2 mt-3">
        {/* <button className="btn btn-success">Checkout</button> */}
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
            Continue Shopping
        </button>
        </div>

        </div>
    );
}

export default CartPage;
