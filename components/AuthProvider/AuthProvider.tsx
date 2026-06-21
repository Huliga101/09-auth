"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession, getMe } from "@/lib/api/clientApi";
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
      const privateRoute = isPrivateRoute(pathname);

      try {
        const sessionUser = await checkSession();

        if (ignore) return;

        if (isUser(sessionUser)) {
          setUser(sessionUser);
          return;
        }

        try {
          const currentUser = await getMe();

          if (ignore) return;

          if (isUser(currentUser)) {
            setUser(currentUser);
            return;
          }
        } catch {
          // If /users/me also fails, user is really not authorized.
        }

        clearIsAuthenticated();

        if (privateRoute) {
          router.replace("/sign-in");
        }
      } catch {
        if (ignore) return;

        try {
          const currentUser = await getMe();

          if (ignore) return;

          if (isUser(currentUser)) {
            setUser(currentUser);
            return;
          }
        } catch {
          clearIsAuthenticated();

          if (privateRoute) {
            router.replace("/sign-in");
          }
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