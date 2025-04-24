import React from 'react';
import './globals.css';

export const metadata = {
  title: 'KIDS Preschool',
  description: 'Preschool education platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="bg-blue-500 text-white p-4">
          </header>
          <main className="flex-grow p-4">{children}</main>
          <footer className="bg-gray-800 text-white text-center p-2">
            <p>&copy; {new Date().getFullYear()} KIDS Preschool. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}