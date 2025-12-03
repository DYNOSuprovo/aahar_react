import './globals.css';
import BottomNav from '../components/BottomNav';
import { UserProvider } from '../context/UserContext';

export const metadata = {
    title: 'Aahar - Nutrition with Tradition',
    description: 'Your personal health journey companion',
    manifest: '/manifest.json',
    themeColor: '#2E7D32',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
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
