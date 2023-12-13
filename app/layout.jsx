import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./components/Navbar/Navbar";
import { UserProvider } from "./context/UserContext";
import { SessionProvider } from "./context/SessionContext";
require("dotenv").config();

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "job.lk",
  description: "One Stop Shop For All Freelancers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" className={inter.className}>
      <head>
        <script
          src="https://kit.fontawesome.com/a498e45914.js"
          crossOrigin="anonymous"
          defer
        ></script>
      </head>
      <body style={bodyStyle}>
        <UserProvider>
          <SessionProvider>
            <NavBar></NavBar>
            {children}
          </SessionProvider>
        </UserProvider>
      </body>
    </html>
  );
}

const bodyStyle = {
  backgroundColor: "#f5f5f5",
};
