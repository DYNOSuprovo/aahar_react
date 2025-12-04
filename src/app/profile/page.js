"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Bell, ChevronRight, Scale, Activity, Flame, Droplets, Edit2, Save, X, Camera } from 'lucide-react';
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
import BottomNav from '../../components/BottomNav';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Profile() {
    const router = useRouter();
    const { user, updateProfile, preferences, togglePreference, resetApp, dailyStats } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...user });

    useEffect(() => {
        setFormData({ ...user });
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'email' || name === 'name' ? value : Number(value)
        }));
    };

    const handleSave = () => {
        // Update all fields
        Object.keys(formData).forEach(key => {
            updateProfile(key, formData[key]);
        });

        // Recalculate BMI if weight or height changed
        if (formData.weight && formData.height) {
            const heightInM = formData.height / 100;
            const newBmi = (formData.weight / (heightInM * heightInM)).toFixed(1);
            updateProfile('bmi', newBmi);
        }

        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({ ...user });
        setIsEditing(false);
    };

    // Chart Data - Dynamic based on history
    const getChartData = () => {
        if (!dailyStats || Object.keys(dailyStats).length === 0) {
            return { labels: ['Current'], data: [formData.weight] };
        }

        const dates = Object.keys(dailyStats).sort();
        const recentDates = dates.slice(-7); // Last 7 entries

        const labels = recentDates.map(date => {
            const d = new Date(date);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        const dataPoints = recentDates.map(date => dailyStats[date].weight || 0);

        return { labels, data: dataPoints };
    };

    const chartData = getChartData();

    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Weight (kg)',
                data: chartData.data,
                borderColor: '#2E7D32',
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#2E7D32',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            y: { display: false, min: Math.min(60, formData.weight - 5) },
            x: { grid: { display: false } }
        }
    };

    return (
        <>
            <div style={{ padding: '20px', paddingBottom: '100px', background: '#FAFAFA', minHeight: '100vh' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>Profile</h1>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleCancel}
                                    style={{
                                        padding: '8px',
                                        borderRadius: '50%',
                                        background: '#FFEBEE',
                                        color: '#D32F2F',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <X size={20} />
                                </button>
                                <button
                                    onClick={handleSave}
                                    style={{
                                        padding: '8px',
                                        borderRadius: '50%',
                                        background: '#E8F5E9',
                                        color: '#2E7D32',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Save size={20} />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                style={{
                                    padding: '8px',
                                    borderRadius: '50%',
                                    background: 'white',
                                    color: '#333',
                                    border: '1px solid #E0E0E0',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}
                            >
                                <Edit2 size={20} />
                            </button>
                        )}
                    </div>
                </div>

                {/* User Info Card */}
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '20px',
                    marginBottom: '24px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: '#F5F5F5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '3px solid white',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }}>
                            <User size={40} color="#BDBDBD" />
                        </div>
                        <div style={{
                            position: 'absolute',
                            bottom: '0',
                            right: '0',
                            background: '#2E7D32',
                            borderRadius: '50%',
                            padding: '6px',
                            border: '2px solid white'
                        }}>
                            <Camera size={14} color="white" />
                        </div>
                    </div>

                    <div style={{ flex: 1 }}>
                        {isEditing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    style={{
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        border: '1px solid #E0E0E0',
                                        borderRadius: '8px',
                                        padding: '4px 8px',
                                        width: '100%'
                                    }}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    style={{
                                        fontSize: '14px',
                                        color: '#757575',
                                        border: '1px solid #E0E0E0',
                                        borderRadius: '8px',
                                        padding: '4px 8px',
                                        width: '100%'
                                    }}
                                />
                            </div>
                        ) : (
                            <>
                                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>{user.name}</h2>
                                <p style={{ color: '#757575', fontSize: '14px' }}>{user.email}</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    {/* Weight */}
                    <div style={{ background: 'white', borderRadius: '16px', padding: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Scale size={24} color="#2E7D32" style={{ marginBottom: '8px' }} />
                        {isEditing ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                <input
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleInputChange}
                                    style={{ width: '60px', textAlign: 'center', border: '1px solid #E0E0E0', borderRadius: '8px', padding: '4px', fontSize: '18px', fontWeight: 'bold' }}
                                />
                                <span style={{ fontSize: '14px', color: '#757575' }}>kg</span>
                            </div>
                        ) : (
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                                {user.weight} <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#757575' }}>kg</span>
                            </div>
                        )}
                        <div style={{ fontSize: '12px', color: '#9E9E9E', marginTop: '4px' }}>Current Weight</div>
                    </div>

                    {/* BMI (Calculated) */}
                    <div style={{ background: 'white', borderRadius: '16px', padding: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Activity size={24} color="#2E7D32" style={{ marginBottom: '8px' }} />
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                            {isEditing ? ((formData.weight / ((formData.height / 100) ** 2)).toFixed(1)) : user.bmi}
                        </div>
                        <div style={{ fontSize: '12px', color: '#9E9E9E', marginTop: '4px' }}>BMI</div>
                    </div>

                    {/* Goal Calories */}
                    <div style={{ background: 'white', borderRadius: '16px', padding: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Flame size={24} color="#F57C00" style={{ marginBottom: '8px' }} />
                        {isEditing ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                <input
                                    type="number"
                                    name="goalCalories"
                                    value={formData.goalCalories}
                                    onChange={handleInputChange}
                                    style={{ width: '70px', textAlign: 'center', border: '1px solid #E0E0E0', borderRadius: '8px', padding: '4px', fontSize: '18px', fontWeight: 'bold' }}
                                />
                            </div>
                        ) : (
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                                {user.goalCalories} <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#757575' }}>kcal</span>
                            </div>
                        )}
                        <div style={{ fontSize: '12px', color: '#9E9E9E', marginTop: '4px' }}>Daily Goal</div>
                    </div>

                    {/* Goal Water */}
                    <div style={{ background: 'white', borderRadius: '16px', padding: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <Droplets size={24} color="#2196F3" style={{ marginBottom: '8px' }} />
                        {isEditing ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                <input
                                    type="number"
                                    name="goalWater"
                                    value={formData.goalWater}
                                    onChange={handleInputChange}
                                    style={{ width: '70px', textAlign: 'center', border: '1px solid #E0E0E0', borderRadius: '8px', padding: '4px', fontSize: '18px', fontWeight: 'bold' }}
                                />
                                <span style={{ fontSize: '14px', color: '#757575' }}>ml</span>
                            </div>
                        ) : (
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
                                {user.goalWater / 1000} <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#757575' }}>L</span>
                            </div>
                        )}
                        <div style={{ fontSize: '12px', color: '#9E9E9E', marginTop: '4px' }}>Water Goal</div>
                    </div>
                </div>

                {/* Weight Trend */}
                <div style={{ background: 'white', borderRadius: '20px', padding: '20px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>Weight Trend</h3>
                    <p style={{ color: '#757575', fontSize: '12px', marginBottom: '16px' }}>Your recent progress</p>
                    <div style={{ height: '180px' }}>
                        <Line data={data} options={options} />
                    </div>
                </div>

                {/* Dietary Preferences */}
                <div style={{ background: 'white', borderRadius: '20px', padding: '20px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>Dietary Preferences</h3>

                    {Object.entries(preferences).map(([key, value]) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F5F5F5' }}>
                            <span style={{ textTransform: 'capitalize', fontWeight: '500', color: '#424242' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <div
                                onClick={() => togglePreference(key)}
                                style={{
                                    width: '44px',
                                    height: '24px',
                                    background: value ? '#2E7D32' : '#E0E0E0',
                                    borderRadius: '12px',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    transition: 'background 0.3s'
                                }}
                            >
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    background: 'white',
                                    borderRadius: '50%',
                                    position: 'absolute',
                                    top: '2px',
                                    left: value ? '22px' : '2px',
                                    transition: 'left 0.3s',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                }}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Settings Links */}
                <div style={{ background: 'white', borderRadius: '20px', padding: '8px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    {/* Privacy Policy */}
                <div 
                    onClick={() => router.push('/privacy')}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 0',
                        borderBottom: '1px solid #F5F5F5',
                        cursor: 'pointer'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '15px', color: '#333', fontWeight: '500' }}>Privacy Policy</span>
                    </div>
                    <ChevronRight size={18} color="#BDBDBD" />
                </div>

                {/* About Aahar Diet */}
                <div 
                    onClick={() => router.push('/about')}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 0',
                        cursor: 'pointer'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '15px', color: '#333', fontWeight: '500' }}>About Aahar Diet</span>
                    </div>
                    <ChevronRight size={18} color="#BDBDBD" />
                </div>
                </div>

                {/* Reset Button */}
                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                    <button
                        onClick={() => {
                            if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                                resetApp();
                                window.location.href = '/'; // Force reload to clear any state
                            }
                        }}
                        style={{ color: '#D32F2F', background: 'none', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                    >
                        Reset App Data / Logout
                    </button>
                </div>
            </div>
            <BottomNav />
        </>
    );
}
