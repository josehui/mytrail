import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import webPush from 'web-push';

webPush.setVapidDetails(
  `mailto:${process.env.WEB_PUSH_EMAIL}`,
  process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY!,
  process.env.WEB_PUSH_PRIVATE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (req.method === 'POST' && session) {
    const { subscription } = req.body;
    try {
      const wpRes = await webPush.sendNotification(
        subscription,
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
