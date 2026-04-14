import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import { Checkout } from '../pages/Checkout';

describe('Checkout Flow', () => {
    it('shows validation requirements on empty submission', () => {
        renderWithProviders(<Checkout />);
        
        const nameInput = screen.getByPlaceholderText(/John Doe/i);
        const phoneInput = screen.getByPlaceholderText(/\+1 234 567 890/i);
        const addressInput = screen.getByPlaceholderText(/123 Pizza Street/i);

        expect(nameInput).toBeRequired();
        expect(phoneInput).toBeRequired();
        expect(addressInput).toBeRequired();
    });

    it('successfully places an order with valid data', async () => {
        // Mock localStorage
        const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
        
        const preloadedState = {
            cart: {
                items: [{ id: 1, name: 'Margherita', price: 10, discountPrice: 0, originalPrice: 10, quantity: 2, image: 'test.jpg' }]
            }
        };

        renderWithProviders(<Checkout />, { preloadedState });

        // Fill out the form
        fireEvent.change(screen.getByPlaceholderText(/John Doe/i), { target: { value: 'Jane Doe' } });
        fireEvent.change(screen.getByPlaceholderText(/\+1 234 567 890/i), { target: { value: '123456789' } });
        fireEvent.change(screen.getByPlaceholderText(/123 Pizza Street/i), { target: { value: 'Main St 123' } });

        // Submit the form
        const submitBtn = screen.getByText(/Place Order/i);
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText(/Success!/i)).toBeInTheDocument();
            expect(screen.getByText(/Your pizzas are being prepared/i)).toBeInTheDocument();
        });

        expect(setItemSpy).toHaveBeenCalled();
        const callArgs = setItemSpy.mock.calls.find(call => call[0] === 'pizza_orders');
        expect(callArgs).toBeDefined();
        
        const savedOrder = JSON.parse(callArgs![1] as string);
        expect(savedOrder[savedOrder.length - 1].customer.name).toBe('Jane Doe');

        setItemSpy.mockRestore();
    });
});
