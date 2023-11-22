"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/register");
  }, [router]);

  return (
    <main className="flex items-center justify-center min-h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </main>
  );
}
