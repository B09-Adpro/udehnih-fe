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
    if (!userData?.roles) return false;
    const hasExactRole = userData.roles.includes(role);
    const hasRoleWithPrefix = userData.roles.includes(`ROLE_${role}`);
    const hasRoleWithoutPrefix = userData.roles.includes(role.replace('ROLE_', ''));
    
    const result = hasExactRole || hasRoleWithPrefix || hasRoleWithoutPrefix;

    return result;
  };

  const isStudent = (): boolean => hasRole('STUDENT') || hasRole('ROLE_STUDENT');
  const isTutor = (): boolean => hasRole('TUTOR') || hasRole('ROLE_TUTOR');
  const isStaff = (): boolean => hasRole('STAFF') || hasRole('ROLE_STAFF');

  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = AuthService.getCurrentUser();
        
        setUserData(user);
        
        if (!user) {
          if (protectedPaths.some(path => pathname.startsWith(path))) {
            router.replace("/login");
          }
          return;
        } 
        
        if (publicPaths.includes(pathname)) {
          if (user.roles?.includes('ROLE_STAFF') || user.roles?.includes('STAFF')) {
            router.replace("/dashboard");
          } else {
            router.replace("/profile");
          }
          return;
        }
        
        const isTutorPath = tutorOnlyPaths.some(path => pathname.startsWith(path));
        
        if (isTutorPath) {
          const hasRoleTutor = user.roles?.includes('ROLE_TUTOR');
          const hasTutor = user.roles?.includes('TUTOR');
          const canAccess = hasRoleTutor || hasTutor;
          
          if (!canAccess) {
            router.replace("/tutor/apply");
          } else {
            console.log("User can access tutor features");
          }
        } else {
          console.log("This is NOT a tutor-only path, no special checks needed");
        }
        
      } catch (error) {
        console.error('Error in checkAuth:', error);
        setUserData(null);
        
        if (protectedPaths.some(path => pathname.startsWith(path))) {
          router.replace("/login");
        }
      } finally {
        console.log("Setting isLoading to false");
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