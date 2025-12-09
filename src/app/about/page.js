"use client";
import { useRouter } from 'next/navigation';
import { ChevronLeft, Heart, Zap, Award, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
    const router = useRouter();

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '20px' }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px' }}>
                <button onClick={() => router.back()} style={{ background: 'white', padding: '10px', borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
                    <ChevronLeft size={24} color="#334155" />
                </button>
                <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>About Aahar</h1>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{ background: 'linear-gradient(135deg, #1DB954 0%, #16a34a 100%)', padding: '40px 20px', borderRadius: '30px', textAlign: 'center', color: 'white', marginBottom: '30px', boxShadow: '0 10px 30px rgba(29, 185, 84, 0.3)' }}>
                <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                    <span style={{ fontSize: '40px' }}>🥗</span>
                </div>
                <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Aahar Beta</h2>
                <div style={{ fontSize: '14px', opacity: 0.9, fontWeight: '500' }}>Version 2.0.0-beta</div>
                <p style={{ marginTop: '16px', lineHeight: '1.6', opacity: 0.95 }}>
                    Combining traditional nutrition wisdom with modern technology to help you lead a healthier life.
                </p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                    { icon: Heart, color: '#ef4444', title: 'Health First', desc: 'Prioritizing your well-being above all.' },
                    { icon: Zap, color: '#fbbf24', title: 'Smart AI', desc: 'Powered by advanced AI algorithms.' },
                    { icon: Award, color: '#3b82f6', title: 'Premium', desc: 'Top-tier design and user experience.' },
                    { icon: Globe, color: '#8b5cf6', title: 'Universal', desc: 'Food data from diverse cuisines.' },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                        style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
                    >
                        <item.icon size={24} color={item.color} style={{ marginBottom: '12px' }} />
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>{item.title}</h3>
                        <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>{item.desc}</p>
                    </motion.div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px', color: '#94a3b8', fontSize: '13px' }}>
                <p>© 2025 Aahar Inc. All rights reserved.</p>
                <p style={{ marginTop: '4px' }}>Made with ❤️ by Aahar Team</p>
            </div>
        </div>
    );
}
