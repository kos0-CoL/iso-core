import { Space_Grotesk, Inter, Source_Code_Pro } from 'next/font/google';
import './globals.css';

// Descargamos las fuentes e inyectamos sus variables CSS de forma local
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-source-code',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${inter.variable} ${sourceCodePro.variable}`}>
      <head>
        <title>ISO CORE: Vector Lab</title>
        <meta name="description" content="Multi-agent vector ecosystem for behavioral emergence research." />
      </head>
      <body className="font-body antialiased bg-background text-foreground overflow-auto">
        {children}
      </body>
    </html>
  );
}

