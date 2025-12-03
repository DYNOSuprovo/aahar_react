"use client";
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';

export default function Home() {
    const { isOnboarded, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isOnboarded) {
            router.push('/dashboard');
        }
    }, [isOnboarded, isLoading, router]);

    if (isLoading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E8F5E9' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid #C8E6C9', borderTop: '3px solid #2E7D32', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // If onboarded, we are redirecting, so return null or loader
    if (isOnboarded) return null;

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Top Section with Images */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                {/* Placeholder for the collage - using CSS grid for now */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gridTemplateRows: '1fr 1fr',
                    height: '100%',
                    gap: '2px'
                }}>
                    <div style={{ background: '#FFECB3' }}></div> {/* Placeholder color */}
                    <div style={{ background: '#C8E6C9' }}></div>
                    <div style={{ background: '#FFCCBC' }}></div>
                    <div style={{ background: '#B2DFDB' }}></div>
                </div>

                {/* Logo Overlay */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'var(--primary-green)',
                    padding: '20px 40px',
                    borderRadius: '16px',
                    color: 'white',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                    <h1 style={{ fontSize: '32px', fontFamily: 'serif' }}>Aahar</h1>
                    <p style={{ fontSize: '12px' }}>Nutrition with tradition</p>
                </div>
            </div>

            {/* Bottom Section */}
            <div style={{
                flex: 1,
                background: '#E8F5E9',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px',
                textAlign: 'center'
            }}>
                <h2 style={{
                    color: 'var(--primary-green)',
                    fontSize: '24px',
                    marginBottom: '40px',
                    lineHeight: '1.4'
                }}>
                    Let's start your health <br /> journey today with us!
                </h2>

                <Link href="/login" style={{ width: '100%' }}>
                    <button className="btn" style={{ background: 'white', color: 'var(--primary-green)' }}>
                        Start
                    </button>
                </Link>
            </div>
        </div>
    );
}
