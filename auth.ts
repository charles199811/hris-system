import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
// import { cookies } from "next/headers";
// import { authConfig } from "./auth.config";
import { UserRole } from "@prisma/client";

const ALLOWED_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN ?? "intelura.com";
const ALLOWED_ROLES = new Set<UserRole>([UserRole.ADMIN, UserRole.ANALYST]);

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        //Find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        //check if user exist and password matches
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password,
          );

          //If password is correct, return to user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        //if not exist or password unmatched return null
        return null;
      },
    }),
  ],
  callbacks: {
    //Gate access here
    async signIn({ user }: any) {
      const email = (user?.email ?? "").toLowerCase();
      const role = user?.role as UserRole | undefined;

      const hasAllowedDomain = email.endsWith(`@${ALLOWED_DOMAIN}`);
      const hasAllowedRole = role ? ALLOWED_ROLES.has(role) : false;

      // allow if either condition is true
      return hasAllowedDomain || hasAllowedRole;
    },

    //Persist role/name into JWT
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.role = user.role;
        token.name = user.name;
        
      }

      // optional: if you ever update the session name, keep token in sync
      if (trigger === "update" && session?.user?.name) {
        token.name = session.user.name;
      }

      return token;
    },

    //Expose token fields into session
    async session({ session, user, trigger, token }: any) {
      //set user id from token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      console.log(token);
      //If there is an update, set the user name
      if (trigger === "update") {
        session.user.name = user.name;
      }

      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
