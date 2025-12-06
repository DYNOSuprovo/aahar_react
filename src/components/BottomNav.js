"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, MessageSquare, Droplets, UtensilsCrossed, User } from 'lucide-react';

export default function BottomNav() {
    const pathname = usePathname();

    // Hide on certain pages
    if (['/', '/login', '/signup', '/onboarding'].includes(pathname)) return null;

    const navItems = [
        { icon: Home, path: '/dashboard', label: 'Home' },
        { icon: MessageSquare, path: '/chat', label: 'Chat' },
        { icon: Droplets, path: '/water', label: 'Water' },
        { icon: UtensilsCrossed, path: '/mess', label: 'Mess' },
        { icon: User, path: '/profile', label: 'Profile' },
    ];

    const activeIndex = navItems.findIndex(item => item.path === pathname);

    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'white',
                borderTop: '1px solid #f0f0f0',
                zIndex: 9999
            }}
        >
            <div style={{
                maxWidth: '480px',
                margin: '0 auto',
                padding: '8px 16px',
                position: 'relative'
            }}>
                {/* Sliding Indicator */}
                <motion.div
                    style={{
                        position: 'absolute',
                        bottom: '8px',
                        height: '3px',
                        width: '48px',
                        backgroundColor: '#1DB954',
                        borderRadius: '4px'
                    }}
                    animate={{
                        left: `calc(${activeIndex * 20}% + 10% - 24px)`
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center'
                }}>
                    {navItems.map((item, index) => {
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
                                    padding: '8px 12px',
                                    textDecoration: 'none'
                                }}
                            >
                                <motion.div
                                    animate={{
                                        scale: isActive ? 1.15 : 1,
                                        y: isActive ? -2 : 0
                                    }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                >
                                    <Icon
                                        size={24}
                                        color={isActive ? '#1DB954' : '#9CA3AF'}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                </motion.div>
                                <motion.span
                                    animate={{
                                        opacity: isActive ? 1 : 0.6,
                                        y: isActive ? 0 : 2
                                    }}
                                    style={{
                                        fontSize: '10px',
                                        marginTop: '4px',
                                        fontWeight: isActive ? '600' : '500',
                                        color: isActive ? '#1DB954' : '#9CA3AF'
                                    }}
                                >
                                    {item.label}
                                </motion.span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}
