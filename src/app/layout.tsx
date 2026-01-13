import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nested Discussion Thread',
  description: 'A deeply-nested comment threads with optimistic UI updates',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}