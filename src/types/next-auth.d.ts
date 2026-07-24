import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isOnboarded?: boolean;
      tier?: string;
    } & DefaultSession["user"];
  }

  interface User {
    isOnboarded?: boolean;
    tier?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    isOnboarded?: boolean;
    tier?: string;
  }
}
