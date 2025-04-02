import { createContext, ReactNode, useContext, useState } from 'react';
import { CartItem } from "../types/CartItem";

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (bookID: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Function to add an item to the cart
    const addToCart = (item: CartItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((c) => c.bookID === item.bookID);
            const updatedCart = prevCart.map((c) => 
                c.bookID === item.bookID
                    ? { ...c, quantity: c.quantity + item.quantity }
                    : c
            );

            return existingItem ? updatedCart: [...prevCart, item];
        });
    };

    // Function to remove an item from the cart
    const removeFromCart = (bookID: number) => {
        setCart((prevCart) => prevCart.filter((c) => c.bookID !== bookID));
    }

    // Function to clear the cart
    const clearCart = () => {
        setCart(() => []);
    };

    // Return the context provider
    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

// Export the cart to be used throughout the app
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}