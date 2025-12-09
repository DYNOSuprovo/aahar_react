"use client";
import { useRouter } from 'next/navigation';
import { ChevronLeft, Shield, Lock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
    const router = useRouter();

    const sections = [
        {
            icon: Shield,
            title: "Data Protection",
            content: "Your data is stored locally on your device properly. We do not sell your personal information to third parties."
        },
        {
            icon: Eye,
            title: "Data Usage",
            content: "We use your data solely to provide personalized nutrition recommendations and insights. Anonymized usage data helps us improve the app."
        },
        {
            icon: Lock,
            title: "Security",
            content: "We implement industry-standard security measures to protect your information. Your password/account details are encrypted."
        }
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '20px' }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px' }}>
                <button onClick={() => router.back()} style={{ background: 'white', padding: '10px', borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
                    <ChevronLeft size={24} color="#334155" />
                </button>
                <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Privacy Policy</h1>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    style={{ background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                        At Aahar, we take your privacy seriously. This policy outlines how we handle your personal data.
                        By using our app, you agree to the collection and use of information in accordance with this policy.
                    </p>
                    <p style={{ color: '#64748b', lineHeight: '1.6', marginTop: '16px' }}>
                        Last updated: December 2025
                    </p>
                </motion.div>

                {sections.map((section, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <div style={{ padding: '10px', background: '#F0FDF4', borderRadius: '12px' }}>
                                <section.icon size={20} color="#16a34a" />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>{section.title}</h3>
                        </div>
                        <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '15px' }}>{section.content}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
