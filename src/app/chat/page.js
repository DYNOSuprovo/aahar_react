"use client";
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Copy, ThumbsUp, ThumbsDown, Sparkles, Mic, Zap, Check } from 'lucide-react';
import { sendMessageToBackend } from '../../lib/api';

// Quick suggestion chips
const quickSuggestions = [
    { text: "Healthy snack ideas", icon: "🍎" },
    { text: "Calculate my BMI", icon: "📊" },
    { text: "Low calorie dinner", icon: "🥗" },
    { text: "Protein sources", icon: "💪" },
    { text: "Meal prep tips", icon: "📦" },
];

// Smart fallback responses for when AI is unavailable
const fallbackResponses = {
    bmi: {
        keywords: ['bmi', 'body mass', 'calculate bmi', 'my bmi'],
        response: `**BMI (Body Mass Index)** is calculated as:\n\n**Formula:** Weight (kg) ÷ Height² (m)\n\n📊 **BMI Categories:**\n• Under 18.5 → Underweight\n• 18.5 - 24.9 → Normal ✅\n• 25 - 29.9 → Overweight\n• 30+ → Obese\n\n💡 **Tip:** Check your BMI in the Profile section!`
    },
    protein: {
        keywords: ['protein', 'protein source', 'high protein', 'protein food'],
        response: `**High Protein Foods** 💪\n\n🥬 **Vegetarian:**\n• Paneer (18g/100g)\n• Dal/Lentils (9g/100g)\n• Chickpeas (19g/100g)\n• Greek Yogurt (10g/100g)\n• Tofu (8g/100g)\n\n🍗 **Non-Vegetarian:**\n• Chicken Breast (31g/100g)\n• Eggs (13g/100g)\n• Fish (20-25g/100g)\n\n🎯 **Daily Goal:** 0.8-1g per kg body weight`
    },
    snack: {
        keywords: ['snack', 'healthy snack', 'snack idea', 'low calorie snack'],
        response: `**Healthy Indian Snacks** 🍎\n\n✅ **Low Calorie Options:**\n• Makhana (roasted) - 90 cal/30g\n• Sprouts chaat - 120 cal\n• Buttermilk (chaas) - 40 cal\n• Cucumber raita - 60 cal\n• Roasted chana - 100 cal/30g\n• Fruit bowl - 80-100 cal\n\n❌ **Avoid:**\n• Samosa (~250 cal)\n• Pakora (~150 cal each)\n• Fried snacks`
    },
    dinner: {
        keywords: ['dinner', 'low calorie dinner', 'light dinner', 'healthy dinner'],
        response: `**Healthy Dinner Ideas** 🥗\n\n🌙 **Light Options (300-400 cal):**\n• Dal + 1 Roti + Sabzi\n• Vegetable Khichdi\n• Grilled Paneer Salad\n• Moong Dal Chilla\n\n💡 **Tips:**\n• Eat 2-3 hours before sleep\n• Avoid heavy curries at night\n• Include fiber for better digestion\n• Drink water, not cold drinks`
    },
    weight: {
        keywords: ['weight loss', 'lose weight', 'reduce weight', 'fat loss'],
        response: `**Weight Loss Basics** ⚖️\n\n🔥 **Calorie Deficit:** Eat 300-500 cal less than TDEE\n\n✅ **Do:**\n• Track your meals (use Aahar!)\n• Drink 2-3L water daily\n• Include protein in every meal\n• Walk 8000+ steps\n\n❌ **Don't:**\n• Skip meals\n• Crash diet\n• Avoid all carbs\n\n📊 Lose 0.5-1 kg/week = healthy pace`
    },
    water: {
        keywords: ['water', 'hydration', 'how much water', 'water intake'],
        response: `**Daily Water Intake** 💧\n\n📏 **General Rule:** Weight (kg) × 35 = ml/day\n\n**Examples:**\n• 50 kg → 1750 ml\n• 70 kg → 2450 ml\n• 90 kg → 3150 ml\n\n💡 **Tips:**\n• Start your day with water\n• Track it in Water Tracker!\n• Increase during exercise/summer`
    },
    meal: {
        keywords: ['meal prep', 'meal plan', 'weekly meal', 'planning'],
        response: `**Meal Prep Tips** 📦\n\n🗓️ **Weekly Planning:**\n1. Plan meals on Sunday\n2. Prep ingredients in bulk\n3. Cook grains for 2-3 days\n4. Pre-cut vegetables\n\n🥡 **Batch Cook:**\n• Dal (3-4 day supply)\n• Rice/Roti dough\n• Sabzi bases\n\n💰 Saves time, money & calories!`
    }
};

// Find matching fallback response
const getFallbackResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    for (const [key, data] of Object.entries(fallbackResponses)) {
        if (data.keywords.some(kw => lowerQuery.includes(kw))) {
            return data.response;
        }
    }
    return null;
};

