"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession } from "@/lib/api/clientApi";
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

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let ignore = false;

    const verifySession = async () => {
      try {
        const user = await checkSession();

        if (ignore) return;

        if (isUser(user)) {
          setUser(user);
          return;
        }

        clearIsAuthenticated();

        if (isPrivateRoute(pathname)) {
          router.replace("/sign-in");
        }
      } catch {
        if (ignore) return;

        clearIsAuthenticated();

        if (isPrivateRoute(pathname)) {
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

  if (isChecking && isPrivateRoute(pathname)) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
}