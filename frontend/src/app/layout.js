import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import Providers from '../components/Providers';

export const metadata = {
  title: "Panel Akreditasi STIKOM PGRI Banyuwangi",
  description: "Sistem Akreditasi - STIKOM PGRI Banyuwangi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
