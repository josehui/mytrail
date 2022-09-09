import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { transporter, sosEmailOption, createSOSEmail } from '../../../lib/mail';

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
    for (let i = 0; i < lastFootprintList.length; i += 1) {
      const freq = lastFootprintList[i]?.author?.setting?.sosTime || 24;
      const lastTimestamp = lastFootprintList[i].createdAt;
      const recipientList = lastFootprintList[i]?.author?.setting?.emailList;
      // convert to ms
      if (lastTimestamp < new Date(Date.now() - 36e5 * freq) && recipientList?.length) {
        // if (lastTimestamp < new Date(Date.now()) && recipientList?.length) {
        const recipents = recipientList.toString();
        try {
          const userName =
            lastFootprintList[i]?.author?.name || lastFootprintList[i]?.author?.email!;
          const subject = `[URGENT] ${userName} might be in danger`;
          const message = createSOSEmail(userName, lastFootprintList[i]);
          const mailOption = sosEmailOption(recipents, subject, message);
          sosEmailTasks.push(transporter.sendMail(mailOption));
        } catch (error) {
          console.error(error);
        }
      }
    }
    await Promise.all(sosEmailTasks);
    res.status(200).json({ message: 'SOS emails sent succcessfully' });
    return;
  }
  res.status(404).json({ error: 'Resource not found' });
}
