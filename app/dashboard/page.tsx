"use client";
import { handleSignOut } from "@/actions";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const { data: session } = useSession();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1> Welcom {session?.user?.name} </h1>
      <div>
        <form action={handleSignOut}>
          <Button>Sign Out</Button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
