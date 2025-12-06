"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, User, Ruler, Activity, Check } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function Onboarding() {
    const router = useRouter();
    const { user, completeOnboarding, resetApp } = useUser();
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'male',
        height: '',
        weight: '',
        activityLevel: 'sedentary'
    });

    // Initialize name from context if available (e.g. from login)
    useEffect(() => {
        if (user && user.name) {
            setFormData(prev => ({ ...prev, name: user.name }));
        }
    }, [user]);

    const totalSteps = 3;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateStep = () => {
        if (step === 1) return formData.name && formData.name.trim().length > 0;
        if (step === 2) return formData.age > 0 && formData.height > 0 && formData.weight > 0;
        if (step === 3) return !!formData.activityLevel;
        return false;
    };

    const handleNext = () => {
        if (!validateStep()) return;
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const calculateGoals = () => {
        // Mifflin-St Jeor Equation
        const weight = parseFloat(formData.weight) || 0;
        const height = parseFloat(formData.height) || 0;
        const age = parseFloat(formData.age) || 0;

        let bmr = 10 * weight + 6.25 * height - 5 * age;
        bmr += formData.gender === 'male' ? 5 : -161;

        const activityMultipliers = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            very_active: 1.9
        };

        const tdee = Math.round(bmr * (activityMultipliers[formData.activityLevel] || 1.2));

        // Water: approx 35ml per kg
        const water = Math.round(weight * 35);

        // BMI
        const heightInM = height / 100;
        const bmi = (weight > 0 && height > 0) ? (weight / (heightInM * heightInM)).toFixed(1) : 0;

        return {
            ...user, // Keep existing user data (like email)
            ...formData,
            weight: weight,
            height: height,
            age: age,
            bmi: bmi,
            goalCalories: tdee > 0 ? tdee : 2000, // Fallback
            goalWater: water > 0 ? water : 2000
        };
    };

    const handleSubmit = () => {
        const finalData = calculateGoals();
        completeOnboarding(finalData);
        router.push('/dashboard');
    };

    const isValid = validateStep();

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #E8F5E9 0%, #FFFFFF 100%)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        }}>
            {/* Restart Button */}
            <button
                onClick={() => {
                    if (confirm('Start over? This will clear your progress.')) {
                        resetApp();
                        router.push('/');
                    }
                }}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'none',
                    border: 'none',
                    color: '#757575',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    zIndex: 10
                }}
            >
                Restart
            </button>

            {/* Progress Bar */}
            <div style={{ marginBottom: '40px', marginTop: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#1DB954', fontWeight: '600' }}>
                    <span>Step {step} of {totalSteps}</span>
                    <span>{Math.round((step / totalSteps) * 100)}%</span>
                </div>
                <div style={{ height: '6px', background: '#C8E6C9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%',
                        width: `${(step / totalSteps) * 100}%`,
                        background: '#1DB954',
                        transition: 'width 0.3s ease'
                    }} />
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                {step === 1 && (
                    <div className="animate-fade-in">
                        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>Let's get to know you!</h1>
                        <p style={{ color: '#757575', marginBottom: '30px' }}>We need some basic details to personalize your plan.</p>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Your Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={20} color="#9E9E9E" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                    style={{
                                        width: '100%', padding: '14px 14px 14px 44px', borderRadius: '12px',
                                        border: '1px solid #E0E0E0', fontSize: '16px', outline: 'none'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-fade-in">
                        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>Body Stats</h1>
                        <p style={{ color: '#757575', marginBottom: '30px' }}>This helps us calculate your calorie and water needs.</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    placeholder="25"
                                    style={{
                                        width: '100%', padding: '14px', borderRadius: '12px',
                                        border: '1px solid #E0E0E0', fontSize: '16px', outline: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%', padding: '14px', borderRadius: '12px',
                                        border: '1px solid #E0E0E0', fontSize: '16px', outline: 'none', background: 'white'
                                    }}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Height (cm)</label>
                            <div style={{ position: 'relative' }}>
                                <Ruler size={20} color="#9E9E9E" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                                <input
                                    type="number"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleInputChange}
                                    placeholder="175"
                                    style={{
                                        width: '100%', padding: '14px 14px 14px 44px', borderRadius: '12px',
                                        border: '1px solid #E0E0E0', fontSize: '16px', outline: 'none'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Weight (kg)</label>
                            <div style={{ position: 'relative' }}>
                                <Activity size={20} color="#9E9E9E" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                                <input
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleInputChange}
                                    placeholder="70"
                                    style={{
                                        width: '100%', padding: '14px 14px 14px 44px', borderRadius: '12px',
                                        border: '1px solid #E0E0E0', fontSize: '16px', outline: 'none'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-fade-in">
                        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>Activity Level</h1>
                        <p style={{ color: '#757575', marginBottom: '30px' }}>How active are you on a daily basis?</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
                                { value: 'light', label: 'Lightly Active', desc: 'Exercise 1-3 times/week' },
                                { value: 'moderate', label: 'Moderately Active', desc: 'Exercise 4-5 times/week' },
                                { value: 'active', label: 'Very Active', desc: 'Daily exercise or physical job' }
                            ].map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => setFormData(prev => ({ ...prev, activityLevel: option.value }))}
                                    style={{
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: formData.activityLevel === option.value ? '2px solid #1DB954' : '1px solid #E0E0E0',
                                        background: formData.activityLevel === option.value ? '#E8F5E9' : 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: '600', color: '#333' }}>{option.label}</div>
                                        <div style={{ fontSize: '12px', color: '#757575' }}>{option.desc}</div>
                                    </div>
                                    {formData.activityLevel === option.value && <Check size={20} color="#1DB954" />}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
                {step > 1 && (
                    <button
                        onClick={handleBack}
                        style={{
                            padding: '16px',
                            borderRadius: '12px',
                            border: 'none',
                            background: '#F5F5F5',
                            color: '#757575',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}
                <button
                    onClick={handleNext}
                    disabled={!isValid}
                    style={{
                        flex: 1,
                        padding: '16px',
                        borderRadius: '12px',
                        border: 'none',
                        background: isValid ? 'linear-gradient(135deg, #1DB954 0%, #1B5E20 100%)' : '#E0E0E0',
                        color: isValid ? 'white' : '#9E9E9E',
                        fontWeight: '600',
                        fontSize: '16px',
                        cursor: isValid ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: isValid ? '0 4px 12px rgba(46, 125, 50, 0.3)' : 'none'
                    }}
                >
                    {step === totalSteps ? 'Complete Setup' : 'Continue'}
                    {step < totalSteps && <ChevronRight size={20} />}
                </button>
            </div>
        </div>
    );
}
