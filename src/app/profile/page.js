"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronRight, Scale, Activity, Flame, Droplets, Edit2, Save, X, Camera, Award, TrendingUp, Shield, Info, LogOut, Moon, Sun, Zap, Ruler } from 'lucide-react';
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
    Filler
} from 'chart.js';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import BottomNav from '../../components/BottomNav';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Get Gravatar URL from email
const getGravatarUrl = (email, size = 200) => {
    if (!email) return null;
    const crypto = require('crypto');
    const hash = crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex');
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
};

// Dynamic achievements based on user data
const getAchievements = (dailyStats, water, meals) => {
    const totalDays = dailyStats ? Object.keys(dailyStats).length : 0;
    const waterGoalMet = water?.current >= (water?.goal || 2000);
    const totalMeals = meals ? Object.values(meals).flat().length : 0;

    return [
        {
            id: 'firstDay',
            name: 'First Step',
            icon: '🌱',
            earned: totalDays >= 1,
            description: 'Track your first day'
        },
        {
            id: 'streak3',
            name: '3 Day Streak',
            icon: '🔥',
            earned: totalDays >= 3,
            description: 'Use the app for 3 days'
        },
        {
            id: 'streak7',
            name: 'Week Warrior',
            icon: '⚡',
            earned: totalDays >= 7,
            description: 'Use the app for 7 days'
        },
        {
            id: 'water',
            name: 'Hydration Hero',
            icon: '💧',
            earned: waterGoalMet,
            description: 'Meet your daily water goal'
        },
        {
            id: 'meals5',
            name: 'Meal Logger',
            icon: '🥗',
            earned: totalMeals >= 5,
            description: 'Log 5 meals'
        },
        {
            id: 'meals20',
            name: 'Meal Master',
            icon: '🏆',
            earned: totalMeals >= 20,
            description: 'Log 20 meals'
        },
    ];
};

// BMI categories
const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight', color: '#3B82F6', bg: '#EFF6FF' };
    if (bmi < 25) return { label: 'Normal', color: '#22C55E', bg: '#F0FDF4' };
    if (bmi < 30) return { label: 'Overweight', color: '#F59E0B', bg: '#FFFBEB' };
    return { label: 'Obese', color: '#EF4444', bg: '#FEF2F2' };
};

