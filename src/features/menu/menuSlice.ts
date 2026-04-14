import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Pizza {
    id: number;
    name: string;
    price: number;
    discountPrice: number | null;
    originalPrice: number | null;
    image: string;
    description: string;
    ingredients?: string[];
    rating?: number;
    isCustom?: boolean;
}

interface MenuState {
    items: Pizza[]; // This is our unified list
    customPizzas: Pizza[];
}

const loadCustomPizzas = (): Pizza[] => {
    try {
        const saved = localStorage.getItem('custom_pizzas');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error('Failed to load pizzas from localStorage', e);
        return [];
    }
};

const initialState: MenuState = {
    items: [],
    customPizzas: loadCustomPizzas(),
};

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        setInitialMenu: (state, action: PayloadAction<Pizza[]>) => {
            state.items = [...state.customPizzas, ...action.payload];
        },
        addPizza: (state, action: PayloadAction<Pizza>) => {
            const newPizza = { ...action.payload, isCustom: true };
            state.customPizzas = [newPizza, ...state.customPizzas];
            state.items = [newPizza, ...state.items];
            localStorage.setItem('custom_pizzas', JSON.stringify(state.customPizzas));
        },
        deletePizza: (state, action: PayloadAction<number>) => {
            state.customPizzas = state.customPizzas.filter(p => p.id !== action.payload);
            state.items = state.items.filter(p => p.id !== action.payload);
            localStorage.setItem('custom_pizzas', JSON.stringify(state.customPizzas));
        },
        resetMenu: (state) => {
            state.customPizzas = [];
            state.items = []; 
            localStorage.removeItem('custom_pizzas');
        },
    },
});

export const { addPizza, deletePizza, setInitialMenu, resetMenu } = menuSlice.actions;
export default menuSlice.reducer;
