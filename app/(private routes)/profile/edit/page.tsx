"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import type { User } from "@/types/user";
import css from "./EditProfilePage.module.css";

export default function EditProfilePage() {
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);

  const [userData, setUserData] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadUser = async () => {
      try {
        const user = await getMe();

        if (ignore) return;

        setUserData(user);
        setUsername(user.username);
        setUser(user);
      } catch {
        if (!ignore) {
          setError("Failed to load profile");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      ignore = true;
    };
  }, [setUser]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Username is required");
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      const updatedUser = await updateMe({
        username: trimmedUsername,
      });

      setUser(updatedUser);
      router.push("/profile");
    } catch {
      setError("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!userData) {
    return <p>{error || "Profile not found"}</p>;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={userData.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

          <p>Email: {userData.email}</p>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>

          {error && <p className={css.error}>{error}</p>}
        </form>
      </div>
    </main>
  );
}