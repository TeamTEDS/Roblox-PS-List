// pages/_app.js
import '../styles/globals.css';
import { Inter } from '@next/font/google';
import Head from 'next/head';

// Initialize the Inter font
const inter = Inter({ subsets: ['latin'] });

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>TEDS Roblox Private Server List</title>
        <meta name="description" content="A list of private Roblox servers for TEDS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={inter.className}>
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
