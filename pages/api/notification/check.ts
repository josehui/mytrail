import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import wpClient from '../../../lib/web-push';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (req.method === 'POST' && session) {
    const { subscription } = req.body;
    try {
      const wpRes = await wpClient.sendNotification(
        subscription,
        JSON.stringify({
          title: 'TEST - Push Notification',
          message: 'Your notification is here!',
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
