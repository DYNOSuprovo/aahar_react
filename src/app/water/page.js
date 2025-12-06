"use client";
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import GoalSuccessModal from '../../components/GoalSuccessModal';
import { Minus, Plus, Droplets, X } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useUser } from '../../context/UserContext';
import BottomNav from '../../components/BottomNav';
import { SlideUp, FadeIn } from '../../components/Animations';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function Water() {
    const { user, water, addWater, removeWater, dailyStats, isLoading } = useUser();
    const [customAmount, setCustomAmount] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Track state for popup logic
    const wasGoalReachedRef = useRef(false);
    const isFirstLoadRef = useRef(true);

    // Calculate effective goal and max limit
    const effectiveGoal = user.goalWater > 0 ? user.goalWater : 2000;
    const maxWater = effectiveGoal * 1.5;
    const isMaxReached = water.current >= maxWater;

    const handleAddWater = (amount) => {
        if (isAdding || isMaxReached) return;
        setIsAdding(true);
        addWater(amount);
        setTimeout(() => setIsAdding(false), 500);
    };

    const handleCustomAdd = () => {
        if (customAmount && !isNaN(customAmount)) {
            handleAddWater(parseInt(customAmount));
            setCustomAmount('');
        }
    };

    // Chart Data
    const getChartData = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const labels = [];
        const dataPoints = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            labels.push(i === 0 ? 'Today' : days[d.getDay()]);

            if (i === 0) {
                dataPoints.push(water.current);
            } else {
                dataPoints.push(dailyStats?.[dateStr]?.water || 0);
            }
        }
        return { labels, data: dataPoints };
    };

    const chartData = getChartData();

    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Water Intake (ml)',
                data: chartData.data,
                borderColor: '#1DB954',
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                tension: 0.4, // Smooth curve
                pointBackgroundColor: '#1DB954',
                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 4,
            },
        ],
    };

    // Dynamic Chart Max
    const maxDataPoint = Math.max(...chartData.data);
    const graphMax = Math.max(2500, maxDataPoint * 1.1); // Scale to data (min 2500), not forcing goal height

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: graphMax,
                ticks: { color: '#9E9E9E', font: { size: 10 } }, // Auto step size
                grid: { borderDash: [4, 4], color: '#EEEEEE' },
                border: { display: false }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#9E9E9E', font: { size: 10 } },
                border: { display: false }
            }
        }
    };

    const percentage = Math.min(100, Math.round((water.current / effectiveGoal) * 100));
    const displayPercentage = Math.round((water.current / effectiveGoal) * 100);

    // Monitor for Goal Achievement
    useEffect(() => {
        if (isLoading) return;

        const isGoalReached = water.current >= effectiveGoal;

        if (isFirstLoadRef.current) {
            // Sync ref on first load without triggering popup
            wasGoalReachedRef.current = isGoalReached;
            isFirstLoadRef.current = false;
            return;
        }

        // Trigger popup if we just crossed the threshold
        if (!wasGoalReachedRef.current && isGoalReached && water.current > 0) {
            setShowSuccessModal(true);
        }

        wasGoalReachedRef.current = isGoalReached;
    }, [water.current, effectiveGoal, isLoading]);

    return (
        <>
            <div style={{ padding: '20px', paddingBottom: '80px', background: '#FAFAFA', minHeight: '100vh' }}>
                <SlideUp delay={0}>
                    <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center', color: '#333' }}>Water Tracker</h1>
                </SlideUp>

                {/* Main Card */}
                <SlideUp delay={0.1}>
                    <div style={{
                        background: 'linear-gradient(135deg, #42A5F5 0%, #2962FF 100%)',
                        borderRadius: '24px',
                        padding: '32px 24px',
                        color: 'white',
                        textAlign: 'center',
                        marginBottom: '24px',
                        boxShadow: '0 10px 30px rgba(41, 98, 255, 0.25)'
                    }}>
                        {/* Water Tank - Circular with Animation */}
                        <div style={{
                            position: 'relative',
                            width: '180px',
                            height: '180px',
                            margin: '0 auto 24px auto'
                        }}>
                            {/* Circular Tank Container */}
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '50%',
                                border: '6px solid rgba(255,255,255,0.3)',
                                background: 'rgba(255,255,255,0.1)',
                                overflow: 'hidden'
                            }}>
                                {/* Animated Water Level */}
                                <motion.div
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        background: 'linear-gradient(to top, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.35) 100%)'
                                    }}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${percentage}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                >
                                    {/* Wave Animation at top */}
                                    <motion.div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '12px',
                                            background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
                                            borderRadius: '100% 100% 0 0'
                                        }}
                                        animate={{ y: [0, -3, 0] }}
                                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                                    />
                                </motion.div>
                            </div>

                            {/* Center Content */}
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1
                            }}>
                                <motion.div
                                    animate={isAdding ? { scale: [1, 1.2, 1] } : {}}
                                    transition={{ duration: 0.3 }}
                                >
                                    <motion.span
                                        key={water.current}
                                        initial={{ scale: 1.2 }}
                                        animate={{ scale: 1 }}
                                        style={{
                                            fontSize: '32px',
                                            fontWeight: 'bold',
                                            display: 'block',
                                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        {water.current}
                                    </motion.span>
                                </motion.div>
                                <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '4px' }}>of {effectiveGoal}ml</div>
                                <div style={{ fontSize: '18px', fontWeight: '600', marginTop: '6px' }}>{displayPercentage}%</div>
                            </div>
                        </div>

                        {/* Quick Add Buttons */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '10px',
                            marginBottom: '16px'
                        }}>
                            {[250, 500, 750, 1000].map(amount => (
                                <button
                                    key={amount}
                                    onClick={() => handleAddWater(amount)}
                                    disabled={isAdding || isMaxReached}
                                    style={{
                                        padding: '12px 8px',
                                        borderRadius: '12px',
                                        background: isAdding ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                                        color: isAdding ? 'rgba(255,255,255,0.5)' : 'white',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        fontWeight: '600',
                                        fontSize: '13px',
                                        cursor: (isAdding || isMaxReached) ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s',
                                        backdropFilter: 'blur(10px)',
                                        opacity: isMaxReached ? 0.5 : 1
                                    }}
                                    onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                                    onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                                >
                                    +{amount}ml
                                </button>
                            ))}
                        </div>

                        {/* Custom Amount Input */}
                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'stretch',
                            width: '100%'
                        }}>
                            <input
                                type="number"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                placeholder="Custom amount (ml)"
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    background: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    fontSize: '14px',
                                    backdropFilter: 'blur(10px)',
                                    outline: 'none'
                                }}
                            />
                            <button
                                onClick={handleCustomAdd}
                                disabled={isAdding || isMaxReached}
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    background: isAdding ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.95)',
                                    color: isAdding ? '#90CAF9' : '#2962FF',
                                    border: 'none',
                                    fontWeight: '700',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    cursor: (isAdding || isMaxReached) ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                    opacity: isMaxReached ? 0.5 : 1
                                }}
                            >
                                <Plus size={18} /> {isAdding ? '...' : (isMaxReached ? 'Max' : 'Add')}
                            </button>
                        </div>
                    </div>
                </SlideUp>

                {/* Daily Intake Log */}
                <SlideUp delay={0.2}>
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '20px',
                        marginBottom: '24px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px'
                        }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>Today's Log</h3>
                            <button style={{
                                background: 'none',
                                border: 'none',
                                color: '#2962FF',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}>View All</button>
                        </div>

                        {water.history.length > 0 ? (
                            water.history.map((entry, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '14px',
                                    background: '#F8F9FA',
                                    borderRadius: '12px',
                                    marginBottom: '10px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #42A5F5 0%, #2962FF 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Droplets size={20} color="white" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600', fontSize: '15px', color: '#333' }}>{entry.amount} ml</div>
                                            <div style={{ fontSize: '12px', color: '#9E9E9E', marginTop: '2px' }}>{entry.time}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeWater(idx)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#9E9E9E',
                                            cursor: 'pointer',
                                            padding: '8px',
                                            transition: 'color 0.2s'
                                        }}
                                        onMouseOver={(e) => e.target.style.color = '#F44336'}
                                        onMouseOut={(e) => e.target.style.color = '#9E9E9E'}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div style={{
                                textAlign: 'center',
                                padding: '40px 20px',
                                color: '#9E9E9E'
                            }}>
                                <Droplets size={48} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
                                <p style={{ fontSize: '14px' }}>No water logged yet today</p>
                                <p style={{ fontSize: '12px', marginTop: '4px' }}>Start tracking your hydration!</p>
                            </div>
                        )}
                    </div>
                </SlideUp>

                {/* Weekly Overview */}
                <SlideUp delay={0.3}>
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                    }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>Weekly Overview</h3>
                        <div style={{ height: '220px' }}>
                            <Line data={data} options={options} />
                        </div>
                    </div>
                </SlideUp>
            </div>
            <GoalSuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
            />
            <BottomNav />
        </>
    );
}
