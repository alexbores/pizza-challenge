import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../app/store';
import { removeItem, updateQuantity } from '../features/cart/cartSlice';
import searchIcon from '../assets/search.png';
import closeIcon from '../assets/close.svg';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Track scroll position
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const totalOriginalPrice = cartItems.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0);

    const handleCheckout = () => {
        setIsOpen(false);
        navigate('/checkout');
    };

    const handleQuantityChange = (id: number, quantity: number) => {
        if (quantity < 1) return;
        dispatch(updateQuantity({ id, quantity }));
    };

    return (
      <>
        <section id="nav-holder" className={`w-full z-10 ${isScrolled ? 'scrolled' : ''}`}>
            <div className="content z-1 flex flex-row items-center justify-between">
                <div className="flex flex-row gap-5 items-center">
                    <button 
                        className="button button-secondary" 
                        onClick={() => navigate('/')}
                    >
                        Menu
                    </button>
                    <button 
                        className="button button-secondary admin-button" 
                        onClick={() => navigate('/management')}
                    >
                        Admin
                    </button>
                    <button className="button"
                        onClick={() => navigate('/search')}
                    >
                        Search 
                        <img src={searchIcon} alt="Search" />
                    </button>

                    
                </div>

                <div className="flex flex-row gap-5 items-center">
                    <button 
                        className="button button-secondary" 
                        onClick={() => setIsOpen(true)}
                    >
                        Cart ({totalItems})
                    </button>
                    <button className="button checkout-button" onClick={handleCheckout}>Checkout</button>
                </div>
            </div>
        </section>

        <div id="cart-holder" className={`z-[999] fixed top-0 ${isOpen ? 'open' : ''}`}>
             <div className="w-full flex flex-row items-center justify-end top-bar">
                 <button className="button" onClick={() => setIsOpen(false)}>
                    <img src={closeIcon} alt="Close" />
                 </button>
             </div>
             
             <p className="title-font text-2xl pt-5">
                Shopping Cart
             </p>

             <div className="w-full flex flex-col items-start justify-start items scrollable">
                {cartItems.length === 0 ? (
                    <p className="py-10 text-gray-400">Your cart is empty.</p>
                ) : (
                    cartItems.map((item) => (
                        <div key={item.id} className="cart-item w-full flex flex-row items-center gap-4 py-4 border-b border-gray-100">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                            <div className="flex-grow">
                                <h4 className="font-bold text-sm">{item.name}</h4>
                                <div className="flex flex-row items-center gap-2">
                                    <p className="text-red font-bold text-sm">${item.price.toFixed(2)}</p>
                                    {item.originalPrice > item.price && (
                                        <span className="text-gray text-xs line-through">${item.originalPrice.toFixed(2)}</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <button 
                                    className="qty-btn-small" 
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                >-</button>
                                <span className="font-bold">{item.quantity}</span>
                                <button 
                                    className="qty-btn-small" 
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                >+</button>
                            </div>
                            <button 
                                className="text-gray-300 hover:text-red transition-colors"
                                onClick={() => dispatch(removeItem(item.id))}
                            >
                                <img src={closeIcon} alt="Remove" className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
             </div>

             <div className="w-full bottom-bar flex flex-col gap-4">
                {totalOriginalPrice > totalPrice && (
                    <div className="flex flex-row justify-between w-full border-t border-gray-100 pt-4">
                        <span className="font-bold title-font text-md text-gray-text">Original Total</span>
                        <span className="font-bold title-font text-md text-black line-through">${totalOriginalPrice.toFixed(2)}</span>
                    </div>
                )} 
                <div className="flex flex-row justify-between w-full border-t border-gray-100">
                    <span className="font-bold title-font text-lg">Total</span>
                    <span className="font-bold title-font text-lg text-red">${totalPrice.toFixed(2)}</span>
                </div>
                <button className="button w-full py-4 text-lg" onClick={handleCheckout}>Proceed to Checkout</button>
             </div>
        </div>
      </>  
    );
}