// pages/api/auth/[...nextauth].ts

import { NextApiHandler } from 'next';
import NextAuth, { User } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import FacebookProvider from 'next-auth/providers/facebook';
import prisma from '../../../lib/prisma';

const createUserSetting = async (user: User) => {
  if (user) {
    console.log(user.id);
    const currentSettings = await prisma.userSettings.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (!currentSettings) {
      await prisma.userSettings.create({
        data: {
          user: { connect: { id: user.id } },
        },
      });
    }
  }
};

const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.JWT_SECRET,
  theme: {
    colorScheme: 'dark',
  },
  callbacks: {
    // @ts-ignore
    async signIn({ user }) {
      createUserSetting(user);
      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};
// @ts-ignore
const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;
