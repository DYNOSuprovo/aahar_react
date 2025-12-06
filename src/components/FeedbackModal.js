"use client";
import { useState } from 'react';
import { X, Star, Send } from 'lucide-react';

export default function FeedbackModal({ isOpen, onClose }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = () => {
        // Track in analytics
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'feedback_submitted', {
                event_category: 'user_feedback',
                event_label: `rating_${rating}`,
                value: rating,
            });
        }

        // In production, you can send this to a backend/Google Forms/etc
        console.log('Feedback submitted:', { rating, feedback });

        setSubmitted(true);
        setTimeout(() => {
            onClose();
            setSubmitted(false);
            setRating(0);
            setFeedback('');
        }, 2000);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '32px',
                maxWidth: '400px',
                width: '100%',
                position: 'relative',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px'
                    }}
                >
                    <X size={24} color="#757575" />
                </button>

                {!submitted ? (
                    <>
                        {/* Title */}
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            marginBottom: '8px',
                            color: '#1A1A1A'
                        }}>
                            How's your experience?
                        </h2>
                        <p style={{
                            fontSize: '14px',
                            color: '#757575',
                            marginBottom: '24px'
                        }}>
                            Your feedback helps us improve Aahar
                        </p>

                        {/* Star Rating */}
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            justifyContent: 'center',
                            marginBottom: '24px'
                        }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        transition: 'transform 0.2s'
                                    }}
                                >
                                    <Star
                                        size={32}
                                        fill={star <= (hoverRating || rating) ? '#FFD700' : 'none'}
                                        color={star <= (hoverRating || rating) ? '#FFD700' : '#E0E0E0'}
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Feedback Text */}
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Tell us more... (optional)"
                            style={{
                                width: '100%',
                                minHeight: '100px',
                                padding: '12px',
                                border: '1px solid #E0E0E0',
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                                marginBottom: '20px'
                            }}
                        />

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={rating === 0}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: rating > 0 ? '#1DB954' : '#E0E0E0',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: rating > 0 ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <Send size={18} />
                            Submit Feedback
                        </button>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{
                            fontSize: '48px',
                            marginBottom: '16px'
                        }}>🎉</div>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            color: '#1DB954',
                            marginBottom: '8px'
                        }}>
                            Thank you!
                        </h3>
                        <p style={{
                            fontSize: '14px',
                            color: '#757575'
                        }}>
                            Your feedback helps us improve
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
