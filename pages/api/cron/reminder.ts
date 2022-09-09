import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import wpClient from '../../../lib/web-push';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TO-DO verify JWT, return if not valid
  if (req.method === 'POST') {
    const lastFootprintList = await prisma.footprint.findMany({
      where: {},
      orderBy: {
        createdAt: 'desc',
      },
      distinct: ['authorId'],
      include: {
        author: {
          include: {
            pushNotification: true,
            setting: {
              select: {
                reminderFreq: true,
              },
            },
          },
        },
      },
    });

    for (let i = 0; i < lastFootprintList.length; i += 1) {
      const freq = lastFootprintList[i]?.author?.setting?.reminderFreq || 180;
      const lastTimestamp = lastFootprintList[i].createdAt;
      // TO-DO check last notification as well
      if (lastTimestamp < new Date(Date.now() - 1000 * 60 * freq)) {
        lastFootprintList[i].author?.pushNotification.forEach(async (subData) => {
          console.log({ subData });
          const subscription = (({ endpoint, expirationTime, keys }) => ({
            endpoint,
            expirationTime,
            keys: JSON.parse(JSON.stringify(keys)),
          }))(subData);
          try {
            await wpClient.sendNotification(
              subscription,
              JSON.stringify({
                title: 'TEST - push notification',
                message: 'Your web push notification is here!',
              })
            );
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong' });
          }
        });
      }
    }
    res.status(200).json({ message: 'Reminder sent succcessfully' });
    return;
  }
  res.status(404).json({ error: 'Resource not found' });
}
