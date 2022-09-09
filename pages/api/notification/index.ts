import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

const { subtle } = require('crypto').webcrypto;

async function createHashHex(message: string) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await subtle.digest('SHA-256', msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  if (req.method === 'POST') {
    const { subscription } = req.body;
    const subHash = await createHashHex(subscription.endpoint);
    const result = await prisma.pushSubscription.create({
      data: {
        id: subHash,
        ...subscription,
        user: { connect: { email: session?.user?.email } },
      },
    });
    res.json(result);
    return;
  }
  if (req.method === 'DELETE') {
    const { subscription } = req.body;
    const subHash = await createHashHex(subscription.endpoint);
    const result = await prisma.pushSubscription.delete({
      where: {
        id: subHash,
      },
    });
    res.json(result);
    return;
  }
  res.status(404).send({ error: 'Resource not found' });
}
