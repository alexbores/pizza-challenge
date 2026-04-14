import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { Checkout } from './pages/Checkout';
import { Management } from './pages/Management';
import { Search } from './pages/Search';
import ProductDetail from './pages/Single-pizza';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import type { RootState } from  './app/store';
import { setInitialMenu } from './features/menu/menuSlice';
import pizzasData from './assets/data/pizzas.json';

function App() {
  const dispatch = useDispatch();
  const allPizzas = useSelector((state: RootState) => state.menu.items);
      
  useEffect(() => {
      if (allPizzas.length === 0) {
          const formattedPizzas = pizzasData.map((p: any) => ({
              ...p,
              originalPrice: p.price
          }));
          dispatch(setInitialMenu(formattedPizzas as any));
      }
  }, [dispatch, allPizzas.length]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/management" element={<Management />} />
        <Route path="/search" element={<Search />} />
         <Route path="/pizza/:id" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
