// src/app/api/auth/[...nextauth]/route.ts
import { authConfig } from "@/auth"; // Create this separately
import NextAuth from "next-auth";

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
