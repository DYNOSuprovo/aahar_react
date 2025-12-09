"use client";
import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { ChevronLeft, ChevronRight, Calendar, Plus, Minus, Search, X, Utensils, Trash2, Flame, Zap, Target, TrendingUp, Lightbulb } from 'lucide-react';
import { searchFood, analyzeMeal } from '../../lib/api';
import BottomNav from '../../components/BottomNav';

// Circular Progress Ring Component
const CalorieRing = ({ current, goal, size = 200 }) => {
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const percentage = Math.min((current / goal) * 100, 100);
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getColor = () => {
        if (percentage >= 100) return '#ef4444';
        if (percentage >= 80) return '#f97316';
        return '#1DB954';
    };

    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={getColor()}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>
            {/* Center content */}
            <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    style={{ fontSize: '36px', fontWeight: '800', color: '#1a1a1a' }}
                >
                    {current}
                </motion.div>
                <div style={{ fontSize: '13px', color: '#6B7280' }}>of {goal} cal</div>
                <div style={{
                    marginTop: '4px',
                    padding: '4px 12px',
                    background: `${getColor()}15`,
                    borderRadius: '12px',
                    color: getColor(),
                    fontSize: '12px',
                    fontWeight: '600'
                }}>
                    {Math.round(percentage)}%
                </div>
            </div>
        </div>
    );
};

// Animated Counter
const CountUp = ({ end, duration = 1500 }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let startTime;
        let animationFrame;
        const animate = (time) => {
            if (!startTime) startTime = time;
            const progress = time - startTime;
            const percentage = 1 - Math.pow(1 - Math.min(progress / duration, 1), 3);
            setCount(Math.floor(end * percentage));
            if (progress < duration) {
                animationFrame = requestAnimationFrame(animate);
            }
        };
        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);
    return <span>{count}</span>;
};

// Greeting based on time
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', emoji: '🌅' };
    if (hour < 17) return { text: 'Good afternoon', emoji: '☀️' };
    if (hour < 21) return { text: 'Good evening', emoji: '🌆' };
    return { text: 'Good night', emoji: '🌙' };
};

// Daily tips
const dailyTips = [
    { icon: '💧', tip: 'Drink at least 8 glasses of water today!' },
    { icon: '🥗', tip: 'Try adding more vegetables to your meals.' },
    { icon: '🏃', tip: 'A 30-minute walk burns around 150 calories.' },
    { icon: '😴', tip: 'Good sleep helps maintain healthy weight.' },
    { icon: '🍎', tip: 'An apple a day keeps the doctor away!' }
];

