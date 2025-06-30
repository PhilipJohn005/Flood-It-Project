// src/auth.config.ts

import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";

import type { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      [key: string]: any;
    };
  }
}

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 10,
  },

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.id = profile.sub;
        token.email = profile.email;
        token.name = profile.name;
        token.picture = (profile as { picture?: string }).picture;
        token.loginProvider = account.provider;
        token.issuedAt = Date.now();
      }
      return token;
    },

    async session({ session, token }) {
      session.user!.id = String(token.id);
      (session.user as any).jwt = jwt.sign(
        {
          id: token.id,
          name: token.name,
          email: token.email,
          picture: token.picture,
          accessToken: token.accessToken,
        },
        process.env.BACKEND_JWT_SECRET!
      );
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
