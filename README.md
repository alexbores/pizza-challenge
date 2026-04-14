# Signature Pizza - Professional Admin & Ordering Platform

## Project Overview
Signature Pizza is a sophisticated React-based single-page application (SPA) that enables users to browse a premium pizza catalog, manage orders with a dynamic pricing engine, and access business intelligence through an integrated administrative dashboard. The project is built to demonstrate high-level proficiency in state management, automated testing, and professional UI/UX design using modern web technologies.

## Technical Stack
- **Frontend**: React 18 with TypeScript and Vite
- **State Management**: Redux Toolkit (RTK)
- **Styling**: Tailwind CSS v4 and Custom Vanilla CSS
- **Analytics**: Chart.js and react-chartjs-2
- **Testing**: Vitest and React Testing Library (RTL)
- **Navigation**: React Router DOM (v6)

## Implementation Details & Design Decisions

### State Management: Redux vs. Context
We selected **Redux Toolkit** over the Context API to manage the application's shared state. This decision was driven by the complexity of the data synchronization required between the Menu (hydrated from JSON + custom user items), the Cart (real-time quantity management), and the Admin Analytics (real-time order snapshots). RTK provides a predictable, centralized state container that ensures data integrity across all five main routes.

### Data Structure & Persistence
- **Pizza Catalog (`pizzas.json`)**: Serves as the initial source of truth. The schema includes IDs, promotional pricing, and categorical metadata used for the smart search engine.
- **Order Persistence**: User orders are serialized into a JSON-like structure and persisted via a dedicated `localStorage` simulation layer. This ensures that order history and business analytics survive browser refreshes without requiring a backend server.
- **Hydration Strategy**: The application performs a unified hydration of the menu state from both static JSON and localized custom additions, providing a seamless "Catalog Management" experience.

### Discount Logic & Business Rules
The application features a robust real-time pricing engine that handles two overlapping discount strategies:
1. **Catalog Promotions**: Static discounts defined within the core pizza data.
2. **Bulk Order Rule**: A global **10% discount** is automatically applied to the entire subtotal when the total number of pizzas in the cart is **3 or more**. This is implemented as derived state to maintain high performance and UI consistency.

### Data Visualization
We integrated **Chart.js** to provide the administrative suite with actionable business intelligence. The analytics dashboard aggregates real-time sales data and revenue distribution, allowing managers to track performance across both core and custom menu items.

## Reliability and Testing
The project includes a comprehensive automated testing suite using **Vitest**.
- **Cart Integration**: Verifies item addition, quantity merging logic, and accurate subtotal/discount calculations.
- **Checkout Guard**: Ensures form validation integrity and verifies the persistence of order data upon successful placement.

## Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn

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
