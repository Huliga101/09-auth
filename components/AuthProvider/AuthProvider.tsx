"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import type { User } from "@/types/user";

type AuthProviderProps = {
  children: ReactNode;
};

const isPrivateRoute = (pathname: string) => {
  return pathname.startsWith("/notes") || pathname.startsWith("/profile");
};

const isUser = (value: unknown): value is User => {
  return (
    typeof value === "object" &&
    value !== null &&
    "email" in value &&
    "username" in value &&
    "avatar" in value
  );
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  const [isChecking, setIsChecking] = useState(false);
  const [isAllowed, setIsAllowed] = useState(true);

  useEffect(() => {
    let ignore = false;

    const verifySession = async () => {
      const privateRoute = isPrivateRoute(pathname);

      if (privateRoute) {
        setIsChecking(true);
        setIsAllowed(false);
      } else {
        setIsAllowed(true);
      }

      try {
        const user = await checkSession();

        if (ignore) return;

        if (isUser(user)) {
          setUser(user);
          setIsAllowed(true);
          return;
        }

        clearIsAuthenticated();

        if (privateRoute) {
          try {
            await logout();
          } catch {
            // Ignore logout errors when session is already missing.
          }

          router.replace("/sign-in");
        }
      } catch {
        if (ignore) return;

        clearIsAuthenticated();

        if (privateRoute) {
          try {
            await logout();
          } catch {
            // Ignore logout errors when session is already missing.
          }

          router.replace("/sign-in");
        }
      } finally {
        if (!ignore) {
          setIsChecking(false);
        }
      }
    };

    verifySession();

    return () => {
      ignore = true;
    };
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (isPrivateRoute(pathname) && (isChecking || !isAllowed)) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
}