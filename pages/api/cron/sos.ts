import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { transporter, sosEmailOption, createSOSEmail } from '../../../lib/mail';
import { JwtAuthMiddleware } from '../../../middleware/jwt-handler';
import { BaseErrorHandler } from '../../../middleware/error-handler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
              setting: {
                select: {
                  sosTime: true,
                  emailList: true,
                },
              },
            },
          },
        },
      });
      // Array of async tasks for sending emails
      const sosEmailTasks = [];
      const userList = [];
      for (let i = 0; i < lastFootprintList.length; i += 1) {
        const freq = lastFootprintList[i]?.author?.setting?.sosTime || 24;
        const lastTimestamp = Math.max(
          lastFootprintList[i].createdAt.getTime(),
          lastFootprintList[i].author?.lastSosEmail?.getTime() || 0
        );
        const recipientList = lastFootprintList[i]?.author?.setting?.emailList;
        // convert to ms
        if (lastTimestamp < new Date(Date.now()).getTime() - 36e5 * freq && recipientList?.length) {
          const recipents = recipientList.toString();
          const userName =
            // must have email but not name
            lastFootprintList[i]?.author?.name || lastFootprintList[i]?.author?.email!;
          const subject = `[URGENT] ${userName} might be in danger`;
          const message = createSOSEmail(userName, lastFootprintList[i]);
          const mailOption = sosEmailOption(recipents, subject, message);
          // Task for sending email
          sosEmailTasks.push(transporter.sendMail(mailOption));
          // Task for update lastEmail
          sosEmailTasks.push(
            prisma.user.update({
              where: {
                email: lastFootprintList[i]?.author?.email!,
              },
              data: {
                lastSosEmail: new Date(),
              },
            })
          );
          userList.push(lastFootprintList[i]?.author?.email);
        }
      }
      await Promise.all(sosEmailTasks);
      res.status(200).json({ message: 'SOS emails sent succcessfully', users: userList });
      return;
    }
  } catch (error) {
    console.error(error);
    BaseErrorHandler(error, res);
    return;
  }
  res.status(404).json({ error: 'Resource not found' });
}
