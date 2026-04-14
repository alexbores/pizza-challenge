import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { clearCart } from '../features/cart/cartSlice';
import { Navbar } from '../components/Navbar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import gradient from '../assets/gradient (2).png';

export function Checkout() {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    
    // Total number of pizzas for discount eligibility
    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    // Subtotal (Original price sum)
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    // Global 10% discount if 3+ total pizzas
    const globalDiscount = totalQuantity >= 3 ? subtotal * 0.1 : 0;
    const finalTotal = subtotal - globalDiscount;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isOrdered, setIsOrdered] = useState(false);

    const saveOrderToLocal = (order: any) => {
        const existingOrders = JSON.parse(localStorage.getItem('pizza_orders') || '[]');
        const updatedOrders = [...existingOrders, order];
        localStorage.setItem('pizza_orders', JSON.stringify(updatedOrders));
    };

    

    /**
     * Primary order submission handler
     */
    const handlePlaceOrder = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        const orderData = {
            customer: {
                name: formData.get('fullName'),
                phone: formData.get('phone'),
                address: formData.get('address'),
            },
            items: cartItems,
            total: finalTotal,
            timestamp: new Date().toISOString()
        };

        saveOrderToLocal(orderData);
        setIsOrdered(true);
        
        // Brief success state before redirecting
        setTimeout(() => {
            dispatch(clearCart());
            navigate('/');
        }, 6000); 
    };

    if (isOrdered) {
        return (
            <section id="checkout-page" className="min-h-screen flex flex-col items-center justify-center bg-white p-5">
                <div className="text-center">
                    <div className="animate-bounce">
                        <h1 className="text-6xl title-font text-red mb-4">Success!</h1>
                        <p className="text-2xl font-bold">Your pizzas are being prepared...</p>
                    </div>
                    
                    <div className="mt-10 flex flex-col items-center gap-4">
                        <p className="text-gray-400 text-sm mt-4 italic">Redirecting you to the home page shortly...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
        <Navbar />
        <section id="checkout-page" className="min-h-screen bg-beige flex flex-col">
            <img src={gradient} alt="My Pizza App" className='absolute top-0 left-0 w-full h-full object-cover z-0 background-image' />
            <div className="content w-full flex flex-row gap-10">
                    
                    <div className="flex-grow bg-white p-10 rounded-3xl shadow-sm border border-gray-100 col-form">
                        <h2 className="title-font text-4xl mb-8">Delivery Details</h2>
                        <form onSubmit={handlePlaceOrder} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-sm text-gray-500">Full Name</label>
                                <input required name="fullName" type="text" placeholder="John Doe" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-sm text-gray-500">Phone Number</label>
                                <input required name="phone" type="tel" placeholder="+1 234 567 890" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-sm text-gray-500">Delivery Address</label>
                                <textarea required name="address" rows={4} placeholder="123 Pizza Street, Crust City" />
                            </div>
                            <button type="submit" className="button w-full py-5 text-xl mt-4">
                                Place Order — ${finalTotal.toFixed(2)}
                            </button>
                        </form>
                    </div>

                    <div className="w-full lg:w-[450px] flex flex-col gap-6 col-sumamry">
                        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 h-fit">
                            <h2 className="title-font text-3xl mb-8">Order Summary</h2>
                            
                            <div className="flex flex-col gap-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
                                {cartItems.length === 0 ? (
                                    <p className="text-gray-400">Your cart is empty.</p>
                                ) : (
                                    cartItems.map(item => (
                                        <div key={item.id} className="flex flex-row items-center gap-4">
                                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-2xl" />
                                            <div className="flex-grow">
                                                <h4 className="font-bold text-sm">{item.name}</h4>
                                                <div className="flex flex-row items-center gap-2">
                                                    <p className="text-gray-400 text-xs">{item.quantity} x ${item.price.toFixed(2)}</p>
                                                    {item.originalPrice > item.price && (
                                                        <span className="text-gray-300 text-xs line-through">${item.originalPrice.toFixed(2)}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="font-bold text-sm">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="flex flex-col gap-3 pt-6 border-t border-gray-100">
                                <div className="flex justify-between">
                                    <span className="font-bold text-gray-text">Subtotal</span>
                                    <span className="text-gray-text text-sm">${subtotal.toFixed(2)}</span>
                                </div>
                                {globalDiscount > 0 && (
                                    <div className="flex justify-between text-green-600 font-bold">
                                        <span>Bulk Discount (10%)</span>
                                        <span>-${globalDiscount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-2xl title-font border-t border-gray-100 pt-3">
                                    <span>Total</span>
                                    <span className="text-red">${finalTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => navigate('/')}
                            className="text-gray-400 font-bold hover:text-black transition-colors self-center"
                        >
                            ← Add More Pizzas
                        </button>
                    </div>

            </div>
        </section>
        </>
    );
};

