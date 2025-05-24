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
    
    // Debug logs
    console.log("=== ROLE CHECK DEBUG ===");
    console.log("Looking for role:", role);
    console.log("User roles from localStorage:", userData.roles);
    console.log("User roles type:", typeof userData.roles);
    console.log("Is array?", Array.isArray(userData.roles));
    
    // Check both formats: "TUTOR" and "ROLE_TUTOR"
    const hasExactRole = userData.roles.includes(role);
    const hasRoleWithPrefix = userData.roles.includes(`ROLE_${role}`);
    const hasRoleWithoutPrefix = userData.roles.includes(role.replace('ROLE_', ''));
    
    console.log("hasExactRole:", hasExactRole);
    console.log("hasRoleWithPrefix:", hasRoleWithPrefix);
    console.log("hasRoleWithoutPrefix:", hasRoleWithoutPrefix);
    
    const result = hasExactRole || hasRoleWithPrefix || hasRoleWithoutPrefix;
    console.log("Final result:", result);
    console.log("========================");
    
    return result;
  };

  const isStudent = (): boolean => hasRole('STUDENT') || hasRole('ROLE_STUDENT');
  const isTutor = (): boolean => hasRole('TUTOR') || hasRole('ROLE_TUTOR');
  const isStaff = (): boolean => hasRole('STAFF') || hasRole('ROLE_STAFF');

  useEffect(() => {
    console.log("=== useEffect TRIGGERED ===");
    console.log("pathname changed to:", pathname);
    console.log("========================");
    
    const checkAuth = () => {
      try {
        const user = AuthService.getCurrentUser();
        console.log("=== AUTH CHECK DEBUG ===");
        console.log("Current path:", pathname);
        console.log("User from localStorage:", user);
        console.log("User roles:", user?.roles);
        console.log("========================");
        
        setUserData(user);
        
        if (!user) {
          console.log("No user found, checking if path is protected");
          if (protectedPaths.some(path => pathname.startsWith(path))) {
            console.log("Path is protected, redirecting to login");
            router.replace("/login");
          }
          return; // Early return jika tidak ada user
        } 
        
        // User exists, check various path conditions
        if (publicPaths.includes(pathname)) {
          console.log("User on public path, redirecting based on role");
          if (user.roles?.includes('ROLE_STAFF') || user.roles?.includes('STAFF')) {
            router.replace("/dashboard");
          } else {
            router.replace("/profile");
          }
          return; // Early return setelah redirect
        }
        
        // Check tutor-only access dengan debugging
        console.log("=== TUTOR PATH CHECK ===");
        console.log("Current path:", pathname);
        console.log("Tutor only paths:", tutorOnlyPaths);
        
        const isTutorPath = tutorOnlyPaths.some(path => pathname.startsWith(path));
        console.log("Is tutor path?", isTutorPath);
        
        if (isTutorPath) {
          console.log("🔥 THIS IS A TUTOR-ONLY PATH - CHECKING ACCESS 🔥");
          
          // Check multiple role formats
          const hasRoleTutor = user.roles?.includes('ROLE_TUTOR');
          const hasTutor = user.roles?.includes('TUTOR');
          const canAccess = hasRoleTutor || hasTutor;
          
          console.log("user.roles:", user.roles);
          console.log("hasRoleTutor (ROLE_TUTOR):", hasRoleTutor);
          console.log("hasTutor (TUTOR):", hasTutor);
          console.log("canAccess:", canAccess);
          
          if (!canAccess) {
            console.log("❌ ACCESS DENIED: Redirecting to tutor apply");
            console.log("About to call router.replace('/tutor/apply')");
            router.replace("/tutor/apply");
          } else {
            console.log("✅ ACCESS GRANTED: User can access tutor features");
          }
        } else {
          console.log("This is NOT a tutor-only path, no special checks needed");
        }
        console.log("========================");
        
      } catch (error) {
        console.error('❌ Error in checkAuth:', error);
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
    console.log("=== REFRESH USER DATA ===");
    const user = AuthService.getCurrentUser();
    console.log("Fresh user data:", user);
    setUserData(user);
    console.log("========================");
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