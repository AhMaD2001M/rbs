import './globals.css';
import { seedAdminUser } from '@/lib/adminSeed';

// Initialize admin user
seedAdminUser().catch(console.error);

export const metadata = {
  title: 'RBS School',
  description: 'RBS School Management System',
};

import ClientProvider from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}