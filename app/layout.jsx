import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./components/Navbar/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "job.lk",
  description: "One stop shop for all freelancers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <script
          src="https://kit.fontawesome.com/a498e45914.js"
          crossOrigin="anonymous"
          defer
        ></script>
      </head>
      <body className={inter.className}>
        <NavBar></NavBar>
        {children}
      </body>
    </html>
  );
}
