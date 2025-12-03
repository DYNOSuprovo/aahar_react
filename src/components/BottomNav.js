"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Droplets, UtensilsCrossed, User, Home } from 'lucide-react';

export default function BottomNav() {
    const pathname = usePathname();
    // Hide on login/signup/landing pages
    if (['/', '/login', '/signup', '/onboarding'].includes(pathname)) return null;

    const navItems = [
        { name: 'Home', icon: Home, path: '/dashboard', label: 'Home' },
        { name: 'AI Chat', icon: MessageSquare, path: '/chat', label: 'Chat' },
        { name: 'Water', icon: Droplets, path: '/water', label: 'Water' },
        { name: 'Mess', icon: UtensilsCrossed, path: '/mess', label: 'Mess' },
        { name: 'Profile', icon: User, path: '/profile', label: 'Profile' },
    ];

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            borderTop: '1px solid #eee',
            padding: '10px 0',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 9999,
            maxWidth: '480px',
            margin: '0 auto' // Center if on desktop
        }}>
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                    <Link
                        key={item.path}
                        href={item.path}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textDecoration: 'none',
                            color: isActive ? '#2E7D32' : '#757575',
                            flex: 1,
                            padding: '8px 0',
                            position: 'relative',
                            transition: 'color 0.3s ease'
                        }}
                    >
                        <div style={{
                            marginBottom: '4px',
                            transform: isActive ? 'scale(1.1) translateY(-2px)' : 'scale(1)',
                            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            filter: isActive ? 'drop-shadow(0 4px 6px rgba(46, 125, 50, 0.2))' : 'none'
                        }}>
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span style={{
                            fontSize: '10px',
                            fontWeight: isActive ? '600' : '400',
                            opacity: isActive ? 1 : 0.8,
                            transform: isActive ? 'translateY(0)' : 'translateY(2px)',
                            transition: 'all 0.3s ease'
                        }}>
                            {item.label}
                        </span>
                        {isActive && (
                            <div style={{
                                position: 'absolute',
                                bottom: '0',
                                width: '4px',
                                height: '4px',
                                background: '#2E7D32',
                                borderRadius: '50%',
                                animation: 'scaleIn 0.3s ease-out'
                            }} />
                        )}
                    </Link>
                );
            })}
        </div>
    );
}
