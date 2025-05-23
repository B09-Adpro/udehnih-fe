"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthService } from "@/lib/services/auth.service";
import { AuthUser } from "../services/interface";

const useUserData = () => {
  const [userData, setUserData] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const protectedPaths = [
    "/dashboard",
    "/profile", 
    "/courses/enrolled",
    "/reports",
    "/reports/create"
  ];

  const publicPaths = ["/login", "/register"];

  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = AuthService.getCurrentUser();
        setUserData(user);
        
        if (!user) {
          if (protectedPaths.includes(pathname)) {
            router.replace("/login");
          }
        } else {
          if (publicPaths.includes(pathname)) {
            router.replace("/dashboard");
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUserData(null);
        
        if (protectedPaths.includes(pathname)) {
          router.replace("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  const refreshUserData = () => {
    const user = AuthService.getCurrentUser();
    setUserData(user);
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setUserData(null);
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return { 
    userData, 
    isLoading, 
    isAuthenticated: !!userData,
    refreshUserData,
    logout
  };
};

export default useUserData;