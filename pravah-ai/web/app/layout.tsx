import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PRAVAH-AI — Predictive Resolution & Anomaly Vector Analysis for Grievances',
  description: 'AI-Powered Public Grievance Intelligence & Administrative Decision Support Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen bg-dark-950 text-slate-100 antialiased selection:bg-gold-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
