// pages/api/post/index.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// POST /api/footprint
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const linkId = req.query.id;
  let linkAuthor;
  if (linkId) {
    const linkData = await prisma.link.findUnique({
      where: { id: linkId.toString() },
      include: {
        user: true,
      },
    });
    linkAuthor = linkData?.user;
  }
  const session = await getSession({ req });

  if (!session && !linkAuthor) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (req.method === 'GET') {
    const authorEmail = linkAuthor?.email ? linkAuthor?.email : session?.user?.email;
    const startD = req.query.date ? new Date(req.query.date.toString()) : new Date();
    if (!req.query.date) {
      startD.setHours(0, 0, 0, 0);
    }
    const endD = new Date(startD.getTime());
    endD.setDate(endD.getDate() + 1);
    let footprints = await prisma.footprint.findMany({
      orderBy: [
        {
          createdAt: 'asc',
        },
      ],
      where: {
        author: { email: authorEmail },
        createdAt: {
          gte: startD,
          lt: endD,
        },
      },
      include: {
        author: {
          select: { name: true },
        },
      },
    });
    footprints = JSON.parse(JSON.stringify(footprints));
    res.json(footprints);
    return;
  }

  if (session && req.method === 'POST') {
    const { location, address, remarks, images, timestamp } = req.body;
    const result = await prisma.footprint.create({
      data: {
        location: JSON.parse(location),
        address,
        remarks,
        images,
        author: { connect: { email: session?.user?.email! } },
        createdAt: timestamp ? new Date(timestamp) : undefined,
      },
    });
    res.json(result);
    return;
  }
  res.status(404).send({ error: 'Resource not found' });
}
