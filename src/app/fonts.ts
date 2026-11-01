import localFont from "next/font/local";

const geistSans = localFont({ src: "../../public/fonts/Geist-Variable.ttf", variable: "--font-geist-sans", weight: "100 900", display: "swap" });
const geistMono = localFont({ src: "../../public/fonts/GeistMono-Variable.ttf", variable: "--font-geist-mono", weight: "100 900", display: "swap", preload: false });
const bungee = localFont({ src: "../../public/fonts/Bungee-Regular.ttf", variable: "--font-bungee", weight: "400", display: "swap" });

export const fontVariables = `${geistSans.variable} ${geistMono.variable} ${bungee.variable}`;
