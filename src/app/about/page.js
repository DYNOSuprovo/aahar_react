"use client";
import { useRouter } from 'next/navigation';
import { ChevronLeft, Heart, Users, Target, Sparkles, Globe, Award, Mail, Github } from 'lucide-react';

export default function About() {
    const router = useRouter();

    return (
        <div style={{ padding: '20px', paddingBottom: '40px', background: '#FAFAFA', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <button
                    onClick={() => router.back()}
                    style={{
                        background: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                >
                    <ChevronLeft size={24} color="#333" />
                </button>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>About Aahar</h1>
            </div>

            {/* App Logo/Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                borderRadius: '20px',
                padding: '40px 24px',
                marginBottom: '24px',
                textAlign: 'center',
                color: 'white'
            }}>
                <div style={{
                    fontSize: '48px',
                    marginBottom: '16px'
                }}>🍽️</div>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Aahar</h2>
                <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '4px' }}>
                    Nutrition with Tradition
                </p>
                <p style={{ fontSize: '14px', opacity: 0.8 }}>Version 1.0</p>
            </div>

            {/* Mission Statement */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ background: '#FFE8E8', borderRadius: '12px', padding: '10px' }}>
                        <Heart size={24} color="#D32F2F" />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>Our Mission</h3>
                </div>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.7' }}>
                    Aahar is designed to help you maintain a healthy lifestyle by tracking your nutrition
                    with a focus on traditional Indian foods. We combine modern technology with time-honored
                    nutrition wisdom to help you make better dietary choices every day.
                </p>
            </div>

            {/* Features Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div style={{ background: 'white', borderRadius: '16px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ background: '#E8F5E9', borderRadius: '12px', padding: '12px', display: 'inline-block', marginBottom: '12px' }}>
                        <Globe size={28} color="#2E7D32" />
                    </div>
                    <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>2,804+</h4>
                    <p style={{ fontSize: '12px', color: '#9E9E9E' }}>Indian Foods</p>
                </div>

                <div style={{ background: 'white', borderRadius: '16px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ background: '#F3E5F5', borderRadius: '12px', padding: '12px', display: 'inline-block', marginBottom: '12px' }}>
                        <Sparkles size={28} color="#7B1FA2" />
                    </div>
                    <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>AI Powered</h4>
                    <p style={{ fontSize: '12px', color: '#9E9E9E' }}>Smart Analysis</p>
                </div>

                <div style={{ background: 'white', borderRadius: '16px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ background: '#E3F2FD', borderRadius: '12px', padding: '12px', display: 'inline-block', marginBottom: '12px' }}>
                        <Target size={28} color="#1976D2" />
                    </div>
                    <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>Goal Tracking</h4>
                    <p style={{ fontSize: '12px', color: '#9E9E9E' }}>Personalized</p>
                </div>

                <div style={{ background: 'white', borderRadius: '16px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ background: '#FFF3E0', borderRadius: '12px', padding: '12px', display: 'inline-block', marginBottom: '12px' }}>
                        <Award size={28} color="#F57C00" />
                    </div>
                    <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>Offline Ready</h4>
                    <p style={{ fontSize: '12px', color: '#9E9E9E' }}>Works Anywhere</p>
                </div>
            </div>

            {/* Key Features */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>
                    ✨ Key Features
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                        '📊 Track calories, protein, carbs, and fats',
                        '🍽️ Comprehensive Indian food database',
                        '💧 Water intake monitoring',
                        '🤖 AI-powered nutrition assistant (AaharAI)',
                        '📈 Progress tracking with charts',
                        '🎯 Personalized calorie goals',
                        '🥗 Dietary preference filters',
                        '📴 Offline functionality',
                        '🔒 Privacy-focused (local storage)'
                    ].map((feature, idx) => (
                        <div key={idx} style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px',
                            background: '#FAFAFA',
                            borderRadius: '12px'
                        }}>
                            <span style={{ fontSize: '14px', color: '#333' }}>{feature}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Technology Stack */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>
                    🛠️ Built With
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {['Next.js 16', 'React 19', 'Capacitor', 'Chart.js', 'Google Gemini AI', 'LocalStorage API'].map((tech, idx) => (
                        <span key={idx} style={{
                            padding: '8px 16px',
                            background: '#E8F5E9',
                            color: '#2E7D32',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: '500'
                        }}>
                            {tech}
                        </span>
                    ))}
                </div>
            </div>

            {/* Team */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ background: '#E3F2FD', borderRadius: '12px', padding: '10px' }}>
                        <Users size={24} color="#1976D2" />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>Our Team</h3>
                </div>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.7' }}>
                    Aahar is built by a passionate team of developers, nutritionists, and health enthusiasts
                    who believe in the power of traditional nutrition combined with modern technology to
                    help people lead healthier lives.
                </p>
            </div>

            {/* Contact */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>
                    📬 Get in Touch
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <a href="mailto:support@aahar.app" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        background: '#FAFAFA',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        color: '#333'
                    }}>
                        <Mail size={20} color="#2E7D32" />
                        <span style={{ fontSize: '14px' }}>support@aahar.app</span>
                    </a>

                    <a href="https://github.com/aahar" target="_blank" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        background: '#FAFAFA',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        color: '#333'
                    }}>
                        <Github size={20} color="#2E7D32" />
                        <span style={{ fontSize: '14px' }}>github.com/aahar</span>
                    </a>

                    <a href="https://aahar.app" target="_blank" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        background: '#FAFAFA',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        color: '#333'
                    }}>
                        <Globe size={20} color="#2E7D32" />
                        <span style={{ fontSize: '14px' }}>www.aahar.app</span>
                    </a>
                </div>
            </div>

            {/* Legal Links */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => router.push('/privacy')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#2E7D32',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        Privacy Policy
                    </button>
                    <span style={{ color: '#E0E0E0' }}>|</span>
                    <button
                        onClick={() => router.push('/profile')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#2E7D32',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        Back to Profile
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', padding: '20px', color: '#9E9E9E', fontSize: '12px' }}>
                <p style={{ marginBottom: '8px' }}>Made with ❤️ in India</p>
                <p>© 2025 Aahar. All rights reserved.</p>
                <p style={{ marginTop: '8px' }}>Version 1.0.0</p>
            </div>
        </div>
    );
}
