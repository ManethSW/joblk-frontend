"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import  "./globals.css"

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/register");
  }, [router]);

  return (
    <main className="flex items-center justify-center min-h-screen">
      <span className="mainpage loading loading-spinner loading-lg pb-24"></span>
    </main>
  );
}
