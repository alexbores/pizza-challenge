import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from  '../app/store';
import { addItem } from '../features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';


import logoIcon from '../assets/logo-icon.png';
import searchIcon from '../assets/search.png';

import arrowRight from '../assets/arrow-right.svg';


interface Pizza {
    id: number;
    name: string;
    price: number;
    discountPrice?: number | null;
    image: string;
    description: string;
}

const PizzaCard = ({ pizza }: { pizza: Pizza }) => {
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    return (
        <div className="pizza-card flex flex-col items-center">
            <div className="img-holder flex flex-col items-center justify-center">
                <div className="grad-circle grad-circle-1"></div>
                <div className="grad-circle grad-circle-2"></div>
                <div className="grad-circle grad-circle-3"></div>
                <img src={pizza.image} alt={pizza.name} className="" />
            </div>

            <div className="flex flex-col items-center info-holder z-5 relative">
                <h2 className="pizza-title" onClick={() => navigate(`/pizza/${pizza.id}`)}>{pizza.name}</h2>
                <p className="flex-grow text-center description">{pizza.description}</p>

                <p className="flex flex-row gap-5 price title-font">
                    {pizza.discountPrice ? (
                        <>
                            
                            <span className="original-price">${pizza.price}</span>
                            <span className="text-red discounted-price">${pizza.discountPrice}</span>
                        </>
                    ) : (
                        <span className="original-price text-red">${pizza.price}</span>
                    )}
                </p>
            </div>

            <div className="flex flex-row gap-5 items-center controls w-full justify-center">
                <button className="view-more button button-secondary" onClick={() => navigate(`/pizza/${pizza.id}`)}>
                    View More 
                    <img alt="view more" src={arrowRight}></img>
                    </button>
                <div className="flex flex-row items-center justify-center qty-holder">
                    
                    <button className="qty-btn" onClick={handleDecrement}>-</button>
                    <span className="qty">{quantity}</span>
                    <button className="qty-btn" onClick={handleIncrement}>+</button>
                </div>
                <button className="add-to-cart button" onClick={handleAddToCart}>
                    Add to Cart
                </button>
            </div>
        </div>
    );
};


/**
 * Smart Search Configuration
 * Stop words are filtered out to improve matching accuracy and relevance
 */
const STOP_WORDS = new Set(['the', 'a', 'an', 'with', 'and', 'or', 'pizza', 'of', 'extra', 'for', 'on', 'in']);

export function Search() {
    const allPizzas = useSelector((state: RootState) => state.menu.items);
    const [searchTerm, setSearchTerm] = useState('');

    
    const filteredPizzas = allPizzas.filter(pizza => {
        if (!searchTerm.trim()) return true;

        const keywords = searchTerm.toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 0 && !STOP_WORDS.has(word));

        if (keywords.length === 0) return true;

        const searchTarget = `${pizza.name} ${pizza.description}`.toLowerCase();

        return keywords.every(kw => searchTarget.includes(kw));
    });

    if (allPizzas.length === 0) {
        return (
            <section id="loading-page" className="min-h-screen flex items-center justify-center bg-beige">
                <div className="text-center">
                    <h1 className="title-font text-4xl text-red animate-pulse">Warming the Oven...</h1>
                    <p className="text-gray-400 mt-2">Fetching the secret menu</p>
                </div>
            </section>
        );
    }

    return (
      <>
       <Navbar />

        <section id="search-page">
            <div className="content z-1 flex flex-col items-center justify-start">
                <div className="title-holder w-full z-5 relative flex flex-col items-center justify-center">
                  
                  <div className="logo flex flex-row items-center justify-center w-full">
                    <h1 className="logo-title text-red">Signature Pizzas</h1>
                    <img src={logoIcon} className='logo-icon' alt="My Pizza App" />
                  </div>

                  <h2 className="text-center pizza-list-title ">Search and order your Pizza</h2>

                  <div className="search-bar flex flex-row items-center justify-center">
                    <input 
                        type="text" 
                        placeholder="Search for your pizza..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <img src={searchIcon} alt="Search" className='absolute top-0 bottom-0 m-auto pointer-events-none' />
                  </div>
                </div>
                

                <div className="pizza-list w-full flex flex-row flex-wrap items-start justify-start">
                    {filteredPizzas.length > 0 ? (
                        filteredPizzas.map((pizza, index) => (
                            <PizzaCard pizza={pizza} key={index} />
                        ))
                    ) : (
                        <div className="w-full text-center py-20">
                            <h3 className="title-font text-3xl text-gray-300">No pizzas found...</h3>
                            <p className="text-gray-400 mt-2">Try searching for another name!</p>
                        </div>
                    )}
                </div>

            </div>
        </section>
      </>
    );
}