export default function Dashboard() {
    const { user, meals, addFood, removeFood, updateFoodQuantity, preferences } = useUser();
    const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
    const [selectedMealType, setSelectedMealType] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedItemForQuant, setSelectedItemForQuant] = useState(null);
    const [itemQuantity, setItemQuantity] = useState(1);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);

    const greeting = getGreeting();
    const currentTip = dailyTips[currentTipIndex];

    // Rotate tips
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTipIndex(prev => (prev + 1) % dailyTips.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Calculate totals
    const totalCalories = meals.breakfast.reduce((acc, item) => acc + parseInt(item.calories), 0) +
        meals.lunch.reduce((acc, item) => acc + parseInt(item.calories), 0) +
        meals.snack.reduce((acc, item) => acc + parseInt(item.calories), 0) +
        meals.dinner.reduce((acc, item) => acc + parseInt(item.calories), 0);

    const calculateTotal = (nutrient) => {
        const allMeals = [...meals.breakfast, ...meals.lunch, ...meals.snack, ...meals.dinner];
        return allMeals.reduce((acc, item) => acc + (parseFloat(item[nutrient]) || 0), 0);
    };

    const totalProtein = calculateTotal('protein');
    const totalCarbs = calculateTotal('carbs');
    const totalFat = calculateTotal('fat');
    const remainingCalories = user.goalCalories - totalCalories;

    const openAddFood = (mealType) => {
        setSelectedMealType(mealType);
        setIsAddFoodOpen(true);
        setSearchTerm('');
    };

    const handleFoodClick = (item) => {
        setSelectedItemForQuant(item);
        setItemQuantity(1);
    };

    const confirmAddFood = () => {
        if (!selectedItemForQuant) return;
        const multiplier = itemQuantity;
        const getVal = (key) => parseFloat(selectedItemForQuant[key]) || 0;

        addFood(selectedMealType, {
            name: selectedItemForQuant["Dish Name"],
            calories: Math.round(getVal("Calories (kcal)") * multiplier),
            protein: (getVal("Protein (g)") * multiplier).toFixed(1),
            carbs: (getVal("Carbs (g)") * multiplier).toFixed(1),
            fat: (getVal("Fat (g)") * multiplier).toFixed(1),
            quantity: multiplier,
            servingSize: selectedItemForQuant["Serving Size"],
            baseCalories: getVal("Calories (kcal)"),
            baseProtein: getVal("Protein (g)"),
            baseCarbs: getVal("Carbs (g)"),
            baseFat: getVal("Fat (g)")
        });

        setIsAddFoodOpen(false);
        setSelectedItemForQuant(null);
        setItemQuantity(1);
        setSearchTerm('');
    };

    const filterByPreferences = useCallback((results) => {
        if (!results || results.length === 0) return [];
        let filtered = results;
        const nonVegKeywords = ['chicken', 'mutton', 'fish', 'egg', 'prawn', 'meat', 'lamb', 'beef', 'pork'];
        const glutenKeywords = ['wheat', 'maida', 'atta', 'roti', 'naan', 'paratha', 'bread'];
        const dairyKeywords = ['paneer', 'cheese', 'milk', 'curd', 'yogurt', 'ghee', 'butter', 'cream'];

        if (preferences.vegetarian) {
            filtered = filtered.filter(item => {
                const dishName = item["Dish Name"]?.toLowerCase() || '';
                const category = item["Category"]?.toLowerCase() || '';
                return !nonVegKeywords.some(keyword => dishName.includes(keyword) || category.includes(keyword));
            });
        }
        if (preferences.glutenFree) {
            filtered = filtered.filter(item => !glutenKeywords.some(keyword => (item["Dish Name"]?.toLowerCase() || '').includes(keyword)));
        }
        if (preferences.dairyFree) {
            filtered = filtered.filter(item => !dairyKeywords.some(keyword => (item["Dish Name"]?.toLowerCase() || '').includes(keyword)));
        }
        if (preferences.lowCarb) {
            filtered = filtered.filter(item => (parseFloat(item["Carbs (g)"]) || 0) < 15);
        }
        return filtered;
    }, [preferences]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length > 2) {
                setIsSearching(true);
                const results = await searchFood(searchTerm);
                // Show all results regardless of preferences when searching explicitly
                setSearchResults(results);
                setIsSearching(false);
            } else {
                setSearchResults([]);
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, preferences, filterByPreferences]);

    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setAnalysis(null);
        try {
            const allMeals = [...meals.breakfast, ...meals.lunch, ...meals.snack, ...meals.dinner];
            if (allMeals.length === 0) {
                setAnalysis({ type: 'warning', text: "You haven't logged any meals yet. Please add some food items so I can analyze your intake." });
                setIsAnalyzing(false);
                return;
            }
            const dishNames = allMeals.map(m => m.name);
            const result = await analyzeMeal(dishNames);

            // Check for error strings in successful response
            if (!result.analysis || result.analysis.startsWith("An error occurred") || result.analysis.startsWith("Sorry")) {
                throw new Error("AI Generation Failed");
            }

            setAnalysis({ type: 'success', text: result.analysis });
        } catch (error) {
            setAnalysis({ type: 'error', text: "I'm having trouble connecting to my brain right now. Please try again later! 🧠🔄" });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const mealIcons = { breakfast: '🍳', lunch: '🍛', snack: '🍿', dinner: '🍲' };

    const MealSection = ({ title, items, type }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
                background: 'white',
                borderRadius: '20px',
                padding: '20px',
                marginBottom: '16px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>{mealIcons[type]}</span>
                    <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1a1a1a' }}>{title}</h3>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openAddFood(type)}
                    style={{
                        background: 'linear-gradient(135deg, #1DB954 0%, #0d7a3a 100%)',
                        border: 'none',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontWeight: '600',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(29, 185, 84, 0.25)'
                    }}
                >
                    <Plus size={16} /> Add
                </motion.button>
            </div>

            {items.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {items.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            style={{
                                background: '#F9FAFB',
                                borderRadius: '14px',
                                padding: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}
                        >
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Utensils size={20} color="#1DB954" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '600', fontSize: '15px', color: '#1a1a1a' }}>{item.name}</div>
                                <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
                                    {item.calories} cal • {item.servingSize || '1 serving'}
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeFood(type, idx)}
                                style={{
                                    background: '#FEE2E2',
                                    border: 'none',
                                    borderRadius: '10px',
                                    padding: '8px',
                                    cursor: 'pointer',
                                    color: '#EF4444'
                                }}
                            >
                                <Trash2 size={16} />
                            </motion.button>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '24px',
                    background: '#F9FAFB',
                    borderRadius: '14px',
                    color: '#9CA3AF'
                }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🍽️</div>
                    <div style={{ fontSize: '14px' }}>No food logged yet</div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>Tap "Add" to log your {title.toLowerCase()}</div>
                </div>
            )}
        </motion.div>
    );

    return (
        <div style={{ background: '#F3F4F6', minHeight: '100vh', paddingBottom: '100px' }}>
            {/* Header with Greeting */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    background: 'linear-gradient(135deg, #1DB954 0%, #0d7a3a 100%)',
                    padding: '24px 20px 80px 20px',
                    borderRadius: '0 0 32px 32px'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '4px' }}>
                            {greeting.emoji} {greeting.text}
                        </div>
                        <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '700' }}>
                            {user.name || 'User'}!
                        </h1>
                    </div>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '18px'
                        }}
                    >
                        {(user.name || 'U')[0].toUpperCase()}
                    </motion.div>
                </div>

                {/* Quick Stats */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    {[
                        { icon: Target, label: 'Goal', value: `${user.goalCalories} cal` },
                        { icon: Flame, label: 'Burned', value: '0 cal' },
                        { icon: Zap, label: 'Streak', value: '7 days' }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            style={{
                                flex: 1,
                                background: 'rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '16px',
                                padding: '14px 12px',
                                textAlign: 'center'
                            }}
                        >
                            <stat.icon size={20} color="white" style={{ marginBottom: '6px' }} />
                            <div style={{ color: 'white', fontWeight: '700', fontSize: '14px' }}>{stat.value}</div>
                            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Calorie Ring Card */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                    margin: '-50px 20px 20px 20px',
                    background: 'white',
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                    <CalorieRing current={totalCalories} goal={user.goalCalories} size={160} />
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ color: '#6B7280', fontSize: '13px' }}>Remaining</div>
                            <div style={{
                                fontSize: '28px',
                                fontWeight: '800',
                                color: remainingCalories < 0 ? '#EF4444' : '#1DB954'
                            }}>
                                {remainingCalories} cal
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div>
                                <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>{Math.round(totalProtein)}g</div>
                                <div style={{ fontSize: '11px', color: '#6B7280' }}>Protein</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>{Math.round(totalCarbs)}g</div>
                                <div style={{ fontSize: '11px', color: '#6B7280' }}>Carbs</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>{Math.round(totalFat)}g</div>
                                <div style={{ fontSize: '11px', color: '#6B7280' }}>Fat</div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Daily Tip Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                    margin: '0 20px 20px 20px',
                    background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}
            >
                <Lightbulb size={24} color="#D97706" />
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentTipIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{ flex: 1 }}
                    >
                        <div style={{ fontSize: '14px', color: '#92400E', fontWeight: '500' }}>
                            {currentTip.icon} {currentTip.tip}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* Meals Section */}
            <div style={{ padding: '0 20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' }}>
                    Today's Meals
                </h2>
                <MealSection title="Breakfast" items={meals.breakfast} type="breakfast" />
                <MealSection title="Lunch" items={meals.lunch} type="lunch" />
                <MealSection title="Snack" items={meals.snack} type="snack" />
                <MealSection title="Dinner" items={meals.dinner} type="dinner" />
            </div>

            {/* AI Analysis Button */}
            <div style={{ padding: '0 20px', marginTop: '24px' }}>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    style={{
                        width: '100%',
                        padding: '18px',
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        fontWeight: '700',
                        fontSize: '16px',
                        cursor: isAnalyzing ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        boxShadow: '0 8px 24px rgba(139, 92, 246, 0.35)'
                    }}
                >
                    {isAnalyzing ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}
                        />
                    ) : (
                        <>✨ Analyze My Day with AI</>
                    )}
                </motion.button>

                {analysis && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            marginTop: '16px',
                            padding: '20px',
                            background: analysis.type === 'error' ? '#FEE2E2' : (analysis.type === 'warning' ? '#FEF3C7' : 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)'),
                            borderRadius: '16px',
                            color: analysis.type === 'error' ? '#B91C1C' : (analysis.type === 'warning' ? '#92400E' : '#5B21B6'),
                            border: analysis.type === 'error' ? '1px solid #FECACA' : 'none'
                        }}
                    >
                        <div style={{ fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {analysis.type === 'error' ? '⚠️ Only Human Here' : (analysis.type === 'warning' ? '🍽️ Plate Empty' : '🤖 AI Insights')}
                        </div>
                        <p style={{ fontSize: '14px', lineHeight: '1.6' }}>{analysis.text || analysis}</p>
                    </motion.div>
                )}
            </div>

            {/* Add Food Modal - Using existing logic */}
            <AnimatePresence>
                {isAddFoodOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 10000,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end'
                        }}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            style={{
                                background: 'white',
                                borderRadius: '24px 24px 0 0',
                                padding: '24px',
                                height: '85vh',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ fontSize: '20px', fontWeight: '700' }}>
                                    {mealIcons[selectedMealType]} Add to {selectedMealType}
                                </h3>
                                <button onClick={() => { setIsAddFoodOpen(false); setSelectedItemForQuant(null); }}
                                    style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            {selectedItemForQuant ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ background: '#F9FAFB', borderRadius: '16px', padding: '24px', textAlign: 'center', marginBottom: '24px' }}>
                                        <div style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>
                                            {selectedItemForQuant["Dish Name"]}
                                        </div>
                                        <div style={{ color: '#6B7280', fontSize: '14px' }}>
                                            {selectedItemForQuant["Calories (kcal)"]} cal per serving
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', marginBottom: '32px' }}>
                                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setItemQuantity(q => Math.max(0.5, q - 0.5))}
                                            style={{ width: '56px', height: '56px', borderRadius: '50%', border: 'none', background: '#F3F4F6', fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Minus size={24} />
                                        </motion.button>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '48px', fontWeight: '800', color: '#1DB954' }}>{itemQuantity}</div>
                                            <div style={{ fontSize: '14px', color: '#6B7280' }}>servings</div>
                                        </div>
                                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setItemQuantity(q => q + 0.5)}
                                            style={{ width: '56px', height: '56px', borderRadius: '50%', border: 'none', background: '#1DB954', color: 'white', fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Plus size={24} />
                                        </motion.button>
                                    </div>

                                    <div style={{ background: '#E8F5E9', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-around', marginBottom: 'auto' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontWeight: '700', color: '#1DB954', fontSize: '18px' }}>{Math.round(selectedItemForQuant["Calories (kcal)"] * itemQuantity)}</div>
                                            <div style={{ fontSize: '12px', color: '#16a34a' }}>Calories</div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontWeight: '700', color: '#1DB954', fontSize: '18px' }}>{(selectedItemForQuant["Protein (g)"] * itemQuantity).toFixed(1)}g</div>
                                            <div style={{ fontSize: '12px', color: '#16a34a' }}>Protein</div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontWeight: '700', color: '#1DB954', fontSize: '18px' }}>{(selectedItemForQuant["Carbs (g)"] * itemQuantity).toFixed(1)}g</div>
                                            <div style={{ fontSize: '12px', color: '#16a34a' }}>Carbs</div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                        <button onClick={() => setSelectedItemForQuant(null)} style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', background: '#F3F4F6', fontWeight: '600', cursor: 'pointer' }}>Back</button>
                                        <motion.button whileTap={{ scale: 0.98 }} onClick={confirmAddFood} style={{ flex: 2, padding: '16px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #1DB954 0%, #0d7a3a 100%)', color: 'white', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(29, 185, 84, 0.35)' }}>Add Food</motion.button>
                                    </div>
                                </motion.div>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', background: '#F3F4F6', borderRadius: '14px', padding: '14px', marginBottom: '20px' }}>
                                        <Search size={20} color="#6B7280" style={{ marginRight: '10px' }} />
                                        <input type="text" placeholder="Search for food..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontSize: '16px' }} autoFocus />
                                    </div>
                                    <div style={{ flex: 1, overflowY: 'auto' }}>
                                        {isSearching && <div style={{ textAlign: 'center', color: '#6B7280', padding: '20px' }}>Searching...</div>}
                                        {!isSearching && searchResults.map((item, idx) => (
                                            <motion.div key={idx} whileHover={{ background: '#F9FAFB' }} onClick={() => handleFoodClick(item)}
                                                style={{ padding: '16px', borderBottom: '1px solid #F3F4F6', cursor: 'pointer', borderRadius: '12px' }}>
                                                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item["Dish Name"]}</div>
                                                <div style={{ fontSize: '14px', color: '#6B7280' }}>{item["Calories (kcal)"]} cal • {item["Serving Size"]}</div>
                                            </motion.div>
                                        ))}
                                        {!isSearching && searchResults.length >= 100 && (
                                            <div style={{ textAlign: 'center', padding: '12px', fontSize: '12px', color: '#6B7280', fontStyle: 'italic' }}>
                                                Showing top 100 matches. Refine search to see more.
                                            </div>
                                        )}
                                        {!isSearching && searchTerm.length > 2 && searchResults.length === 0 && (
                                            <div style={{ textAlign: 'center', color: '#9CA3AF', marginTop: '40px' }}>
                                                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
                                                No results found
                                            </div>
                                        )}
                                        {!searchTerm && (
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                                                    🔥 Popular Foods
                                                </div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                                                    {[
                                                        { name: 'Roti', emoji: '🫓', cal: 71, tags: [] },
                                                        { name: 'Rice', emoji: '🍚', cal: 130, tags: [] },
                                                        { name: 'Dal', emoji: '🍲', cal: 104, tags: [] },
                                                        { name: 'Paneer', emoji: '🧀', cal: 265, tags: ['dairy'] },
                                                        { name: 'Egg', emoji: '🥚', cal: 78, tags: ['nonveg'] },
                                                        { name: 'Idli', emoji: '🥟', cal: 39, tags: [] },
                                                        { name: 'Dosa', emoji: '🥞', cal: 168, tags: [] },
                                                        { name: 'Paratha', emoji: '🫓', cal: 260, tags: [] },
                                                        { name: 'Poha', emoji: '🍛', cal: 180, tags: [] },
                                                        { name: 'Upma', emoji: '🥣', cal: 165, tags: [] },
                                                        { name: 'Chicken Curry', emoji: '🍗', cal: 243, tags: ['nonveg'] },
                                                        { name: 'Curd', emoji: '🥛', cal: 98, tags: ['dairy'] }
                                                    ]
                                                        .filter(food => {
                                                            if (preferences.vegetarian && food.tags.includes('nonveg')) return false;
                                                            if (preferences.dairyFree && food.tags.includes('dairy')) return false;
                                                            return true;
                                                        })
                                                        .map((food, idx) => (
                                                            <motion.button
                                                                key={idx}
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => setSearchTerm(food.name)}
                                                                style={{
                                                                    padding: '8px 14px',
                                                                    background: '#E8F5E9',
                                                                    border: 'none',
                                                                    borderRadius: '20px',
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '6px',
                                                                    fontSize: '13px',
                                                                    fontWeight: '500',
                                                                    color: '#1a1a1a'
                                                                }}
                                                            >
                                                                <span>{food.emoji}</span>
                                                                <span>{food.name}</span>
                                                                <span style={{ color: '#6B7280', fontSize: '11px' }}>{food.cal}cal</span>
                                                            </motion.button>
                                                        ))}
                                                </div>
                                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                                                    🥗 Healthy Choices
                                                </div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                                                    {[
                                                        { name: 'Sprouts Salad', emoji: '🥗', cal: 82, tags: [] },
                                                        { name: 'Oats', emoji: '🥣', cal: 150, tags: [] },
                                                        { name: 'Green Salad', emoji: '🥬', cal: 45, tags: [] },
                                                        { name: 'Fruit Bowl', emoji: '🍎', cal: 120, tags: [] },
                                                        { name: 'Moong Dal', emoji: '🫘', cal: 88, tags: [] },
                                                        { name: 'Buttermilk', emoji: '🥛', cal: 40, tags: ['dairy'] }
                                                    ]
                                                        .filter(food => {
                                                            if (preferences.dairyFree && food.tags.includes('dairy')) return false;
                                                            return true;
                                                        })
                                                        .map((food, idx) => (
                                                            <motion.button
                                                                key={idx}
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => setSearchTerm(food.name)}
                                                                style={{
                                                                    padding: '8px 14px',
                                                                    background: '#FEF3C7',
                                                                    border: 'none',
                                                                    borderRadius: '20px',
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '6px',
                                                                    fontSize: '13px',
                                                                    fontWeight: '500',
                                                                    color: '#1a1a1a'
                                                                }}
                                                            >
                                                                <span>{food.emoji}</span>
                                                                <span>{food.name}</span>
                                                                <span style={{ color: '#6B7280', fontSize: '11px' }}>{food.cal}cal</span>
                                                            </motion.button>
                                                        ))}
                                                </div>
                                                <div style={{ textAlign: 'center', color: '#9CA3AF', marginTop: '16px', fontSize: '13px' }}>
                                                    or type to search 3500+ foods
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <BottomNav />
        </div>
    );
}
