import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "OpsBoard",
	description:
		"Track every sale, return, and stock movement from one smart dashboard. Flow-based analytics that give you real-time visibility into your product lifecycle and business performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
		<html lang="en">
			<body className={`font-sans antialiased`}>
				{children}
				<Analytics />
			</body>
		</html>
	);
}
