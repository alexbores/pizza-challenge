import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPizza, deletePizza, resetMenu } from '../features/menu/menuSlice';
import type { Pizza } from '../features/menu/menuSlice';
import type { RootState } from '../app/store';
import { Navbar } from '../components/Navbar';

import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend, 
    ArcElement 
} from 'chart.js';
import { Bar as BarChart, Doughnut as DoughnutChart } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend, 
    ArcElement
);

import initialOrders from '../assets/data/orders.json';

const PREDEFINED_IMAGES = [
    { name: 'Mexican', url: '/pizzas-images/pizza-mexican.webp' },
    { name: 'Indi', url: '/pizzas-images/pizza-indi.webp' },
    { name: 'Double Sausage', url: '/pizzas-images/pizza-double-sausage.webp' },
    { name: 'Grilled Veal', url: '/pizzas-images/pizza-grilled-veal.webp' },
];

export function Management() {
    const dispatch = useDispatch();
    const pizzas = useSelector((state: RootState) => state.menu.items);
    
    const [activeTab, setActiveTab] = useState<'menu' | 'orders' | 'analytics'>('menu');
    const [orders, setOrders] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        discountPrice: '',
        description: '',
        image: PREDEFINED_IMAGES[0].url,
    });

    /**
     * Synchronize local storage orders with static history
     * Sorts descending by timestamp for recent-first display
     */
    useEffect(() => {
        const localOrders = JSON.parse(localStorage.getItem('pizza_orders') || '[]');
        const combined = [...localOrders, ...initialOrders].sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setOrders(combined);
    }, [activeTab]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddPizza = (e: React.FormEvent) => {
        e.preventDefault();
        const newPizza: Pizza = {
            id: Date.now(),
            name: formData.name,
            price: parseFloat(formData.price),
            discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
            originalPrice: parseFloat(formData.price),
            description: formData.description,
            image: formData.image,
            ingredients: ['Special', 'Hand-picked', 'Fresh'],
        };
        dispatch(addPizza(newPizza));
        setFormData({ name: '', price: '', discountPrice: '', description: '', image: PREDEFINED_IMAGES[0].url });
    };

    // Calculate Analytics Data
    const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);
    const bestSeller = (() => {
        const counts: Record<string, number> = {};
        orders.forEach(order => {
            order.items.forEach((item: any) => {
                counts[item.name] = (counts[item.name] || 0) + item.quantity;
            });
        });
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        return sorted[0]?.[0] || 'None';
    })();

    /**
     * Aggregation engine for analytics charts
     * Decouples sales data from current menu availability to ensure 
     * accurate historical tracking.
     */
    const salesStats = (() => {
        const stats: Record<string, { quantity: number; revenue: number }> = {};
        orders.forEach(order => {
            order.items.forEach((item: any) => {
                if (!stats[item.name]) {
                    stats[item.name] = { quantity: 0, revenue: 0 };
                }
                stats[item.name].quantity += item.quantity;
                stats[item.name].revenue += (item.price * item.quantity);
            });
        });
        return stats;
    })();

    const barChartData = {
        labels: Object.keys(salesStats),
        datasets: [{
            label: 'Units Sold',
            data: Object.values(salesStats).map(s => s.quantity),
            backgroundColor: 'rgba(189, 31, 23, 0.7)',
            borderColor: '#BD1F17',
            borderWidth: 1,
            borderRadius: 8,
        }]
    };

    const doughnutChartData = {
        labels: Object.keys(salesStats),
        datasets: [{
            data: Object.values(salesStats).map(s => s.revenue),
            backgroundColor: [
                '#BD1F17', // Primary Red
                '#FFD700', // Gold
                '#4CAF50', // Green
                '#2196F3', // Blue
                '#9C27B0', // Purple
                '#FF9800', // Orange
                '#795548', // Brown
                '#607D8B'  // Gray
            ],
            borderWidth: 0,
            hoverOffset: 20
        }]
    };

    return (
        <>
            <Navbar />
            <section id="management-page" className="min-h-screen bg-beige pt-32 pb-20 px-5 lg:px-20 overflow-x-hidden">
                <div className="flex flex-col items-center mb-10">
                    <h1 className="title-font text-6xl text-center text-red">Admin Dashboard</h1>
                    
                    {/* Tab Navigation */}
                    <div className="flex flex-row gap-8 mt-10 border-b border-gray-100 w-full justify-center overflow-x-auto whitespace-nowrap px-4">
                        <button onClick={() => setActiveTab('menu')} className={`pb-4 px-6 text-lg font-bold transition-all border-b-2 ${activeTab === 'menu' ? 'border-red text-black' : 'border-transparent text-gray-300 hover:text-gray-500'}`}>Menu Management</button>
                        <button onClick={() => setActiveTab('orders')} className={`pb-4 px-6 text-lg font-bold transition-all border-b-2 ${activeTab === 'orders' ? 'border-red text-black' : 'border-transparent text-gray-300 hover:text-gray-500'}`}>Order History</button>
                        <button onClick={() => setActiveTab('analytics')} className={`pb-4 px-6 text-lg font-bold transition-all border-b-2 ${activeTab === 'analytics' ? 'border-red text-black' : 'border-transparent text-gray-300 hover:text-gray-500'}`}>Analytics</button>
                    </div>
                </div>

                {activeTab === 'menu' && (
                    <div className="flex flex-col lg:flex-row gap-16 items-start animate-fade-in">
                        <div className="w-full lg:w-1/3 bg-white p-10 rounded-[20px]">
                            <h2 className="title-font text-3xl mb-8">Add New Pizza</h2>
                            <form onSubmit={handleAddPizza} className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-sm text-gray-500">Pizza Name</label>
                                    <input required name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="e.g. Pepperoni" className="" />
                                </div>
                                
                                    <div className="flex flex-col gap-2 flex-1">
                                        <label className="font-bold text-sm text-gray-500">Price ($)</label>
                                        <input required name="price" value={formData.price} onChange={handleInputChange} type="number" step="0.01" className="" />
                                    </div>
                                    <div className="flex flex-col gap-2 flex-1">
                                        <label className="font-bold text-sm text-gray-500">Discounted Price ($)</label>
                                        <input name="discountPrice" value={formData.discountPrice} onChange={handleInputChange} type="number" step="0.01" placeholder="Optional" className="" />
                                    </div>
                                <div className="flex flex-col gap-4">
                                    <label className="font-bold text-sm text-gray-500">Choose Appearance</label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {PREDEFINED_IMAGES.map((img) => (
                                            <button key={img.url} type="button" onClick={() => setFormData(prev => ({ ...prev, image: img.url }))} className={`p-2 rounded-2xl border-2 transition-all ${formData.image === img.url ? 'border-red bg-white' : 'border-transparent hover:bg-white/50'}`}>
                                                <img src={img.url} alt={img.name} className="w-full h-auto object-contain" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-sm text-gray-500">Short Description</label>
                                    <textarea required name="description" value={formData.description} onChange={handleInputChange} rows={3} className=" resize-none" />
                                </div>
                                <button type="submit" className="button">Add to Site</button>
                            </form>
                        </div>

                        {/* List of pizzas */}
                        <div className="flex-grow w-full">
                            <div className="flex justify-between items-end mb-8 text-black">
                                <div>
                                    <h2 className="title-font text-3xl">Active Pizzas</h2>
                                    <p className="text-gray-400 text-sm font-bold">{pizzas.length} Items Found</p>
                                </div>
                                <button onClick={() => { if(confirm("Are you sure?")) dispatch(resetMenu()); }} className="text-xs font-bold text-red border border-red/20 px-4 py-2 rounded-full hover:bg-red hover:text-white transition-all uppercase tracking-widest">Reset Menu</button>
                            </div>
                            <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2">
                                {pizzas.map(pizza => (
                                    <div key={pizza.id} className="group overflow-hidden bg-white border border-gray-100 p-6 rounded-[12px] shadow-sm hover:shadow-xl transition-all flex flex-row items-center gap-8 min-h-[120px]">
                                        <img src={pizza.image} alt={pizza.name} className="w-24 h-24 object-contain group-hover:rotate-12 transition-transform" />
                                        <div className="flex-grow">
                                            <h3 className="font-bold text-xl">{pizza.name}</h3>
                                            <p className="text-gray-400 text-sm mt-1 line-clamp-1">{pizza.description}</p>
                                            <div className="flex items-center gap-4 mt-3 font-bold">
                                                <span className="text-red">${pizza.discountPrice || pizza.price}</span>
                                                {pizza.discountPrice && <span className="text-gray-300 text-xs line-through">${pizza.price}</span>}
                                            </div>
                                        </div>
                                        
                                        {pizza.isCustom && (
                                            <button onClick={() => dispatch(deletePizza(pizza.id))} className="p-4 rounded-full bg-gray-50 text-gray-300 hover:bg-red hover:text-white transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="w-full flex flex-col gap-6 animate-fade-in">
                        <div className="overflow-x-auto bg-white rounded-[40px] border border-gray-100 shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-beige">
                                    <tr>
                                        <th className="p-6 font-bold text-gray-500 uppercase text-xs tracking-widest">Date & Time</th>
                                        <th className="p-6 font-bold text-gray-500 uppercase text-xs tracking-widest">Customer</th>
                                        <th className="p-6 font-bold text-gray-500 uppercase text-xs tracking-widest">Items</th>
                                        <th className="p-6 font-bold text-gray-500 uppercase text-xs tracking-widest">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, idx) => (
                                        <tr key={idx} className="border-b border-gray-50 hover:bg-beige transition-colors">
                                            <td className="p-6">
                                                <div className="font-bold">{new Date(order.timestamp).toLocaleDateString()}</div>
                                                <div className="text-xs text-gray-400">{new Date(order.timestamp).toLocaleTimeString()}</div>
                                            </td>
                                            <td className="p-6">
                                                <div className="font-bold">{order.customer.name}</div>
                                                <div className="text-xs text-gray-400">{order.customer.phone}</div>
                                            </td>
                                            <td className="p-6 px-10">
                                                <ul className="text-xs flex flex-col gap-1">
                                                    {order.items.map((item: any, i: number) => (
                                                        <li key={i}><span className="font-bold">{item.quantity}x</span> {item.name}</li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="p-6 font-bold text-red">${order.total.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="w-full flex flex-col gap-10 animate-fade-in">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-beige p-8 rounded-[40px] flex flex-col items-center">
                                <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Total Revenue</p>
                                <h3 className="title-font text-5xl text-red mt-2">${totalRevenue.toFixed(2)}</h3>
                            </div>
                            <div className="bg-beige p-8 rounded-[40px] flex flex-col items-center">
                                <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Orders Placed</p>
                                <h3 className="title-font text-5xl text-black mt-2">{orders.length}</h3>
                            </div>
                            <div className="bg-beige p-8 rounded-[40px] flex flex-col items-center">
                                <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Best Selling Pizza</p>
                                <h3 className="title-font text-2xl text-black mt-4 text-center">{bestSeller}</h3>
                            </div>
                        </div>

                        {/* Visual Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm h-[450px]">
                                <h4 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-8 text-center">Units Sold per Pizza</h4>
                                <div className="h-[300px]">
                                    <BarChart data={barChartData} options={{ 
                                        responsive: true, 
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false } }
                                    }} />
                                </div>
                            </div>
                            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm h-[450px]">
                                <h4 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-8 text-center">Revenue Distribution (%)</h4>
                                <div className="h-[300px]">
                                    <DoughnutChart data={doughnutChartData} options={{ 
                                        responsive: true, 
                                        maintainAspectRatio: false,
                                        plugins: { legend: { position: 'right' as const } }
                                    }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </section>
        </>
    );
}