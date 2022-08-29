// pages/api/post/index.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// POST /api/footprint
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
  }
  if (req.method === 'POST') {
    const result = await prisma.link.create({
      data: {
        expires: new Date('2099'),
        user: { connect: { email: session?.user?.email! } },
      },
    });
    res.json(result);
    return;
  }
  if (req.method === 'GET') {
    const result = await prisma.link.findMany({
      where: {
        user: { email: session?.user?.email },
      },
    });
    res.json(result);
    return;
  }
  if (req.method === 'DELETE') {
    const { id } = req.query;
    const result = await prisma.link.delete({
      where: {
        id: id as string,
      },
    });
    res.json(result);
    return;
  }
  res.status(404).send({ error: 'Resource not found' });
}
