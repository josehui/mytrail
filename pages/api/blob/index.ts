// pages/api/post/index.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import fs from 'fs';
import formidable from 'formidable';
import uploadFileToBlob from '../../../lib/azure-blob';

export const config = {
  api: {
    bodyParser: false,
  },
};
// POST /api/blob
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const contentType = req.headers['content-type'];
  if (contentType && contentType.indexOf('multipart/form-data') !== -1) {
    const session = await getSession({ req });
    if (!session) {
      res.status(401);
      return;
    }
    if (req.method === 'POST') {
      const form = new formidable.IncomingForm();
      // fix type issue from library
      const imageURLs: string[] = [];
      form.parse(req, async (err, fields, files: any) => {
        if (err) {
          res.status(400).json({ error: 'Resource not found' });
          return;
        }
        // Execute each upload in parallel
        await Promise.all(
          Object.keys(files).map(async (key) => {
            const data = fs.readFileSync(files[key].filepath);
            const mimeType = files[key].mimetype;
            const fileName = files[key].newFilename;
            try {
              const imageURL = await uploadFileToBlob(data, mimeType, fileName);
              imageURLs.push(imageURL);
            } catch (error) {
              console.error(error);
            }
          })
        );
        res.status(200).json({ message: 'Accepted', images: imageURLs });
      });
    }
  } else {
    res.status(404).json({ error: 'Resource not found' });
  }
}
