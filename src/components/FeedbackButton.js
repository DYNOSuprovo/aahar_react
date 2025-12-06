"use client";
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

export default function FeedbackButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Floating Feedback Button */}
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '90px',
                    right: '20px',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(46, 125, 50, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(46, 125, 50, 0.5)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(46, 125, 50, 0.4)';
                }}
            >
                <MessageCircle size={24} color="white" />
            </button>

            {/* Feedback Modal */}
            <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
