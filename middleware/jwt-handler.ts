import type { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export const JwtAuthMiddleware = async (req: NextApiRequest) => {
  if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
    const missingAuthError = new Error('Missing Authorization Header');
    missingAuthError.status = 401;
    throw missingAuthError;
  }
  try {
    const bearerToken = req.headers.authorization.split(' ')[1];
    console.log({ bearerToken });
    const decodedPayload = jwt.verify(bearerToken, JWT_SECRET);
    console.log(decodedPayload);
    return decodedPayload;
  } catch (error) {
    const invalidTokenError = new Error('Invalid Auth Token');
    invalidTokenError.status = 401;
    throw invalidTokenError;
  }
};
