import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import AuthContext from './contexts/AuthContext';
import { StyledEngineProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@unocss/reset/tailwind.css';
import '@styles/global.scss';

export const revalidate = 0;

const notojp = Noto_Sans_JP({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'お薬リマインダー',
  description: 'お薬をリマインドできます',
  referrer: 'no-referrer',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ja'>
      <body className={notojp.className}>
        <AuthContext>
          <AppRouterCacheProvider options={{ key: 'css' }}>
            <StyledEngineProvider injectFirst>
              <ToastContainer />
              {children}
            </StyledEngineProvider>
          </AppRouterCacheProvider>
        </AuthContext>
      </body>
    </html>
  );
}
