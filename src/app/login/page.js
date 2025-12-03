"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Facebook } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { isOnboarded, updateProfile } = useUser();

    const handleAuth = (e) => {
        if (e) e.preventDefault();

        // If logging in with email, save it
        if (email) {
            updateProfile('email', email);
            // Extract name from email for default
            const nameFromEmail = email.split('@')[0];
            updateProfile('name', nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1));
        }

        if (isOnboarded) {
            router.push('/dashboard');
        } else {
            router.push('/onboarding');
        }
    };

    return (
        <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '8px', fontWeight: 'bold' }}>Welcome to Aahar</h1>
            <p style={{ color: '#757575', marginBottom: '32px' }}>Your journey to a healthier you starts here</p>

            {/* Toggle */}
            <div style={{
                background: '#F5F5F5',
                borderRadius: '25px',
                padding: '4px',
                display: 'flex',
                width: '100%',
                marginBottom: '40px'
            }}>
                <button
                    onClick={() => setIsLogin(true)}
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '20px',
                        border: 'none',
                        background: isLogin ? 'var(--primary-green)' : 'transparent',
                        color: isLogin ? 'white' : '#757575',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Login
                </button>
                <button
                    onClick={() => setIsLogin(false)}
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '20px',
                        border: 'none',
                        background: !isLogin ? 'var(--primary-green)' : 'transparent',
                        color: !isLogin ? 'white' : '#757575',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Sign-up
                </button>
            </div>

            <h2 style={{ marginBottom: '24px', alignSelf: 'flex-start' }}>
                {isLogin ? 'Log In to Your Account' : 'Create an Account'}
            </h2>

            <form onSubmit={handleAuth} style={{ width: '100%' }}>
                <input
                    type="email"
                    placeholder="Email Address"
                    className="input-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="input-field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {isLogin && (
                    <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                        <a href="#" style={{ color: 'var(--primary-green)', fontSize: '14px' }}>Forgot Password?</a>
                    </div>
                )}

                <button type="submit" className="btn" style={{ marginBottom: '24px' }}>
                    {isLogin ? 'Login' : 'Sign Up'}
                </button>
            </form>

            <div style={{ width: '100%', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '24px' }}>
                <style>{`
                    @keyframes pulse {
                        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(46, 125, 50, 0.4); }
                        70% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(46, 125, 50, 0); }
                        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(46, 125, 50, 0); }
                    }
                `}</style>

                <button className="btn-interactive" style={{
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    border: 'none',
                    background: 'transparent',
                    color: '#DB4437',
                    fontWeight: '600',
                    fontSize: '15px',
                    padding: '12px',
                    cursor: 'pointer'
                }}>
                    <Mail size={22} />
                    Continue with Gmail
                </button>

                <button className="btn-interactive" style={{
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    border: 'none',
                    background: 'transparent',
                    color: '#4267B2',
                    fontWeight: '600',
                    fontSize: '15px',
                    padding: '12px',
                    cursor: 'pointer'
                }}>
                    <Facebook size={22} />
                    Continue with Facebook
                </button>

                <button
                    onClick={() => handleAuth(null)}
                    className="btn-interactive"
                    style={{
                        marginTop: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '14px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                        animation: 'pulse 2s infinite'
                    }}
                >
                    Continue as Guest
                </button>
            </div>
        </div>
    );
}
