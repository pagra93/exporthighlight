import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import jwt from "jsonwebtoken";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: { strategy: "jwt" },
  providers: [
    EmailProvider({
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
      // ⚠️ Sin custom sendVerificationRequest por ahora - usar default de NextAuth
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user?.id) {
        token.sub = user.id as string;
      }
      
      // Firma JWT compatible con Supabase RLS
      if (token.sub) {
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
      }
      
      return token;
    },
    async session({ session, token }: any) {
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

// ⛔️ NO exportar GET/POST aquí
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

