"use client";
import { useState, useEffect } from 'react';
import { Calendar, Star, Plus, Minus, Check, Clock, Utensils, ChevronRight, Coffee, Circle } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import BottomNav from '../../components/BottomNav';

export default function Mess() {
    const { addFood } = useUser();
    const [selectedMeal, setSelectedMeal] = useState('lunch');
    const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1); // Default to today

    // Store quantities: { 'lunch-Rice': 2, 'lunch-Roti': 3 }
    const [quantities, setQuantities] = useState({});

    const [bookedMeals, setBookedMeals] = useState({}); // Track if a meal slot is logged for today
    const [currentDate, setCurrentDate] = useState(new Date());

    // Get today's day index (0 = Monday, 6 = Sunday)
    const getTodayIndex = () => {
        const day = currentDate.getDay();
        return day === 0 ? 6 : day - 1;
    };

    const todayIndex = getTodayIndex();
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Generate dates for the week
    const getWeekDates = () => {
        const today = new Date();
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - today.getDay() + (i + 1)); // Monday = 1
            dates.push(date.getDate());
        }
        return dates;
    };

    const dates = getWeekDates();

    // Menu Configuration
    const messMenu = {
        breakfast: {
            staples: [
                { name: 'Coffee', unit: 'cup', calories: 80, protein: 2, carbs: 12, fat: 3, desc: 'Hot brewed coffee', unlimited: true },
                { name: 'Chai', unit: 'cup', calories: 60, protein: 2, carbs: 10, fat: 2, desc: 'Masala tea', unlimited: true },
            ],
            weekly: {
                0: { name: 'Poha', calories: 250, protein: 6, carbs: 42, fat: 8, rating: 4.2, desc: 'Flattened rice with peanuts' },
                1: { name: 'Aloo Paratha', calories: 320, protein: 8, carbs: 50, fat: 12, rating: 4.3, desc: 'Stuffed flatbread' },
                2: { name: 'Idli Sambar', calories: 280, protein: 10, carbs: 46, fat: 6, rating: 4.4, desc: 'Steamed rice cakes' },
                3: { name: 'Bread Omelette', calories: 260, protein: 14, carbs: 30, fat: 10, rating: 4.3, desc: 'Egg sandwich' },
                4: { name: 'Puri Bhaji', calories: 380, protein: 9, carbs: 58, fat: 14, rating: 4.5, desc: 'Fried bread curry' },
                5: { name: 'Masala Dosa', calories: 360, protein: 9, carbs: 55, fat: 12, rating: 4.7, desc: 'Crispy crepe' },
                6: { name: 'Chole Bhature', calories: 480, protein: 14, carbs: 68, fat: 16, rating: 4.9, desc: 'Chickpea curry fried bread' },
            }
        },
        lunch: {
            staples: [
                { name: 'Dal', unit: 'bowl', calories: 180, protein: 12, carbs: 28, fat: 3, desc: 'Yellow dal tadka', unlimited: true },
                { name: 'Rice', unit: '150g', calories: 200, protein: 4, carbs: 44, fat: 0, desc: 'Steamed white rice', unlimited: true },
                { name: 'Roti', unit: 'pc', calories: 70, protein: 2.5, carbs: 14, fat: 1, desc: 'Whole wheat roti', unlimited: true }, // Adjusted cal for 1 roti
                { name: 'Achaar', unit: 'srv', calories: 15, protein: 0, carbs: 3, fat: 0, desc: 'Pickle', unlimited: true },
            ],
            weekly: {
                0: { type: 'veg', items: [{ name: 'Aloo Sabzi', calories: 180, protein: 4, carbs: 34, fat: 6, rating: 4.0, desc: 'Potato curry' }] },
                1: { type: 'choice', veg: { name: 'Paneer Sabzi', calories: 220, rating: 4.2 }, nonVeg: { name: 'Chicken Curry', calories: 280, rating: 4.4 } },
                2: { type: 'choice', veg: { name: 'Mix Veg', calories: 160, rating: 3.9 }, nonVeg: { name: 'Egg Curry', calories: 200, rating: 4.1 } },
                3: { type: 'veg', items: [{ name: 'Rajma', calories: 240, protein: 14, carbs: 42, fat: 4, rating: 4.3, desc: 'Kidney beans' }] },
                4: { type: 'choice', veg: { name: 'Aloo Gobi', calories: 170, rating: 4.0 }, nonVeg: { name: 'Fish Curry', calories: 260, rating: 4.3 } },
                5: { type: 'choice', veg: { name: 'Chole', calories: 240, rating: 4.5 }, nonVeg: { name: 'Chicken Masala', calories: 300, rating: 4.6 } },
                6: { type: 'choice', veg: { name: 'Paneer Butter Masala', calories: 280, rating: 4.7 }, nonVeg: { name: 'Mutton Curry', calories: 340, rating: 4.8 } },
            }
        },
        snack: {
            staples: [
                { name: 'Coffee', unit: 'cup', calories: 80, protein: 2, carbs: 12, fat: 3, desc: 'Hot coffee', unlimited: true },
                { name: 'Tea', unit: 'cup', calories: 60, protein: 2, carbs: 10, fat: 2, desc: 'Milk tea', unlimited: true },
            ],
            weekly: {
                0: { name: 'Samosa', calories: 240, rating: 4.3 },
                1: { name: 'Pakora', calories: 210, rating: 4.2 },
                2: { name: 'Bread Pakoda', calories: 220, rating: 4.1 },
                3: { name: 'Kachori', calories: 260, rating: 4.3 },
                4: { name: 'Cutlet', calories: 200, rating: 4.2 },
                5: { name: 'Vada Pav', calories: 290, rating: 4.6 },
                6: { name: 'Pani Puri', calories: 180, rating: 4.8 },
            }
        },
        dinner: {
            staples: [
                { name: 'Dal', unit: 'bowl', calories: 180, protein: 12, carbs: 28, fat: 3, desc: 'Yellow dal tadka', unlimited: true },
                { name: 'Rice', unit: '150g', calories: 200, protein: 4, carbs: 44, fat: 0, desc: 'Steamed white rice', unlimited: true },
                { name: 'Roti', unit: 'pc', calories: 70, protein: 2.5, carbs: 14, fat: 1, desc: 'Whole wheat roti', unlimited: true },
            ],
            weekly: {
                0: { type: 'veg', items: [{ name: 'Seasonal Sabzi', calories: 150, rating: 3.9 }] },
                1: { type: 'choice', veg: { name: 'Paneer Do Pyaza', calories: 240, rating: 4.1 }, nonVeg: { name: 'Chicken Curry', calories: 280, rating: 4.3 } },
                2: { type: 'veg', items: [{ name: 'Aloo Matar', calories: 180, rating: 4.0 }] },
                3: { type: 'veg', items: [{ name: 'Chana Masala', calories: 220, rating: 4.2 }] },
                4: { type: 'special', veg: { name: 'Veg Biryani', calories: 420, rating: 4.7 }, nonVeg: { name: 'Chicken Biryani', calories: 520, rating: 4.9 }, extras: [{ name: 'Raita', calories: 60 }] },
                5: { type: 'choice', veg: { name: 'Palak Paneer', calories: 240, rating: 4.4 }, nonVeg: { name: 'Egg Bhurji', calories: 220, rating: 4.2 } },
                6: { type: 'veg', items: [{ name: 'Dal Makhani', calories: 260, rating: 4.6 }] },
            }
        }
    };

    const updateQuantity = (itemName, delta) => {
        if (bookedMeals[selectedMeal] && selectedDay === todayIndex) return; // Prevent editing if already booked today

        const key = `${selectedMeal}-${itemName}`;
        setQuantities(prev => {
            const currentQty = prev[key] || 0;
            const newQty = Math.max(0, currentQty + delta);
            return { ...prev, [key]: newQty };
        });
    };

    const toggleMainItem = (itemName, type) => {
        if (bookedMeals[selectedMeal] && selectedDay === todayIndex) return;

        // For mains, we treat them as limited (0 or 1)
        // If it's a choice meal, we ensure mutually exclusive selection
        const menu = messMenu[selectedMeal];
        const special = menu.weekly[selectedDay];

        if (special && (special.type === 'choice' || special.type === 'special')) {
            const vegName = special.veg?.name;
            const nonVegName = special.nonVeg?.name;
            const vegKey = `${selectedMeal}-${vegName}`;
            const nonVegKey = `${selectedMeal}-${nonVegName}`;
            const itemKey = `${selectedMeal}-${itemName}`;

            setQuantities(prev => {
                const newState = { ...prev };

                // If selecting current item
                if (!newState[itemKey]) {
                    newState[itemKey] = 1;
                    // Deselect other option
                    if (itemName === vegName && nonVegName) newState[nonVegKey] = 0;
                    if (itemName === nonVegName && vegName) newState[vegKey] = 0;
                } else {
                    newState[itemKey] = 0;
                }
                return newState;
            });
        } else {
            // Simple toggle for single items
            const key = `${selectedMeal}-${itemName}`;
            setQuantities(prev => ({
                ...prev,
                [key]: prev[key] ? 0 : 1
            }));
        }
    };

    const handleConfirmMeal = () => {
        const itemsToLog = [];
        const menu = messMenu[selectedMeal];
        const special = menu.weekly[selectedDay];

        // Add staples
        menu.staples.forEach(staple => {
            const key = `${selectedMeal}-${staple.name}`;
            const qty = quantities[key] || 0;
            if (qty > 0) {
                itemsToLog.push({ ...staple, quantity: qty });
            }
        });

        // Add specials
        if (special) {
            if (special.type === 'choice' || special.type === 'special') {
                const vegKey = `${selectedMeal}-${special.veg?.name}`;
                const nonVegKey = `${selectedMeal}-${special.nonVeg?.name}`;

                if (quantities[vegKey]) itemsToLog.push({ ...special.veg, quantity: 1 });
                if (quantities[nonVegKey]) itemsToLog.push({ ...special.nonVeg, quantity: 1 });

                if (special.extras) {
                    special.extras.forEach(extra => {
                        if (quantities[vegKey] || quantities[nonVegKey]) {
                            itemsToLog.push({ ...extra, quantity: 1 });
                        }
                    });
                }
            } else if (special.name) { // Single item
                const key = `${selectedMeal}-${special.name}`;
                if (quantities[key]) itemsToLog.push({ ...special, quantity: 1 });
            } else if (special.items) { // Fixed list
                special.items.forEach(item => {
                    const key = `${selectedMeal}-${item.name}`;
                    if (quantities[key]) itemsToLog.push({ ...item, quantity: 1 });
                });
            }
        }

        // Log to tracker
        itemsToLog.forEach(item => {
            addFood(selectedMeal, {
                name: item.name,
                calories: item.calories * item.quantity,
                protein: item.protein * item.quantity,
                carbs: item.carbs * item.quantity,
                fat: item.fat * item.quantity || 0
            });
        });

        setBookedMeals({ ...bookedMeals, [selectedMeal]: true });
    };

    const renderStapleCounter = (item) => {
        const key = `${selectedMeal}-${item.name}`;
        const qty = quantities[key] || 0;
        const isBooked = bookedMeals[selectedMeal] && selectedDay === todayIndex;
        const isToday = selectedDay === todayIndex;

        return (
            <div
                key={item.name}
                style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '12px',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: qty > 0 ? '2px solid #2E7D32' : '1px solid #EEEEEE',
                    opacity: !isToday ? 0.8 : 1
                }}
            >
                <div>
                    <div style={{ fontWeight: '600', color: '#333', fontSize: '15px' }}>
                        {item.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#757575' }}>
                        {item.calories} Cal / {item.unit}
                    </div>
                </div>

                {isToday ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F5F5F5', borderRadius: '8px', padding: '4px' }}>
                        <button
                            onClick={() => updateQuantity(item.name, -1)}
                            disabled={isBooked || qty === 0}
                            style={{
                                width: '28px', height: '28px', borderRadius: '6px', border: 'none',
                                background: 'white', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)', cursor: isBooked ? 'default' : 'pointer'
                            }}
                        >
                            <Minus size={16} />
                        </button>
                        <span style={{ fontWeight: '700', minWidth: '20px', textAlign: 'center' }}>{qty}</span>
                        <button
                            onClick={() => updateQuantity(item.name, 1)}
                            disabled={isBooked}
                            style={{
                                width: '28px', height: '28px', borderRadius: '6px', border: 'none',
                                background: '#2E7D32', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)', cursor: isBooked ? 'default' : 'pointer'
                            }}
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                ) : (
                    <div style={{ fontSize: '13px', color: '#9E9E9E', fontStyle: 'italic' }}>
                        Available
                    </div>
                )}
            </div>
        );
    };

    const renderMainItem = (item) => {
        const key = `${selectedMeal}-${item.name}`;
        const isSelected = quantities[key] > 0;
        const isBooked = bookedMeals[selectedMeal] && selectedDay === todayIndex;
        const isToday = selectedDay === todayIndex;

        return (
            <div
                key={item.name}
                onClick={() => isToday && !isBooked && toggleMainItem(item.name)}
                style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '12px',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: isSelected ? '2px solid #2E7D32' : '1px solid #EEEEEE',
                    cursor: isToday && !isBooked ? 'pointer' : 'default',
                    opacity: !isToday ? 0.8 : 1
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {isToday && (
                        <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: isSelected ? '6px solid #2E7D32' : '2px solid #BDBDBD',
                            transition: 'all 0.2s'
                        }} />
                    )}
                    <div>
                        <div style={{ fontWeight: '600', color: '#333', fontSize: '15px' }}>
                            {item.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#757575', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {item.calories} Cal • Limited
                        </div>
                    </div>
                </div>
                {item.rating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#FFA000', fontWeight: '600' }}>
                        <Star size={14} fill="#FFA000" />
                        {item.rating}
                    </div>
                )}
            </div>
        );
    };

    const currentMenu = messMenu[selectedMeal];
    const dailySpecial = currentMenu.weekly[selectedDay];
    const isToday = selectedDay === todayIndex;

    return (
        <>
            <div style={{ padding: '20px', paddingBottom: '80px', background: '#FAFAFA', minHeight: '100vh' }}>
                {/* Header */}
                <div style={{ marginBottom: '20px' }}>
                    <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#333', marginBottom: '6px' }}>Mess Menu</h1>
                    <p style={{ fontSize: '14px', color: '#757575' }}>
                        Select a day to view the menu. Booking is only available for today.
                    </p>
                </div>

                {/* Date Navigation */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    overflowX: 'auto',
                    marginBottom: '24px',
                    paddingBottom: '8px',
                    scrollbarWidth: 'none'
                }}>
                    {days.map((day, idx) => (
                        <div
                            key={day}
                            onClick={() => setSelectedDay(idx)}
                            style={{
                                minWidth: '58px',
                                height: '75px',
                                borderRadius: '20px',
                                background: idx === selectedDay ? 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)' : 'white',
                                color: idx === selectedDay ? 'white' : '#757575',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                                boxShadow: idx === selectedDay ? '0 4px 12px rgba(46, 125, 50, 0.3)' : '0 2px 4px rgba(0,0,0,0.06)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: idx === selectedDay ? 'scale(1.05)' : 'scale(1)',
                                border: idx === todayIndex ? '2px solid #4CAF50' : 'none'
                            }}
                        >
                            <span style={{ fontSize: '12px', opacity: 0.8 }}>{day}</span>
                            <span style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px' }}>{dates[idx]}</span>
                            {idx === todayIndex && <div style={{ width: '4px', height: '4px', background: idx === selectedDay ? 'white' : '#4CAF50', borderRadius: '50%', marginTop: '4px' }}></div>}
                        </div>
                    ))}
                </div>

                {/* Meal Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '24px',
                    overflowX: 'auto',
                    paddingBottom: '8px',
                    scrollbarWidth: 'none'
                }}>
                    {['breakfast', 'lunch', 'snack', 'dinner'].map((meal) => (
                        <div
                            key={meal}
                            onClick={() => setSelectedMeal(meal)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                background: meal === selectedMeal ? '#2E7D32' : 'white',
                                color: meal === selectedMeal ? 'white' : '#757575',
                                fontWeight: '600',
                                fontSize: '14px',
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                boxShadow: meal === selectedMeal ? '0 4px 12px rgba(46, 125, 50, 0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: meal === selectedMeal ? 'scale(1.05)' : 'scale(1)'
                            }}
                        >
                            {meal}
                        </div>
                    ))}
                </div>

                {/* Menu Area */}
                <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '12px' }}>
                        {isToday ? 'Select Items to Eat' : `Menu for ${days[selectedDay]}`}
                    </h3>

                    {/* Staples */}
                    {currentMenu.staples.map(item => renderStapleCounter(item))}

                    {/* Specials */}
                    {dailySpecial.type === 'choice' || dailySpecial.type === 'special' ? (
                        <>
                            {renderMainItem(dailySpecial.veg)}
                            {dailySpecial.nonVeg && renderMainItem(dailySpecial.nonVeg)}
                            {dailySpecial.extras?.map(extra => (
                                <div key={extra.name} style={{ padding: '12px', background: '#FFF3E0', borderRadius: '12px', marginBottom: '10px', fontSize: '14px', color: '#F57C00', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Plus size={16} /> Includes: {extra.name}
                                </div>
                            ))}
                        </>
                    ) : dailySpecial.items ? (
                        dailySpecial.items.map(item => renderMainItem(item))
                    ) : (
                        renderMainItem(dailySpecial)
                    )}
                </div>

                {/* Action Button - Only for Today */}
                {isToday && (
                    !bookedMeals[selectedMeal] ? (
                        <button
                            onClick={handleConfirmMeal}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: '700',
                                fontSize: '16px',
                                marginTop: '20px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)'
                            }}
                        >
                            <Utensils size={20} />
                            Log Meal
                        </button>
                    ) : (
                        <div style={{
                            marginTop: '20px',
                            padding: '16px',
                            background: '#E8F5E9',
                            borderRadius: '12px',
                            color: '#2E7D32',
                            fontWeight: '600',
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}>
                            <Check size={20} />
                            Meal Logged Successfully!
                        </div>
                    )
                )}

                {!isToday && (
                    <div style={{
                        marginTop: '20px',
                        padding: '16px',
                        background: '#F5F5F5',
                        borderRadius: '12px',
                        color: '#757575',
                        textAlign: 'center',
                        fontSize: '14px'
                    }}>
                        Viewing menu for {days[selectedDay]}. <br />
                        Switch to <strong>Today</strong> to log your meal.
                    </div>
                )}
            </div>
            <BottomNav />
        </>
    );
}
