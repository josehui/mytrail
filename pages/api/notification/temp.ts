import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';
import wpClient from '../../../lib/web-push';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (req.method === 'POST' && session) {
    const { subscription } = req.body;

    const subscriptionList = await prisma.pushSubscription.findMany({
      where: {
        user: { email: session?.user?.email },
      },
    });
    console.log({ subscriptionList });
    try {
      const picked = (({ endpoint, expirationTime, keys }) => ({ endpoint, expirationTime, keys }))(
        subscriptionList[0]
      );
      const wpRes = await wpClient.sendNotification(
        picked,
        JSON.stringify({
          title: 'TEST - push notification',
          message: 'Your web push notification is here!',
        })
      );
      res.writeHead(wpRes.statusCode, wpRes.headers).end(wpRes.body);
      res.end();
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wronf' });
      return;
    }
  }
  res.status(404).json({ error: 'Resource not found' });
}
