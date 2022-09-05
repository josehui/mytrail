import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// POST /api/account/settings

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  if (req.method === 'POST') {
    const { reminderFreq, sosTime, emailList, emailMessage, defaultMessage } = req.body;
    const result = await prisma.user.update({
      where: {
        email: session.user?.email!,
      },
      data: {
        setting: {
          update: {
            reminderFreq: reminderFreq || 180,
            sosTime: sosTime || 24,
            emailList: emailList || [],
            emailMessage,
            defaultMessage,
          },
        },
      },
    });
    res.json(result);
    return;
  }
  res.status(404).send({ error: 'Resource not found' });
}
