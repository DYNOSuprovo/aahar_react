import './globals.css';
import BottomNav from '../components/BottomNav';
import FeedbackButton from '../components/FeedbackButton';
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
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

    return (
        <html lang="en">
            <head>
                {/* Google Analytics - Only loads if GA_ID is set */}
                {GA_ID && (
                    <>
                        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>
                        <script
                            dangerouslySetInnerHTML={{
                                __html: `
                                    window.dataLayer = window.dataLayer || [];
                                    function gtag(){dataLayer.push(arguments);}
                                    gtag('js', new Date());
                                    gtag('config', '${GA_ID}', {
                                        page_path: window.location.pathname,
                                        anonymize_ip: true,
                                    });
                                `,
                            }}
                        />
                    </>
                )}
            </head>
            <body>
                <div className="container">
                    <UserProvider>
                        {children}
                    </UserProvider>
                    <BottomNav />
                    <FeedbackButton />
                </div>
            </body>
        </html>
    );
}