export default function Chat() {
    const [messages, setMessages] = useState([
        {
            role: 'model',
            content: "Hey there! 👋 I'm **AaharAI**, your personal nutrition assistant. Ask me anything about diet, calories, meal planning, or healthy eating!",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [copiedIdx, setCopiedIdx] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => { scrollToBottom(); }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = { role: 'user', content: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const responseText = await sendMessageToBackend(userMsg.content);
            setMessages(prev => [...prev, {
                role: 'model',
                content: responseText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } catch (error) {
            // Try to get a smart fallback response
            const fallback = getFallbackResponse(userMsg.content);

            if (fallback) {
                // Use pre-defined response when AI fails
                setMessages(prev => [...prev, {
                    role: 'model',
                    content: fallback + "\n\n---\n*💡 Offline response - AI will respond when connected*",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            } else {
                // Generic error for unrecognized queries
                setMessages(prev => [...prev, {
                    role: 'model',
                    content: "I'm having trouble connecting right now. The server might be waking up. Please try again in a moment! 🔄\n\n💡 **Quick tip:** Try asking about BMI, protein, snacks, or meal planning for instant answers!",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            }
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    // Simple markdown-like formatting
    const formatMessage = (text) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:12px">$1</code>');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'linear-gradient(180deg, #f0fdf4 0%, #f8fafc 100%)' }}>

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                style={{
                    padding: '16px 20px', background: 'white', borderBottom: '1px solid #e5e7eb',
                    display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                }}>
                <div style={{
                    width: '44px', height: '44px', borderRadius: '14px',
                    background: 'linear-gradient(135deg, #1DB954, #16a34a)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(29,185,84,0.3)'
                }}>
                    <Sparkles size={22} color="white" />
                </div>
                <div>
                    <h1 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a' }}>AaharAI</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }} />
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Online • Your Diet Assistant</span>
                    </div>
                </div>
            </motion.div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: '20px' }}>
                <AnimatePresence>
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', maxWidth: '85%' }}>
                                {/* Avatar */}
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '12px', flexShrink: 0,
                                    background: msg.role === 'user' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'linear-gradient(135deg, #1DB954, #16a34a)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontSize: '14px', fontWeight: '700',
                                    boxShadow: msg.role === 'user' ? '0 4px 10px rgba(59,130,246,0.3)' : '0 4px 10px rgba(29,185,84,0.3)'
                                }}>
                                    {msg.role === 'user' ? '👤' : '🤖'}
                                </div>

                                {/* Message Bubble */}
                                <div style={{
                                    background: msg.role === 'user' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'white',
                                    color: msg.role === 'user' ? 'white' : '#1e293b',
                                    padding: '14px 18px', borderRadius: '18px',
                                    borderTopLeftRadius: msg.role === 'model' ? '4px' : '18px',
                                    borderTopRightRadius: msg.role === 'user' ? '4px' : '18px',
                                    boxShadow: msg.role === 'model' ? '0 4px 15px rgba(0,0,0,0.06)' : '0 4px 15px rgba(59,130,246,0.2)',
                                    fontSize: '14px', lineHeight: '1.6'
                                }}>
                                    <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                                </div>
                            </div>

                            {/* Time & Actions */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px',
                                marginLeft: msg.role === 'model' ? '46px' : '0',
                                marginRight: msg.role === 'user' ? '46px' : '0'
                            }}>
                                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{msg.time}</span>
                                {msg.role === 'model' && (
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => copyToClipboard(msg.content, idx)}
                                            style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748b', cursor: 'pointer' }}>
                                            {copiedIdx === idx ? <><Check size={12} color="#22c55e" /> Copied</> : <><Copy size={12} /> Copy</>}
                                        </motion.button>
                                        <motion.button whileTap={{ scale: 0.9 }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}>
                                            <ThumbsUp size={12} />
                                        </motion.button>
                                        <motion.button whileTap={{ scale: 0.9 }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}>
                                            <ThumbsDown size={12} />
                                        </motion.button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {loading && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, #1DB954, #16a34a)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <span style={{ fontSize: '16px' }}>🤖</span>
                        </div>
                        <div style={{
                            background: 'white', padding: '16px 20px', borderRadius: '18px', borderTopLeftRadius: '4px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.06)', display: 'flex', gap: '6px', alignItems: 'center'
                        }}>
                            {[0, 1, 2].map(i => (
                                <motion.div key={i}
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                                    style={{ width: '8px', height: '8px', background: '#1DB954', borderRadius: '50%' }}
                                />
                            ))}
                            <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '6px' }}>Thinking...</span>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggestions & Input */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ padding: '16px 20px 90px 20px', background: 'white', borderTop: '1px solid #e5e7eb', boxShadow: '0 -4px 20px rgba(0,0,0,0.05)' }}>

                {/* Quick Suggestions */}
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '14px', paddingBottom: '4px' }}>
                    {quickSuggestions.map((s, i) => (
                        <motion.button key={i} whileTap={{ scale: 0.95 }} onClick={() => setInput(s.text)}
                            style={{
                                padding: '10px 14px', borderRadius: '12px', border: '1px solid #e5e7eb',
                                background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', fontSize: '12px',
                                whiteSpace: 'nowrap', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                                fontWeight: '500', color: '#475569', transition: 'all 0.2s'
                            }}>
                            <span>{s.icon}</span> {s.text}
                        </motion.button>
                    ))}
                </div>

                {/* Input Area */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{
                        flex: 1, display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '6px 6px 6px 16px', borderRadius: '16px',
                        border: '2px solid #e5e7eb', background: '#f8fafc',
                        transition: 'border-color 0.2s'
                    }}>
                        <input
                            type="text" value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask me about nutrition..."
                            style={{
                                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                                fontSize: '14px', color: '#1e293b'
                            }}
                        />
                        <motion.button whileTap={{ scale: 0.9 }}
                            style={{
                                width: '36px', height: '36px', borderRadius: '10px', border: 'none',
                                background: '#f1f5f9', color: '#64748b', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                            <Mic size={18} />
                        </motion.button>
                    </div>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={handleSend}
                        disabled={loading || !input.trim()}
                        style={{
                            width: '48px', height: '48px', borderRadius: '14px', border: 'none',
                            background: input.trim() ? 'linear-gradient(135deg, #1DB954, #16a34a)' : '#e5e7eb',
                            color: input.trim() ? 'white' : '#94a3b8', cursor: input.trim() ? 'pointer' : 'default',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: input.trim() ? '0 4px 15px rgba(29,185,84,0.4)' : 'none',
                            transition: 'all 0.2s'
                        }}>
                        <Send size={20} />
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
