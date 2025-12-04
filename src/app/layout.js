import './globals.css';
import BottomNav from '../components/BottomNav';
import { UserProvider } from '../context/UserContext';

export const metadata = {
    title: 'Aahar - Nutrition with Tradition',
    description: 'Track your nutrition with traditional Indian foods. Smart calorie tracking, AI assistant, and personalized meal planning.',
    manifest: '/manifest.json',
    themeColor: '#2E7D32',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
    icons: {
        icon: '/icon.svg',
        apple: '/icon.svg',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <div className="container">
                    <UserProvider>
                        {children}
                    </UserProvider>
                    <BottomNav />
                </div>
            </body>
        </html>
    );
}
