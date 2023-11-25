import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { useUser } from "../context/UserContext";

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();
    const pathname = usePathname();
    const { setUser } = useUser();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (typeof window !== "undefined") {
        const fetchUser = async () => {
          const userUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_USER}`;
          const headers = {
            auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN,
          };
          try {
            const userResponse = await axios.get(userUrl, {
              headers: headers,
              withCredentials: true,
            });
            setUser(userResponse.data);
          } catch (error) {
            if (pathname === "/login") {
              //   router.replace("/login");
            } else if (pathname === "/register") {
              //   router.replace("/register");
            }
          } finally {
            setLoading(false);
          }
        };
        fetchUser();
      }
    }, []);

    if (loading) {
      return (
        <main className="flex items-center justify-center min-h-screen">
          <span className="main-page loading loading-spinner loading-lg pb-24"></span>
        </main>
      );
    }

    return <Component {...props} />;
  };
}
