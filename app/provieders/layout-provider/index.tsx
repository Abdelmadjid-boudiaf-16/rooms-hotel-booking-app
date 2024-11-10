"use client";

import HeaderComponent from "@/components/header/header";
import { Icons } from "@/components/icons";
import { MyUser } from "@/types";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<MyUser | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchUser = async (id: string) => {
      try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) throw new Error("Failed to fetch user");
        const fetchedUser = await response.json();
        setUser(fetchedUser);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "loading") {
      setIsLoading(true);
      return;
    }

    if (session?.user?.id) {
      fetchUser(session.user.id);
    } else {
      setUser(null);
      setIsLoading(false);

      const publicPaths = ["/", "/login", "/register"];
      if (!publicPaths.includes(pathname)) {
        router.replace("/login");
      }
    }
  }, [session, status, pathname, router]);

  if (!user && (pathname === "/login" || pathname === "/register")) {
    return <div className="container mx-auto xl:max-w-7xl">{children}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Icons.spinner className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (pathname === "/") {
    return (
      <div className="container mx-auto xl:max-w-7xl">
        <HeaderComponent userInfo={user} />
        <main className="px-2 py-16">{children}</main>
      </div>
    );
  }

  return (
    <div className="container mx-auto xl:max-w-7xl">
      <HeaderComponent userInfo={user} />
      <main className="px-2 py-16">{children}</main>
    </div>
  );
};

export default LayoutProvider;
