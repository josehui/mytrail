import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import wpClient from '../../../lib/web-push';
import { JwtAuthMiddleware } from '../../../middleware/jwt-handler';
import { BaseErrorHandler } from '../../../middleware/error-handler';

const reminderMessage = JSON.stringify({
  title: 'Reminder - add your footprint',
  message: "You haven't posted a footprint in a while!",
  actions: [
    {
      action: 'Add',
      title: 'Add Footprint',
    },
  ],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TO-DO verify JWT, return if not valid
  try {
    await JwtAuthMiddleware(req);
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
      // Array of async tasks for updating user lastReminder
      const userUpdateTasks = [];
      const userList = [];
      for (let i = 0; i < lastFootprintList.length; i += 1) {
        const freq = lastFootprintList[i]?.author?.setting?.reminderFreq || 180;
        const lastTimestamp = Math.max(
          lastFootprintList[i].createdAt.getTime(),
          lastFootprintList[i].author?.lastReminder?.getTime() || 0
        );
        // compare last notification/ footprint with configured reminderFreq
        if (lastTimestamp < new Date(Date.now()).getTime() - 1000 * 60 * freq) {
          lastFootprintList[i].author?.pushNotification.forEach(async (subData) => {
            const subscription = (({ endpoint, expirationTime, keys }) => ({
              endpoint,
              expirationTime,
              keys: JSON.parse(JSON.stringify(keys)),
            }))(subData);
            try {
              await wpClient.sendNotification(subscription, reminderMessage);
            } catch (error) {
              console.error(error);
              // Remove invalid subscription
              await prisma.pushSubscription.delete({
                where: {
                  id: subData.id,
                },
              });
            }
          });
          // push tasks to
          userUpdateTasks.push(
            prisma.user.update({
              where: {
                email: lastFootprintList[i]?.author?.email!,
              },
              data: {
                lastReminder: new Date(),
              },
            })
          );
          userList.push(lastFootprintList[i].author?.email);
        }
      }
      await Promise.all(userUpdateTasks);
      res.status(200).json({ message: 'Reminder sent succcessfully', users: userList });
      return;
    }
  } catch (error) {
    console.error(error);
    BaseErrorHandler(error, res);
    return;
  }
  res.status(404).json({ error: 'Resource not found' });
}
