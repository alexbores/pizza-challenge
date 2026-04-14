import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from  '../app/store';
import { addItem } from '../features/cart/cartSlice';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';

import { Navbar } from '../components/Navbar';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import gradient from '../assets/gradient (2).png';
import logoIcon from '../assets/logo-icon.png';
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
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();

    const handleIncrement = () => setQuantity(prev => prev + 1);
    const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleAddToCart = () => {
        dispatch(addItem({
            id: pizza.id,
            name: pizza.name,
            price: pizza.discountPrice ?? pizza.price,
            discountPrice: pizza.discountPrice,
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
                <img src={pizza.image} alt={pizza.name} className=""/>
            </div>

            <div className="flex flex-col items-center info-holder z-5 relative">
                <h2 className="pizza-title flex flex-row items-center gap-2" onClick={() => navigate(`/pizza/${pizza.id}`)}>
                    {pizza.name}
                    <img alt="view more" src={arrowRight}></img>
                </h2>
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

            <div className="flex flex-row items-center controls w-full justify-center flex-wrap">
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

function Home() {
    const allPizzas = useSelector((state: RootState) => state.menu.items);
    

    const [swiper, setSwiper] = useState<any>(null);

    function slideTo(index: number) {
        if (swiper) swiper.slideToLoop(index);
    }


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

        <section id="home">
            <img src={gradient} alt="My Pizza App" className='absolute top-0 left-0 w-full h-full object-cover z-0 background-image' />
            <div className="content z-1 flex flex-col items-center justify-start">
                <div className="title-holder w-full z-5 relative flex flex-col items-center justify-center">
                  
                  <div className="logo flex flex-row items-center justify-center w-full">
                    <h1 className="logo-title text-red">Signature Pizzas</h1>
                    <img src={logoIcon} className='logo-icon' alt="My Pizza App" />
                  </div>

                  <h2 className="text-center pizza-list-title ">Select and order your Pizza</h2>
                </div>
                

                <div className="pizza-list w-full ">
                    <Swiper
                        onSwiper={setSwiper}
                        modules={[Navigation, Pagination]}
                        spaceBetween={0}
                        slidesPerView={1.5}
                        centeredSlides={true}
                        loop={allPizzas.length >= 3}
                        className="w-full"
                        draggable={false}
                        navigation={{
                            prevEl: '#home .custom-nav-prev',
                            nextEl: '#home .custom-nav-next',
                        }}
                    >
                        {allPizzas?.map((pizza, index) => (
                            <SwiperSlide key={`${pizza.id}-${index}`} onClick={() => slideTo(index)}>
                                <PizzaCard pizza={pizza} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="flex flex-row gap-5 flex-items navigation z-10">
                    <div className="custom-nav-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer">
                        <img src={arrowRight} className="rotate-132" alt="Previous" />
                    </div>
                    <div className="custom-nav-next absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer">
                        <img src={arrowRight} alt="Next" className="rotate-315"/>
                    </div>
                </div>
            </div>
        </section>
      </>
    );
}

export default Home;