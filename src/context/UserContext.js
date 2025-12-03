"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
    // Default empty state
    const defaultUser = {
        name: '',
        email: '',
        weight: 0,
        height: 0,
        age: 0,
        gender: 'male',
        activityLevel: 'sedentary',
        bmi: 0,
        goalCalories: 0,
        goalWater: 0,
    };

    const [user, setUser] = useState(defaultUser);
    const [isOnboarded, setIsOnboarded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [meals, setMeals] = useState({
        breakfast: [],
        lunch: [],
        snack: [],
        dinner: []
    });

    const [water, setWater] = useState({
        current: 0,
        history: []
    });

    const [preferences, setPreferences] = useState({
        vegetarian: true,
        glutenFree: false,
        dairyFree: true,
        lowCarb: false,
    });

    // New: Daily Stats History
    const [dailyStats, setDailyStats] = useState({});
    const [lastActiveDate, setLastActiveDate] = useState('');

    // Load from LocalStorage on mount
    useEffect(() => {
        const loadData = () => {
            try {
                const savedUser = localStorage.getItem('aahar_user');
                const savedOnboarded = localStorage.getItem('aahar_onboarded');
                const savedMeals = localStorage.getItem('aahar_meals');
                const savedWater = localStorage.getItem('aahar_water');
                const savedPreferences = localStorage.getItem('aahar_preferences');
                const savedDailyStats = localStorage.getItem('aahar_daily_stats');
                const savedLastDate = localStorage.getItem('aahar_last_date');

                if (savedUser) setUser(JSON.parse(savedUser));
                if (savedOnboarded) setIsOnboarded(JSON.parse(savedOnboarded));
                if (savedMeals) setMeals(JSON.parse(savedMeals));
                if (savedWater) setWater(JSON.parse(savedWater));
                if (savedPreferences) setPreferences(JSON.parse(savedPreferences));
                if (savedDailyStats) setDailyStats(JSON.parse(savedDailyStats));

                // Check for new day
                const today = new Date().toISOString().split('T')[0];
                if (savedLastDate && savedLastDate !== today) {
                    // Reset daily trackers for new day
                    setWater({ current: 0, history: [] });
                    setMeals({ breakfast: [], lunch: [], snack: [], dinner: [] });
                }
                setLastActiveDate(today);

            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // Save to LocalStorage whenever state changes
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('aahar_user', JSON.stringify(user));
            localStorage.setItem('aahar_onboarded', JSON.stringify(isOnboarded));
            localStorage.setItem('aahar_meals', JSON.stringify(meals));
            localStorage.setItem('aahar_water', JSON.stringify(water));
            localStorage.setItem('aahar_preferences', JSON.stringify(preferences));
            localStorage.setItem('aahar_daily_stats', JSON.stringify(dailyStats));
            localStorage.setItem('aahar_last_date', lastActiveDate);
        }
    }, [user, isOnboarded, meals, water, preferences, dailyStats, lastActiveDate, isLoading]);

    // Sync current state to dailyStats whenever it changes
    useEffect(() => {
        if (!lastActiveDate || isLoading) return;

        setDailyStats(prev => ({
            ...prev,
            [lastActiveDate]: {
                weight: user.weight,
                water: water.current
            }
        }));
    }, [water.current, user.weight, lastActiveDate, isLoading]);

    // Automatic Date Check (Periodically & On Focus)
    useEffect(() => {
        if (isLoading || !lastActiveDate) return;

        const checkDate = () => {
            const today = new Date().toISOString().split('T')[0];
            if (today !== lastActiveDate) {
                console.log("New day detected! Resetting...");
                setLastActiveDate(today);
                setWater({ current: 0, history: [] });
                setMeals({ breakfast: [], lunch: [], snack: [], dinner: [] });
            }
        };

        // Check every minute
        const interval = setInterval(checkDate, 60000);

        // Check when app comes to foreground
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkDate();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [lastActiveDate, isLoading]);


    const addWater = (amount) => {
        const today = new Date().toISOString().split('T')[0];
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (today !== lastActiveDate) {
            // New Day Detected! Reset and start fresh.
            setLastActiveDate(today);
            setMeals({ breakfast: [], lunch: [], snack: [], dinner: [] });
            setWater({
                current: amount,
                history: [{ amount, time }]
            });
        } else {
            // Same Day
            setWater(prev => ({
                current: Math.min(prev.current + amount, user.goalWater * 1.5),
                history: [{ amount, time }, ...prev.history]
            }));
        }
    };

    const removeWater = (index) => {
        setWater(prev => {
            const removedAmount = prev.history[index].amount;
            const newCurrent = Math.max(0, prev.current - removedAmount);
            return {
                current: newCurrent,
                history: prev.history.filter((_, i) => i !== index)
            };
        });
    };

    const addFood = (mealType, foodItem) => {
        const today = new Date().toISOString().split('T')[0];

        if (today !== lastActiveDate) {
            // New Day Detected! Reset and start fresh.
            setLastActiveDate(today);
            setWater({ current: 0, history: [] });
            setMeals({
                breakfast: [], lunch: [], snack: [], dinner: [],
                [mealType]: [foodItem]
            });
        } else {
            setMeals(prev => ({
                ...prev,
                [mealType]: [...prev[mealType], foodItem]
            }));
        }
    };

    const removeFood = (mealType, index) => {
        setMeals(prev => ({
            ...prev,
            [mealType]: prev[mealType].filter((_, i) => i !== index)
        }));
    };

    const updateProfile = (key, value) => {
        setUser(prev => ({ ...prev, [key]: value }));
    };

    const togglePreference = (key) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const completeOnboarding = (userData) => {
        setUser(userData);
        setIsOnboarded(true);
        const today = new Date().toISOString().split('T')[0];
        setLastActiveDate(today);
    };

    const resetApp = () => {
        setUser(defaultUser);
        setIsOnboarded(false);
        setMeals({ breakfast: [], lunch: [], snack: [], dinner: [] });
        setWater({ current: 0, history: [] });
        setDailyStats({});
        setLastActiveDate('');
        localStorage.clear();
    };

    return (
        <UserContext.Provider value={{
            user,
            isOnboarded,
            isLoading,
            meals,
            water,
            preferences,
            dailyStats,
            addWater,
            removeWater,
            addFood,
            removeFood,
            updateProfile,
            togglePreference,
            completeOnboarding,
            resetApp
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
