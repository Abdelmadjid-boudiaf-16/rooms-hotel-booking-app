import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    admin: boolean;
  }

  interface Session {
    user: User & {
      id: string;
      admin: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    admin?: boolean;
  }
}



