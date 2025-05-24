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
    "/reports/create",
    
    "/tutor"
  ];

  const tutorOnlyPaths = [
    "/tutor/courses",
    "/tutor/courses/create"
  ];

  const publicPaths = ["/login", "/register"];

  const hasRole = (role: string): boolean => {
    return userData?.roles?.includes(role) || false;
  };

  const isStudent = (): boolean => hasRole('ROLE_STUDENT');
  const isTutor = (): boolean => hasRole('ROLE_TUTOR');
  const isStaff = (): boolean => hasRole('ROLE_STAFF');

  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = AuthService.getCurrentUser();
        setUserData(user);
        
        if (!user) {
          if (protectedPaths.some(path => pathname.startsWith(path))) {
            router.replace("/login");
          }
        } else {
          if (publicPaths.includes(pathname)) {
            if (user.roles?.includes('ROLE_STAFF')) {
              router.replace("/dashboard");
            } else {
              router.replace("/profile");
            }
          }
          
          // Check tutor-only access
          if (tutorOnlyPaths.some(path => pathname.startsWith(path))) {
            if (!user.roles?.includes('ROLE_TUTOR')) {
              router.replace("/tutor/apply");
            }
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUserData(null);
        
        if (protectedPaths.some(path => pathname.startsWith(path))) {
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
    logout,

    hasRole,
    isStudent,
    isTutor,
    isStaff
  };
};

export default useUserData;