// pages/api/post/index.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const API_KEY = process.env.GOOGLE_MAP_KEY!;
// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
  }
  if (req.method === 'GET') {
    const latlng = req.query?.latlng;
    const baseURL = 'https://maps.googleapis.com/maps/api/geocode/json?';
    if (!latlng) {
      res.status(400).json({ error: 'Missing latlng parameter' });
    }
    const params = new URLSearchParams({
      latlng: latlng as string,
      key: API_KEY,
    });
    try {
      const addressRes = await fetch(baseURL + params, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const addressData = await addressRes.json();
      res.json(addressData);
    } catch (error) {
      console.error(error);
    }
  } else {
    res.status(404).json({ error: 'Resource not found' });
  }
}
