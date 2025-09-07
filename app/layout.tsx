import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Halal Product Finder AU',
  description: 'Check if a product is halal by scanning barcodes or searching by name.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="bg-white shadow px-4 py-2">
          <h1 className="text-xl font-semibold">Halal Product Finder</h1>
        </header>
        <main className="flex-1 container mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="bg-white text-sm text-center py-2 border-t">
          &copy; {new Date().getFullYear()} Halal Product Finder AU
        </footer>
      </body>
    </html>
  );
}