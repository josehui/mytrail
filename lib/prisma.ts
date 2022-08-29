/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable import/no-mutable-exports */
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: any;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
