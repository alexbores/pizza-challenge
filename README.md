# Signature Pizza - Professional Admin & Ordering Platform

## Project Overview
Signature Pizza is a React-based single-page application (SPA) that enables users to browse pizza catalog, manage orders, and access business intelligence through an integrated administrative dashboard.

## Technical Stack
- **Frontend**: React 18 with TypeScript and Vite
- **State Management**: Redux Toolkit (RTK)
- **Styling**: Tailwind CSS v4 and Custom Vanilla CSS
- **Analytics**: Chart.js and react-chartjs-2
- **Testing**: Vitest and React Testing Library (RTL)
- **Navigation**: React Router DOM (v6)


### Data Structure & Persistence
- **Pizza Catalog (`pizzas.json`)**: Serves as the initial source of truth. The schema includes IDs, promotional pricing, and categorical metadata used for the smart search engine.
- **Order Persistence**: User orders are serialized into a JSON-like structure and persisted via a dedicated `localStorage` simulation layer. This ensures that order history and business analytics survive browser refreshes without requiring a backend server.
- **Hydration Strategy**: The application performs a unified hydration of the menu state from both static JSON and localized custom additions, providing a seamless "Catalog Management" experience.

### Discount Logic & Business Rules
The application features a pricing system that handles two overlapping discount strategies:
1. **Catalog Promotions**: Static discounts defined within the core pizza data.
2. **Bulk Order Rule**: A global **10% discount** is automatically applied to the entire subtotal when the total number of pizzas in the cart is **3 or more**. 

### Data Visualization
Integrated **Chart.js** to provide analytics to the admin dashboard. The analytics dashboard aggregates real-time sales data and revenue distribution alongside the orders.json that is already in place.

## Reliability and Testing
The project includes automated testing suite using **Vitest**.
- **Cart Integration**: Verifies item addition, quantity merging logic, and accurate subtotal/discount calculations.
- **Checkout Guard**: Ensures form validation integrity and verifies the persistence of order data upon successful placement.

## Getting Started


### Installation
```bash
npm install
```

### Development Environment
```bash
npm run dev
```

### Executing Tests
```bash
npm test
```

### Production Build
```bash
npm run build
```
