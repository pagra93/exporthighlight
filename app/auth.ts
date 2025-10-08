import NextAuth from "next-auth";
import Email from "next-auth/providers/email";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import jwt from "jsonwebtoken";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  session: { strategy: "jwt" },
  providers: [
    Email({
      from: process.env.SMTP_FROM,
      maxAge: 10 * 60, // 10 minutos
      server: {
        host: process.env.SMTP_HOST!,
        port: Number(process.env.SMTP_PORT!),
        auth: {
          user: process.env.SMTP_USER!,
          pass: process.env.SMTP_PASS!,
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id as string;
      }
      
      // Firma JWT compatible con Supabase RLS
      (token as any).supabaseAccessToken = jwt.sign(
        {
          sub: token.sub,
          email: token.email,
          role: "authenticated",
          aud: "authenticated",
          iss: "supabase",
          exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hora
          iat: Math.floor(Date.now() / 1000),
        },
        process.env.SUPABASE_JWT_SECRET!,
        { algorithm: 'HS256' }
      );
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
      }
      (session as any).supabaseAccessToken = (token as any).supabaseAccessToken;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
export const GET = handlers.GET;
export const POST = handlers.POST;

