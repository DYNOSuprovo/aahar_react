"use client";
import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Copy, ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';
import { sendMessageToBackend } from '../../lib/api';

export default function Chat() {
    const [messages, setMessages] = useState([
        {
            role: 'model',
            content: "Hello! I'm AaharAI, your personal diet assistant. How can I help you today with your nutrition and diet goals?",
            time: '10:00 AM'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
            console.error("Error:", error);
            setMessages(prev => [...prev, {
                role: 'model',
                content: "Sorry, I'm having trouble connecting to the server. It might be waking up (free tier). Please try again in a moment.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setLoading(false);
        }
    };

    const suggestions = ["Suggest a healthy snack", "Track my macros", "What's in season?", "Diet plan for weight loss"];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', background: '#FAFAFA' }}>
            {/* Header */}
            <div style={{ padding: '16px', background: 'white', borderBottom: '1px solid #eee', textAlign: 'center', fontWeight: 'bold' }}>
                AI Chat
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', paddingBottom: '80px' }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        marginBottom: '24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: msg.role === 'user' ? 'var(--primary-green)' : 'black',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px'
                            }}>
                                {msg.role === 'user' ? 'YO' : 'AI'}
                            </div>

                            <div style={{
                                background: msg.role === 'user' ? 'var(--primary-green)' : 'white',
                                color: msg.role === 'user' ? 'white' : 'black',
                                padding: '12px 16px',
                                borderRadius: '16px',
                                borderTopLeftRadius: msg.role === 'model' ? '4px' : '16px',
                                borderTopRightRadius: msg.role === 'user' ? '4px' : '16px',
                                maxWidth: '80%',
                                boxShadow: msg.role === 'model' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                fontSize: '14px',
                                lineHeight: '1.5'
                            }}>
                                {msg.content}
                            </div>
                        </div>

                        <div style={{
                            fontSize: '10px',
                            color: '#9E9E9E',
                            marginTop: '4px',
                            marginRight: msg.role === 'user' ? '40px' : '0',
                            marginLeft: msg.role === 'model' ? '40px' : '0'
                        }}>
                            {msg.time}
                        </div>

                        {/* AI Actions */}
                        {msg.role === 'model' && (
                            <div style={{ display: 'flex', gap: '16px', marginLeft: '40px', marginTop: '8px' }}>
                                <button style={{ background: 'none', border: 'none', display: 'flex', gap: '4px', fontSize: '12px', color: '#757575', cursor: 'pointer' }}><ThumbsUp size={14} /> Helpful</button>
                                <button style={{ background: 'none', border: 'none', display: 'flex', gap: '4px', fontSize: '12px', color: '#757575', cursor: 'pointer' }}><ThumbsDown size={14} /> Not helpful</button>
                                <button style={{ background: 'none', border: 'none', display: 'flex', gap: '4px', fontSize: '12px', color: '#757575', cursor: 'pointer' }}><Copy size={14} /> Copy</button>
                            </div>
                        )}
                    </div>
                ))}
                {loading && <div style={{ marginLeft: '40px', color: '#757575', fontSize: '12px' }}>AaharAI is typing...</div>}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggestions & Input */}
            <div style={{ padding: '16px', background: 'white', borderTop: '1px solid #eee' }}>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '12px', paddingBottom: '4px' }}>
                    {suggestions.map((s, i) => (
                        <button key={i} onClick={() => setInput(s)} style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '1px solid #E0E0E0',
                            background: 'white',
                            fontSize: '12px',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer'
                        }}>
                            {s}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '24px',
                            border: '1px solid #E0E0E0',
                            outline: 'none'
                        }}
                    />
                    <button
                        onClick={handleSend}
                        style={{
                            background: 'var(--primary-green)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
