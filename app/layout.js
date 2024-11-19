'use client'

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
        <head>
            <title>NOSTOS DASHBOARD</title>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=close" />
        </head>
        <body>
            <SessionProvider session={session}>
                {children}
                <ToastContainer 
                    position="top-center" 
                    hideProgressBar={true} 
                    pauseOnHover={false} 
                    draggable={false} 
                    autoClose={2000}
                    closeOnClick
                    transition={Slide}
                />
            </SessionProvider>
        </body>
    </html>
  );
}
