import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import MainPage from './pages/MainPage';
import BookPage from './pages/BookPage';
import CartPage from './pages/CartPage';
import { CartProvider } from './context/CartContext';

function App() {

  return (
    <>
    <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={< MainPage />} />
            <Route path="/books" element={< MainPage />} />
            <Route path="/buy/:bookID/:title/:price" element={< BookPage />} />
            <Route path="/cart" element={< CartPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </>
  )
}

export default App;
