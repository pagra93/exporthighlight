import NextAuth from "next-auth";
import Email from "next-auth/providers/email";
import jwt from "jsonwebtoken";
import type { NextAuthConfig } from "next-auth";
import { supabaseServer } from "@/lib/supabaseServer";

export const authConfig = {
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
      async sendVerificationRequest({ identifier: email, url }) {
        // Crear o actualizar usuario en next_auth.users
        const { data: existingUser } = await supabaseServer
          .from('next_auth.users')
          .select('id')
          .eq('email', email)
          .single();

        if (!existingUser) {
          await supabaseServer
            .from('next_auth.users')
            .insert({
              email,
              email_verified: null,
            });
        }

        // Enviar email (NextAuth lo hace automáticamente con nodemailer)
        const { createTransport } = await import('nodemailer');
        const transport = createTransport({
          host: process.env.SMTP_HOST!,
          port: Number(process.env.SMTP_PORT!),
          auth: {
            user: process.env.SMTP_USER!,
            pass: process.env.SMTP_PASS!,
          },
        });

        await transport.sendMail({
          to: email,
          from: process.env.SMTP_FROM!,
          subject: 'Inicia sesión en ExportHighlight',
          text: `Haz click en el siguiente enlace para iniciar sesión:\n\n${url}\n\n`,
          html: `<p>Haz click en el siguiente enlace para iniciar sesión:</p><p><a href="${url}">Iniciar sesión</a></p>`,
        });
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id as string;
      }

      // Si no tenemos sub pero tenemos email, buscar el usuario
      if (!token.sub && token.email) {
        const { data: userData } = await supabaseServer
          .from('next_auth.users')
          .select('id')
          .eq('email', token.email)
          .single();

        if (userData) {
          token.sub = userData.id;
        }
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

