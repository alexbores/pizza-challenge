import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../features/cart/cartSlice';
import type { RootState } from  '../app/store';

import { Navbar } from '../components/Navbar';

// Assets
import arrowLeft from '../assets/arrow-right.svg'; // Reusing and rotating

const SinglePizza = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);

  const allPizzas = useSelector((state: RootState) => state.menu.items);
  const pizza = allPizzas.find(p => p.id === parseInt(id || '0'));

  if (!pizza) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-beige">
        <h1 className="title-font text-4xl text-red">Pizza not found!</h1>
        <button className="button mt-8" onClick={() => navigate('/')}>Return to Menu</button>
      </div>
    );
  }

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    dispatch(addItem({
      id: pizza.id,
      name: pizza.name,
      price: pizza.discountPrice ?? pizza.price,
      discountPrice: pizza.discountPrice ?? 0,
      originalPrice: pizza.price,
      image: pizza.image,
      quantity: quantity,
    }));
  };

  const hasDiscount = pizza.discountPrice !== null && pizza.discountPrice !== undefined;

  return (
    <>
      <Navbar />
      <section id="single-pizza-page" className="min-h-screen bg-white relative overflow-hidden">
         
         <div className="content relative ">
            
            {/* Back Button */}
            <button 
                onClick={() => navigate(-1)} 
                className="back-btn flex flex-row items-center gap-3 text-gray-400 hover:text-red transition-all mb-10 group"
            >
                <img src={arrowLeft} alt="Back" className="w-5 h-5 rotate-180 group-hover:-translate-x-2 transition-transform" />
                <span className="font-bold uppercase tracking-widest text-sm">Back to Menu</span>
            </button>

            <div className="flex flex-row w-full justify-center items-start">
                
                <div className="img-holder single-page-hero">
                        <div className="grad-circle grad-circle-1 "></div>
                        <div className="grad-circle grad-circle-2 "></div>
                        <div className="grad-circle grad-circle-3 "></div>
                        <img src={pizza.image} alt={pizza.name} className="relative" />
                    </div>

                <div className="pizza-details">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="bg-red/10 text-red px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                            Official Signature
                        </span>
                    </div>

                    <h1 className="title-font text-6xl text-red mb-6">{pizza.name}</h1>
                    
                    <p className="description text-xl text-gray-500 leading-relaxed mb-10">
                        {pizza.description}
                    </p>

                    {/* Ingredients */}
                    {pizza.ingredients && (
                        <div className="ingredients-box mb-12">
                            <h3 className="font-bold text-gray-400 uppercase tracking-widest text-sm mb-4">Ingredients</h3>
                            <div className="flex flex-wrap gap-3">
                                {pizza.ingredients.map((ing, i) => (
                                    <span key={i} className="px-5 py-2 bg-beige rounded-2xl text-gray-700 font-medium">
                                        {ing}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="purchase-card bg-white border border-gray-100 p-8 rounded-[40px] shadow-xl shadow-red/5">
                        <div className="flex items-center justify-between mb-8">
                            <div className="price-display flex flex-col">
                                <span className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Price</span>
                                <div className="flex items-center gap-4">
                                    <span className="title-font text-4xl text-red">
                                        ${(pizza.discountPrice ?? pizza.price).toFixed(2)}
                                    </span>
                                    {hasDiscount && (
                                        <span className="text-gray-300 line-through text-xl">
                                            ${pizza.price.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="qty-holder scale-110">
                                <button className="qty-btn" onClick={handleDecrement}>-</button>
                                <span className="qty">{quantity}</span>
                                <button className="qty-btn" onClick={handleIncrement}>+</button>
                            </div>
                        </div>

                        <button 
                            className="button w-full py-6 text-xl shadow-lg shadow-red/20 active:scale-95 transition-all"
                            onClick={handleAddToCart}
                        >
                            Confirm Selection • ${( (pizza.discountPrice ?? pizza.price) * quantity ).toFixed(2)}
                        </button>
                    </div>
                </div>
            </div>
         </div>
      </section>
    </>
  );
};

export default SinglePizza;
