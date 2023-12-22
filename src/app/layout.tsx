import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Nav from "./components/Nav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "ChatNext",
    description: "Powered by Next.js",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <title>ChatNext</title>
            </head>
            <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
            <body className={`${inter.className}`}>
                <div id="modals"></div>
                <Nav />
                {children}
            </body>
        </html>
    );
}