export default function Profile() {
    const router = useRouter();
    const { user, updateProfile, preferences, togglePreference, resetApp, dailyStats, water, meals } = useUser();
    const { currentUser, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...user });
    const [activeTab, setActiveTab] = useState('stats');

    // Get profile picture (Google photo > Gravatar > null)
    const profilePicUrl = currentUser?.photoURL || (user.email ? `https://www.gravatar.com/avatar/${user.email.toLowerCase().trim().split('').reduce((a, c) => (((a << 5) - a) + c.charCodeAt(0)) | 0, 0).toString(16).padStart(8, '0')}?s=200&d=identicon` : null);

    // Get dynamic achievements
    const achievements = getAchievements(dailyStats, water, meals);

    useEffect(() => { setFormData({ ...user }); }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'email' || name === 'name' ? value : Number(value)
        }));
    };

    const handleSave = () => {
        Object.keys(formData).forEach(key => updateProfile(key, formData[key]));
        if (formData.weight && formData.height) {
            const heightInM = formData.height / 100;
            updateProfile('bmi', (formData.weight / (heightInM * heightInM)).toFixed(1));
        }
        setIsEditing(false);
    };

    const handleCancel = () => { setFormData({ ...user }); setIsEditing(false); };

    const getChartData = () => {
        if (!dailyStats || Object.keys(dailyStats).length === 0) {
            return { labels: ['Current'], data: [formData.weight] };
        }
        const dates = Object.keys(dailyStats).sort().slice(-7);
        return {
            labels: dates.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
            data: dates.map(d => dailyStats[d].weight || 0)
        };
    };

    const chartData = getChartData();
    // Safe BMI calculation - handle edge cases
    const calculateBMI = (weight, height) => {
        if (!weight || !height || height === 0) return 0;
        const heightInM = height / 100;
        return weight / (heightInM * heightInM);
    };
    const bmi = parseFloat(user.bmi) || calculateBMI(formData.weight, formData.height);
    const bmiInfo = getBMICategory(bmi || 0);

    const data = {
        labels: chartData.labels,
        datasets: [{
            label: 'Weight (kg)',
            data: chartData.data,
            borderColor: '#1DB954',
            backgroundColor: 'rgba(29, 185, 84, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: '#1DB954',
            pointBorderColor: 'white',
            pointBorderWidth: 2,
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { display: false },
            x: { grid: { display: false }, ticks: { color: '#9CA3AF', font: { size: 10 } } }
        }
    };

    const settingsItems = [
        { icon: Shield, label: 'Privacy Policy', path: '/privacy', color: '#6366F1' },
        { icon: Info, label: 'About Aahar', path: '/about', color: '#0EA5E9' },
    ];

    return (
        <>
            <div style={{ padding: '20px', paddingBottom: '100px', background: 'linear-gradient(180deg, #f0fdf4 0%, #f8fafc 100%)', minHeight: '100vh' }}>

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a' }}>Profile</h1>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {isEditing ? (
                            <>
                                <motion.button whileTap={{ scale: 0.9 }} onClick={handleCancel}
                                    style={{ padding: '10px', borderRadius: '12px', background: '#FEE2E2', color: '#DC2626', border: 'none', cursor: 'pointer' }}>
                                    <X size={20} />
                                </motion.button>
                                <motion.button whileTap={{ scale: 0.9 }} onClick={handleSave}
                                    style={{ padding: '10px', borderRadius: '12px', background: '#D1FAE5', color: '#059669', border: 'none', cursor: 'pointer' }}>
                                    <Save size={20} />
                                </motion.button>
                            </>
                        ) : (
                            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsEditing(true)}
                                style={{ padding: '10px', borderRadius: '12px', background: 'white', color: '#1e293b', border: '1px solid #e2e8f0', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <Edit2 size={20} />
                            </motion.button>
                        )}
                    </div>
                </motion.div>

                {/* Profile Card with Gradient Border */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    style={{
                        background: 'linear-gradient(135deg, #1DB954, #16a34a, #0EA5E9)',
                        borderRadius: '24px', padding: '3px', marginBottom: '20px',
                        boxShadow: '0 10px 40px rgba(29, 185, 84, 0.2)'
                    }}>
                    <div style={{ background: 'white', borderRadius: '22px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: '90px', height: '90px', borderRadius: '20px',
                                background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '3px solid white', boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                                overflow: 'hidden'
                            }}>
                                {profilePicUrl ? (
                                    <img
                                        src={profilePicUrl}
                                        alt="Profile"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                    />
                                ) : null}
                                <User size={44} color="#22c55e" style={{ display: profilePicUrl ? 'none' : 'block' }} />
                            </div>
                            <motion.div whileHover={{ scale: 1.1 }} style={{
                                position: 'absolute', bottom: '-4px', right: '-4px',
                                background: 'linear-gradient(135deg, #1DB954, #16a34a)',
                                borderRadius: '10px', padding: '8px', border: '3px solid white', cursor: 'pointer'
                            }}>
                                <Camera size={14} color="white" />
                            </motion.div>
                        </div>
                        <div style={{ flex: 1 }}>
                            {isEditing ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                                        style={{ fontSize: '18px', fontWeight: '700', border: '2px solid #e2e8f0', borderRadius: '10px', padding: '8px 12px', width: '100%', outline: 'none' }} />
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                                        style={{ fontSize: '14px', color: '#64748b', border: '2px solid #e2e8f0', borderRadius: '10px', padding: '8px 12px', width: '100%', outline: 'none' }} />
                                </div>
                            ) : (
                                <>
                                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>{user.name}</h2>
                                    <p style={{ color: '#64748b', fontSize: '14px' }}>{user.email}</p>
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                        <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '8px', background: '#F0FDF4', color: '#16a34a', fontWeight: '600' }}>
                                            🔥 {dailyStats ? Object.keys(dailyStats).length : 0} Day{dailyStats && Object.keys(dailyStats).length !== 1 ? 's' : ''}
                                        </span>
                                        {currentUser && (
                                            <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', fontWeight: '600' }}>
                                                ✓ Verified
                                            </span>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Achievement Badges */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    style={{ background: 'white', borderRadius: '20px', padding: '18px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Award size={16} color="#F59E0B" /> Achievements
                    </h3>
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                        {achievements.map(badge => (
                            <motion.div key={badge.id} animate={{ opacity: badge.earned ? 1 : 0.4, scale: badge.earned ? 1 : 0.95 }}
                                style={{
                                    minWidth: '75px', padding: '12px 10px', borderRadius: '14px', textAlign: 'center',
                                    background: badge.earned ? '#FEF3C7' : '#f1f5f9', border: badge.earned ? '2px solid #F59E0B' : '2px solid #e2e8f0'
                                }}>
                                <span style={{ fontSize: '26px' }}>{badge.icon}</span>
                                <div style={{ fontSize: '9px', fontWeight: '600', color: badge.earned ? '#92400E' : '#94a3b8', marginTop: '4px' }}>{badge.name}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                    {/* Weight */}
                    <div style={{ background: 'white', borderRadius: '18px', padding: '18px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                            <Scale size={22} color="#22C55E" />
                        </div>
                        {isEditing ? (
                            <input type="number" name="weight" value={formData.weight} onChange={handleInputChange}
                                style={{ width: '70px', textAlign: 'center', border: '2px solid #e2e8f0', borderRadius: '10px', padding: '6px', fontSize: '20px', fontWeight: '700' }} />
                        ) : (
                            <div style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a' }}>{user.weight}<span style={{ fontSize: '14px', fontWeight: '500', color: '#94a3b8' }}> kg</span></div>
                        )}
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Current Weight</div>
                    </div>

                    {/* Height */}
                    <div style={{ background: 'white', borderRadius: '18px', padding: '18px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                            <Ruler size={22} color="#8B5CF6" />
                        </div>
                        {isEditing ? (
                            <input type="number" name="height" value={formData.height} onChange={handleInputChange}
                                style={{ width: '70px', textAlign: 'center', border: '2px solid #e2e8f0', borderRadius: '10px', padding: '6px', fontSize: '20px', fontWeight: '700' }} />
                        ) : (
                            <div style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a' }}>{user.height || '-'}<span style={{ fontSize: '14px', fontWeight: '500', color: '#94a3b8' }}> cm</span></div>
                        )}
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Height</div>
                    </div>

                    {/* BMI with Gauge */}
                    <div style={{ background: 'white', borderRadius: '18px', padding: '18px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: bmiInfo.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                            <Scale size={22} color={bmiInfo.color} />
                        </div>
                        <div style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a' }}>{bmi > 0 ? bmi.toFixed(1) : '-'}</div>
                        <div style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '6px', background: bmiInfo.bg, color: bmiInfo.color, fontWeight: '600', display: 'inline-block', marginTop: '4px' }}>
                            {bmi > 0 ? bmiInfo.label : 'N/A'}
                        </div>
                    </div>

                    {/* Calorie Goal */}
                    <div style={{ background: 'white', borderRadius: '18px', padding: '18px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                            <Flame size={22} color="#F97316" />
                        </div>
                        {isEditing ? (
                            <input type="number" name="goalCalories" value={formData.goalCalories} onChange={handleInputChange}
                                style={{ width: '80px', textAlign: 'center', border: '2px solid #e2e8f0', borderRadius: '10px', padding: '6px', fontSize: '20px', fontWeight: '700' }} />
                        ) : (
                            <div style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a' }}>{user.goalCalories}<span style={{ fontSize: '12px', fontWeight: '500', color: '#94a3b8' }}> kcal</span></div>
                        )}
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Daily Goal</div>
                    </div>

                    {/* Water Goal */}
                    <div style={{ background: 'white', borderRadius: '18px', padding: '18px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                            <Droplets size={22} color="#3B82F6" />
                        </div>
                        {isEditing ? (
                            <input type="number" name="goalWater" value={formData.goalWater} onChange={handleInputChange}
                                style={{ width: '80px', textAlign: 'center', border: '2px solid #e2e8f0', borderRadius: '10px', padding: '6px', fontSize: '20px', fontWeight: '700' }} />
                        ) : (
                            <div style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a' }}>{(user.goalWater / 1000).toFixed(1)}<span style={{ fontSize: '14px', fontWeight: '500', color: '#94a3b8' }}> L</span></div>
                        )}
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Water Goal</div>
                    </div>
                </motion.div>

                {/* Weight Trend Chart */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    style={{ background: 'white', borderRadius: '20px', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <TrendingUp size={16} color="#22C55E" /> Weight Trend
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '16px' }}>Your recent progress</p>
                    <div style={{ height: '160px' }}>
                        <Line data={data} options={options} />
                    </div>
                </motion.div>

                {/* Dietary Preferences */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    style={{ background: 'white', borderRadius: '20px', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>🥗 Dietary Preferences</h3>
                    {Object.entries(preferences).map(([key, value]) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f1f5f9' }}>
                            <span style={{ textTransform: 'capitalize', fontWeight: '500', color: '#334155' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <motion.div whileTap={{ scale: 0.95 }} onClick={() => togglePreference(key)}
                                style={{
                                    width: '50px', height: '28px', borderRadius: '14px', position: 'relative', cursor: 'pointer',
                                    background: value ? 'linear-gradient(135deg, #1DB954, #16a34a)' : '#e2e8f0', transition: 'background 0.3s'
                                }}>
                                <motion.div animate={{ left: value ? '24px' : '4px' }}
                                    style={{ width: '22px', height: '22px', background: 'white', borderRadius: '50%', position: 'absolute', top: '3px', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }} />
                            </motion.div>
                        </div>
                    ))}
                </motion.div>

                {/* Settings */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    style={{ background: 'white', borderRadius: '20px', padding: '8px 16px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    {settingsItems.map((item, idx) => (
                        <motion.div key={item.label} whileTap={{ scale: 0.98 }} onClick={() => router.push(item.path)}
                            style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '16px 4px', borderBottom: idx < settingsItems.length - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer'
                            }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <item.icon size={18} color={item.color} />
                                </div>
                                <span style={{ fontSize: '15px', color: '#1e293b', fontWeight: '500' }}>{item.label}</span>
                            </div>
                            <ChevronRight size={18} color="#94a3b8" />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Logout Button */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ textAlign: 'center' }}>
                    {currentUser && (
                        <motion.button whileTap={{ scale: 0.95 }}
                            onClick={async () => { if (confirm('Logout?')) { await logout(); window.location.href = '/login'; } }}
                            style={{
                                color: 'white', background: 'linear-gradient(135deg, #1DB954, #16a34a)', border: 'none', padding: '14px 28px',
                                borderRadius: '14px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto 12px',
                                boxShadow: '0 4px 15px rgba(29, 185, 84, 0.3)'
                            }}>
                            <LogOut size={18} /> Logout
                        </motion.button>
                    )}
                    <motion.button whileTap={{ scale: 0.95 }}
                        onClick={async () => { if (confirm('Reset all data?')) { resetApp(); if (currentUser) await logout(); window.location.href = '/login'; } }}
                        style={{
                            color: '#EF4444', background: '#FEF2F2', border: 'none', padding: '14px 28px',
                            borderRadius: '14px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto'
                        }}>
                        <LogOut size={18} /> Reset All Data
                    </motion.button>
                </motion.div>
            </div>
            <BottomNav />
        </>
    );
}
