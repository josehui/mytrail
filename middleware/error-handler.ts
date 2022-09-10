import type { NextApiResponse } from 'next';

export const BaseErrorHandler = (err: any, res: NextApiResponse) => {
  if (err.status) {
    // status code set in error object
    return res.status(err.status).json({ message: err.message });
  }
  // default to 500 server error
  return res.status(500).json({ message: err.message });
};
