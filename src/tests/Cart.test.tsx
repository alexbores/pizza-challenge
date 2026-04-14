import { describe, it, expect } from 'vitest';
import { renderWithProviders } from './test-utils';
import { addItem } from '../features/cart/cartSlice';

describe('Cart Integration', () => {
    it('accurately aggregates multiple product additions', () => {
        const { store } = renderWithProviders(<div />);
        
        const pizza1 = { id: 1, name: 'Margherita', price: 10, discountPrice: 0, originalPrice: 10, quantity: 1, image: 'test.jpg' };
        const pizza2 = { id: 2, name: 'Pepperoni', price: 15, discountPrice: 0, originalPrice: 15, quantity: 2, image: 'test.jpg' };
        const pizza3 = { id: 3, name: 'Veggie', price: 12, discountPrice: 0, originalPrice: 12, quantity: 1, image: 'test.jpg' };

        store.dispatch(addItem(pizza1));
        store.dispatch(addItem(pizza2));
        store.dispatch(addItem(pizza3));

        const state = store.getState().cart;

        expect(state.items).toHaveLength(3);
        
        expect(state.items[0].name).toBe('Margherita');
        expect(state.items[2].name).toBe('Veggie');

        const total = state.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
        expect(total).toBe(52);
    });
});
