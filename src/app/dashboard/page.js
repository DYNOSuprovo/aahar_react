"use client";
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useUser } from '../../context/UserContext';
import { ChevronLeft, ChevronRight, Calendar, Plus, Minus, Search, X, Utensils, Trash2 } from 'lucide-react';
import { searchFood, analyzeMeal } from '../../lib/api';

const CountUp = ({ end, duration = 1500 }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let startTime;
        let animationFrame;
        const animate = (time) => {
            if (!startTime) startTime = time;
            const progress = time - startTime;
            // Ease out cubic
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

export default function Dashboard() {
    const { user, meals, addFood, removeFood, updateFoodQuantity, preferences } = useUser();
    const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
    const [selectedMealType, setSelectedMealType] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Quantity Selection State
    const [selectedItemForQuant, setSelectedItemForQuant] = useState(null);
    const [itemQuantity, setItemQuantity] = useState(1);

    // Calculate totals
    const totalCalories = meals.breakfast.reduce((acc, item) => acc + parseInt(item.calories), 0) +
        meals.lunch.reduce((acc, item) => acc + parseInt(item.calories), 0) +
        meals.snack.reduce((acc, item) => acc + parseInt(item.calories), 0) +
        meals.dinner.reduce((acc, item) => acc + parseInt(item.calories), 0);

    // Helper to calculate total for a nutrient
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

        // Safe parsing helper
        const getVal = (key) => parseFloat(selectedItemForQuant[key]) || 0;

        addFood(selectedMealType, {
            name: selectedItemForQuant["Dish Name"],
            calories: Math.round(getVal("Calories (kcal)") * multiplier),
            protein: (getVal("Protein (g)") * multiplier).toFixed(1),
            carbs: (getVal("Carbs (g)") * multiplier).toFixed(1),
            fat: (getVal("Fat (g)") * multiplier).toFixed(1),
            quantity: multiplier, // Store quantity for reference
            servingSize: selectedItemForQuant["Serving Size"],
            // Store base values for future updates
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


    // Smart filter based on dietary preferences - optimized with useCallback
    const filterByPreferences = useCallback((results) => {
        if (!results || results.length === 0) return [];

        let filtered = results;

        // Non-vegetarian indicators
        const nonVegKeywords = ['chicken', 'mutton', 'fish', 'egg', 'prawn', 'meat', 'lamb', 'beef', 'pork'];

        // Gluten-containing grains
        const glutenKeywords = ['wheat', 'maida', 'atta', 'roti', 'naan', 'paratha', 'bread'];

        // Dairy indicators
        const dairyKeywords = ['paneer', 'cheese', 'milk', 'curd', 'yogurt', 'ghee', 'butter', 'cream'];

        if (preferences.vegetarian) {
            filtered = filtered.filter(item => {
                const dishName = item["Dish Name"]?.toLowerCase() || '';
                const category = item["Category"]?.toLowerCase() || '';
                return !nonVegKeywords.some(keyword =>
                    dishName.includes(keyword) || category.includes(keyword)
                );
            });
        }

        if (preferences.glutenFree) {
            filtered = filtered.filter(item => {
                const dishName = item["Dish Name"]?.toLowerCase() || '';
                return !glutenKeywords.some(keyword => dishName.includes(keyword));
            });
        }

        if (preferences.dairyFree) {
            filtered = filtered.filter(item => {
                const dishName = item["Dish Name"]?.toLowerCase() || '';
                return !dairyKeywords.some(keyword => dishName.includes(keyword));
            });
        }

        if (preferences.lowCarb) {
            filtered = filtered.filter(item => {
                const carbs = parseFloat(item["Carbs (g)"]) || 0;
                return carbs < 15; // Low carb threshold: less than 15g per serving
            });
        }

        return filtered;
    }, [preferences]);

    // Debounced Search with dietary filtering
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length > 2) {
                setIsSearching(true);
                const results = await searchFood(searchTerm);
                // Apply dietary preferences filter
                const filteredResults = filterByPreferences(results);
                setSearchResults(filteredResults);
                setIsSearching(false);
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, preferences]);

    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setAnalysis(null);
        try {
            const allMeals = [...meals.breakfast, ...meals.lunch, ...meals.snack, ...meals.dinner];
            if (allMeals.length === 0) {
                setAnalysis("You haven't logged any meals yet. Please add some food items so I can analyze your intake.");
                setIsAnalyzing(false);
                return;
            }

            const dishNames = allMeals.map(m => m.name);
            const result = await analyzeMeal(dishNames);
            setAnalysis(result.analysis);
        } catch (error) {
            console.error("Analysis failed", error);
            setAnalysis("Sorry, I couldn't analyze your intake right now. Please check your internet connection.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const MealSection = ({ title, items, type }) => (
        <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A1A1A' }}>{title}</h3>
                <button
                    onClick={() => openAddFood(type)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#2E7D32',
                        fontWeight: '600',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer'
                    }}
                >
                    <Plus size={16} /> Add Food
                </button>
            </div>

            {items.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {items.map((item, idx) => (
                        <div key={idx} style={{
                            border: '1px solid #EEEEEE',
                            borderRadius: '12px',
                            padding: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            background: 'white',
                            position: 'relative'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: '#F5F5F5',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Utensils size={20} color="#757575" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '500', fontSize: '14px', color: '#1A1A1A' }}>{item.name}</div>
                                <div style={{ fontSize: '12px', color: '#757575' }}>
                                    {item.calories} cal
                                    {item.servingSize && ` • ${(item.quantity || 1) !== 1 ? `${item.quantity}x ` : ''}${item.servingSize}`}
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '60px', height: '6px', background: '#F5F5F5', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${user.goalCalories ? Math.min(100, (item.calories / user.goalCalories) * 100) : 0}%`,
                                        height: '100%',
                                        background: '#2E7D32'
                                    }}></div>
                                </div>
                                <span style={{ fontSize: '12px', color: '#757575', width: '30px', textAlign: 'right' }}>
                                    {user.goalCalories ? Math.round((item.calories / user.goalCalories) * 100) : 0}%
                                </span>
                            </div>

                            {/* Quantity Controls in List */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '8px' }}>
                                <button
                                    onClick={() => updateFoodQuantity(type, idx, Math.max(0.5, (item.quantity || 1) - 0.5))}
                                    style={{
                                        border: '1px solid #E0E0E0', background: 'white', borderRadius: '4px',
                                        width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', color: '#757575'
                                    }}
                                >
                                    <Minus size={14} />
                                </button>
                                <span style={{ fontSize: '13px', fontWeight: '500', minWidth: '24px', textAlign: 'center' }}>
                                    {item.quantity || 1}
                                </span>
                                <button
                                    onClick={() => updateFoodQuantity(type, idx, (item.quantity || 1) + 0.5)}
                                    style={{
                                        border: '1px solid #2E7D32', background: '#E8F5E9', borderRadius: '4px',
                                        width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', color: '#2E7D32'
                                    }}
                                >
                                    <Plus size={14} />
                                </button>
                            </div>

                            <button
                                onClick={() => removeFood(type, idx)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#D32F2F',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ fontSize: '14px', color: '#9E9E9E', fontStyle: 'italic', padding: '10px 0' }}>
                    No food logged for {title}.
                </div>
            )}
        </div >
    );

    return (
        <div style={{ padding: '20px', paddingBottom: '80px', background: 'white', minHeight: '100vh' }}>
            {/* Header */}
            <div className="animate-slide-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <ChevronLeft size={24} color="#757575" cursor="pointer" />
                <h1 style={{ fontSize: '18px', fontWeight: 'bold' }}>Today</h1>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <ChevronRight size={24} color="#757575" cursor="pointer" />
                    <Calendar size={24} color="#757575" cursor="pointer" />
                </div>
            </div>

            {/* Calories Progress */}
            <div className="animate-slide-up delay-100" style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1A1A1A' }}>Calories Progress</h2>
                <div className="card" style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', padding: '24px' }}>
                    <div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1A1A1A' }}>
                            <CountUp end={user.goalCalories} />
                        </div>
                        <div style={{ fontSize: '13px', color: '#757575', marginTop: '4px' }}>Goal</div>
                    </div>
                    <div style={{ width: '1px', background: '#EEEEEE' }}></div>
                    <div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2E7D32' }}>
                            <CountUp end={totalCalories} />
                        </div>
                        <div style={{ fontSize: '13px', color: '#757575', marginTop: '4px' }}>Logged</div>
                    </div>
                    <div style={{ width: '1px', background: '#EEEEEE' }}></div>
                    <div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: remainingCalories < 0 ? '#D32F2F' : '#1A1A1A' }}>
                            {remainingCalories}
                        </div>
                        <div style={{ fontSize: '13px', color: '#757575', marginTop: '4px' }}>Remaining</div>
                    </div>
                </div>
            </div>

            {/* Macronutrients */}
            <div className="animate-slide-up delay-200" style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1A1A1A' }}>Macronutrients</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Fat */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ width: '50px', fontSize: '14px', fontWeight: '500' }}>Fat</span>
                        <div style={{ flex: 1, height: '8px', background: '#F5F5F5', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${Math.min(100, (totalFat / 70) * 100)}%`, height: '100%', background: '#2E7D32', transition: 'width 1s ease-out' }}></div>
                        </div>
                        <span style={{ fontSize: '12px', color: '#757575', width: '60px', textAlign: 'right' }}>{totalFat} / 70 g</span>
                    </div>
                    {/* Carbs */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ width: '50px', fontSize: '14px', fontWeight: '500' }}>Carbs</span>
                        <div style={{ flex: 1, height: '8px', background: '#F5F5F5', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${Math.min(100, (totalCarbs / 275) * 100)}%`, height: '100%', background: '#2E7D32', transition: 'width 1s ease-out' }}></div>
                        </div>
                        <span style={{ fontSize: '12px', color: '#757575', width: '60px', textAlign: 'right' }}>{totalCarbs} / 275 g</span>
                    </div>
                    {/* Protein */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ width: '50px', fontSize: '14px', fontWeight: '500' }}>Protein</span>
                        <div style={{ flex: 1, height: '8px', background: '#F5F5F5', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${Math.min(100, (totalProtein / 100) * 100)}%`, height: '100%', background: '#2E7D32', transition: 'width 1s ease-out' }}></div>
                        </div>
                        <span style={{ fontSize: '12px', color: '#757575', width: '60px', textAlign: 'right' }}>{totalProtein} / 100 g</span>
                    </div>
                </div>
            </div>

            {/* Meals */}
            <div className="animate-slide-up delay-300">
                <MealSection title="Breakfast" items={meals.breakfast} type="breakfast" />
                <MealSection title="Lunch" items={meals.lunch} type="lunch" />
                <MealSection title="Snack" items={meals.snack} type="snack" />
                <MealSection title="Dinner" items={meals.dinner} type="dinner" />
            </div>

            {/* AI Analysis Section */}
            <div className="animate-slide-up delay-300" style={{ marginTop: '32px', marginBottom: '24px' }}>
                <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="btn-interactive"
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        cursor: isAnalyzing ? 'wait' : 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 15px rgba(118, 75, 162, 0.3)'
                    }}
                >
                    {isAnalyzing ? 'Analyzing...' : (
                        <>
                            <span>✨</span> Analyze Daily Intake
                        </>
                    )}
                </button>

                {analysis && (
                    <div style={{
                        marginTop: '16px',
                        padding: '20px',
                        background: '#F3E5F5',
                        borderRadius: '16px',
                        border: '1px solid #E1BEE7',
                        color: '#4A148C',
                        lineHeight: '1.5'
                    }}>
                        <h3 style={{ fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>🤖</span> AaharAI Insights
                        </h3>
                        <p style={{ fontSize: '14px' }}>{analysis}</p>
                    </div>
                )}
            </div>

            {/* Add Food Modal */}
            {isAddFoodOpen && (
                <div className="animate-fade-in" style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 10000,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                }}>
                    <div className="animate-slide-up" style={{
                        background: 'white',
                        borderRadius: '24px 24px 0 0',
                        padding: '24px',
                        height: '85vh',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Add to {selectedMealType}</h3>
                            <button onClick={() => {
                                setIsAddFoodOpen(false);
                                setSelectedItemForQuant(null);
                            }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        {selectedItemForQuant ? (
                            <div className="animate-scale-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{
                                    background: '#F8F9FA',
                                    borderRadius: '16px',
                                    padding: '20px',
                                    marginBottom: '24px',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: '#1A1A1A' }}>
                                        {selectedItemForQuant["Dish Name"]}
                                    </div>
                                    <div style={{ color: '#757575', fontSize: '14px' }}>
                                        {selectedItemForQuant["Calories (kcal)"]} cal per serving ({selectedItemForQuant["Serving Size"]})
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginBottom: '32px' }}>
                                    <button
                                        onClick={() => setItemQuantity(q => Math.max(0.5, q - 0.5))}
                                        style={{
                                            width: '48px', height: '48px', borderRadius: '12px', border: 'none',
                                            background: '#EEEEEE', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', fontSize: '24px'
                                        }}
                                    >
                                        <Minus size={24} />
                                    </button>

                                    <div style={{ textAlign: 'center', minWidth: '80px' }}>
                                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2E7D32' }}>{itemQuantity}</div>
                                        <div style={{ fontSize: '12px', color: '#757575' }}>Servings</div>
                                    </div>

                                    <button
                                        onClick={() => setItemQuantity(q => q + 0.5)}
                                        style={{
                                            width: '48px', height: '48px', borderRadius: '12px', border: 'none',
                                            background: '#2E7D32', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Plus size={24} />
                                    </button>
                                </div>

                                <div style={{
                                    background: '#E8F5E9',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    marginBottom: 'auto'
                                }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontWeight: 'bold', color: '#2E7D32' }}>{Math.round(selectedItemForQuant["Calories (kcal)"] * itemQuantity)}</div>
                                        <div style={{ fontSize: '12px', color: '#4CAF50' }}>Calories</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontWeight: 'bold', color: '#2E7D32' }}>{(selectedItemForQuant["Protein (g)"] * itemQuantity).toFixed(1)}g</div>
                                        <div style={{ fontSize: '12px', color: '#4CAF50' }}>Protein</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontWeight: 'bold', color: '#2E7D32' }}>{(selectedItemForQuant["Carbs (g)"] * itemQuantity).toFixed(1)}g</div>
                                        <div style={{ fontSize: '12px', color: '#4CAF50' }}>Carbs</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                    <button
                                        onClick={() => setSelectedItemForQuant(null)}
                                        style={{
                                            flex: 1, padding: '16px', borderRadius: '16px', border: 'none',
                                            background: '#F5F5F5', color: '#757575', fontWeight: '600', cursor: 'pointer'
                                        }}
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={confirmAddFood}
                                        style={{
                                            flex: 2, padding: '16px', borderRadius: '16px', border: 'none',
                                            background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
                                            color: 'white', fontWeight: 'bold', cursor: 'pointer',
                                            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)'
                                        }}
                                    >
                                        Add Food
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: '#F5F5F5',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    marginBottom: '20px'
                                }}>
                                    <Search size={20} color="#757575" style={{ marginRight: '8px' }} />
                                    <input
                                        type="text"
                                        placeholder="Search food (e.g., Roti, Dal)"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{
                                            border: 'none',
                                            background: 'transparent',
                                            outline: 'none',
                                            flex: 1,
                                            fontSize: '16px'
                                        }}
                                        autoFocus
                                    />
                                </div>

                                {/* Active Filters Badge */}
                                {(preferences.vegetarian || preferences.glutenFree || preferences.dairyFree || preferences.lowCarb) && (
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '8px',
                                        marginBottom: '16px'
                                    }}>
                                        <span style={{ fontSize: '12px', color: '#757575', marginRight: '4px' }}>Filters:</span>
                                        {preferences.vegetarian && (
                                            <span style={{
                                                background: '#E8F5E9',
                                                color: '#2E7D32',
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }}>🌱 Vegetarian</span>
                                        )}
                                        {preferences.glutenFree && (
                                            <span style={{
                                                background: '#FFF3E0',
                                                color: '#F57C00',
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }}>🌾 Gluten Free</span>
                                        )}
                                        {preferences.dairyFree && (
                                            <span style={{
                                                background: '#E3F2FD',
                                                color: '#1976D2',
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }}>🥛 Dairy Free</span>
                                        )}
                                        {preferences.lowCarb && (
                                            <span style={{
                                                background: '#F3E5F5',
                                                color: '#7B1FA2',
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }}>⚡ Low Carb</span>
                                        )}
                                    </div>
                                )}

                                <div style={{ flex: 1, overflowY: 'auto' }}>
                                    {isSearching && (
                                        <div style={{ textAlign: 'center', color: '#757575', padding: '20px' }}>Searching...</div>
                                    )}
                                    {!isSearching && searchResults.map((item, idx) => (
                                        <div key={idx} onClick={() => handleFoodClick(item)} style={{
                                            padding: '16px 0',
                                            borderBottom: '1px solid #EEEEEE',
                                            cursor: 'pointer'
                                        }}>
                                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item["Dish Name"]}</div>
                                            <div style={{ fontSize: '14px', color: '#757575' }}>
                                                {item["Calories (kcal)"]} cal • {item["Serving Size"]}
                                            </div>
                                        </div>
                                    ))}
                                    {!isSearching && searchTerm.length > 2 && searchResults.length === 0 && (
                                        <div style={{ textAlign: 'center', color: '#9E9E9E', marginTop: '20px' }}>
                                            No results found.
                                        </div>
                                    )}
                                    {!searchTerm && (
                                        <div style={{ textAlign: 'center', color: '#9E9E9E', marginTop: '20px' }}>
                                            Type to search...
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
