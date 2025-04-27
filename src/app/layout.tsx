import type { Metadata } from 'next';
import '@/styles/globals.css';
import '@/styles/theme.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import GlobalModals from './providers/global-modals';
import { QueryProvider } from './providers/query.provider';
import { Toaster } from '@/components/ui/sonner';
import { GlobalProvider } from './providers/global.provider';
import { defaultMetadata } from '@/configs';
import { CheckProvider } from './providers/check-provider';

export const metadata: Metadata = defaultMetadata;
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon.svg' />
      </head>
      <GlobalProvider>
        <QueryProvider>
          <CheckProvider>
            <Toaster />
            <GlobalModals />
            {children}
          </CheckProvider>
        </QueryProvider>
      </GlobalProvider>
    </html>
  );
}
