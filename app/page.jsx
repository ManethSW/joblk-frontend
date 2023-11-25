"use client"
import "./globals.css";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from './context/UserContext';

export default function Home() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    console.log(user);
    if (user) {
      router.push('/profile');
    } else {
      router.push('/login');
    }
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen">
      <span className="main-page loading loading-spinner loading-lg pb-24"></span>
    </main>
  );
}
