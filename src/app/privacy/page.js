"use client";
import { useRouter } from 'next/navigation';
import { ChevronLeft, Shield, Lock, Eye, Database, UserCheck } from 'lucide-react';

export default function PrivacyPolicy() {
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
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>Privacy Policy</h1>
            </div>

            {/* Privacy Shield */}
            <div style={{
                background: 'linear-gradient(135deg, #1DB954 0%, #4CAF50 100%)',
                borderRadius: '20px',
                padding: '32px 24px',
                marginBottom: '24px',
                textAlign: 'center',
                color: 'white'
            }}>
                <Shield size={48} style={{ marginBottom: '16px' }} />
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Your Privacy Matters</h2>
                <p style={{ fontSize: '14px', opacity: 0.9 }}>
                    We take your privacy seriously and are committed to protecting your personal information.
                </p>
            </div>

            {/* Privacy Sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Data Storage */}
                <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ background: '#E8F5E9', borderRadius: '12px', padding: '10px' }}>
                            <Database size={24} color="#1DB954" />
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>Data Storage</h3>
                    </div>
                    <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                        All your personal data, including dietary preferences, meal logs, and health metrics,
                        is stored <strong>locally on your device</strong>. We do not store any of your personal
                        information on our servers.
                    </p>
                </div>

                {/* What We Collect */}
                <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ background: '#E3F2FD', borderRadius: '12px', padding: '10px' }}>
                            <Eye size={24} color="#1976D2" />
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>What We Collect</h3>
                    </div>
                    <ul style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', paddingLeft: '20px' }}>
                        <li>Name and email address (stored locally)</li>
                        <li>Height, weight, age, and gender (for BMI calculation)</li>
                        <li>Daily food intake and water consumption</li>
                        <li>Dietary preferences (vegetarian, gluten-free, etc.)</li>
                        <li>Activity level and calorie goals</li>
                    </ul>
                </div>

                {/* How We Use Data */}
                <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ background: '#FFF3E0', borderRadius: '12px', padding: '10px' }}>
                            <UserCheck size={24} color="#F57C00" />
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>How We Use Your Data</h3>
                    </div>
                    <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', marginBottom: '12px' }}>
                        Your data is used solely to:
                    </p>
                    <ul style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', paddingLeft: '20px' }}>
                        <li>Calculate your daily calorie and nutrition goals</li>
                        <li>Track your food intake and water consumption</li>
                        <li>Provide personalized nutrition recommendations via AI</li>
                        <li>Display your progress charts and statistics</li>
                        <li>Filter food items based on dietary preferences</li>
                    </ul>
                </div>

                {/* Third-Party Services */}
                <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ background: '#F3E5F5', borderRadius: '12px', padding: '10px' }}>
                            <Lock size={24} color="#7B1FA2" />
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>Third-Party Services</h3>
                    </div>
                    <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', marginBottom: '12px' }}>
                        We use the following third-party services:
                    </p>
                    <ul style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', paddingLeft: '20px' }}>
                        <li><strong>Google Gemini AI:</strong> For nutrition analysis and chatbot responses.
                            Only your meal information is sent (no personal identifiers).</li>
                        <li><strong>Local Storage:</strong> Browser's localStorage API to save your data on your device.</li>
                    </ul>
                </div>

                {/* Data Security */}
                <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '12px' }}>
                        🔒 Data Security
                    </h3>
                    <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                        Since all data is stored locally on your device, you have complete control over it.
                        Your information is never transmitted to our servers or shared with third parties
                        (except for AI analysis as mentioned above).
                    </p>
                </div>

                {/* Your Rights */}
                <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '12px' }}>
                        ✅ Your Rights
                    </h3>
                    <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', marginBottom: '8px' }}>
                        You have the right to:
                    </p>
                    <ul style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', paddingLeft: '20px' }}>
                        <li>Access all your stored data at any time</li>
                        <li>Modify or update your personal information</li>
                        <li>Delete all your data by using the "Reset App Data" option</li>
                        <li>Export your data (manually via browser tools)</li>
                    </ul>
                </div>

                {/* Contact */}
                <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '12px' }}>
                        📧 Contact Us
                    </h3>
                    <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                        If you have any questions or concerns about your privacy, please contact us at:
                        <br /><br />
                        <strong>Email:</strong> support@aahar.app<br />
                        <strong>Website:</strong> www.aahar.app
                    </p>
                </div>

                {/* Last Updated */}
                <div style={{ textAlign: 'center', padding: '20px', color: '#9E9E9E', fontSize: '12px' }}>
                    Last Updated: December 4, 2025
                </div>
            </div>
        </div>
    );
}
