// pages/api/auth/[...nextauth].ts

import { NextApiHandler } from 'next';
import NextAuth, { User } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import prisma from '../../../lib/prisma';

const createUserSetting = async (user: User) => {
  const currentSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });
  console.log({ currentSettings });
  if (!currentSettings) {
    await prisma.userSettings.create({
      data: {
        user: { connect: { id: user.id } },
      },
    });
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
      console.log({ user });
      createUserSetting(user);
      return true;
    },
  },
};
// @ts-ignore
const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;
